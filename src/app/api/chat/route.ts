import { after } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { CHAT_MODEL } from '@/lib/chatbot/prompt';
import { prepararTurno, type Turno } from '@/lib/chatbot/responder';
import { auditarYGuardar } from '@/lib/chatbot/auditor';
import { ES, EN } from '@/lib/rutas';

/**
 * POST /api/chat — chatbot de Serveco (partida 05). Molde Neotérmica / Laura, endurecido:
 *  · El historial se lee de la BD (no se fía del navegador).
 *  · El hilo solo se continúa si pertenece a la misma sesión.
 *  · Límites de gasto: por sesión/hora y total diario (CHAT_MAX_DIARIO).
 *  · El revisor corre con after(): en Vercel no se pierde al cerrar la respuesta.
 * Respuesta por SSE: eventos `thread`, `delta`, `done`. El chat de un visitante no se borra.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { message?: string; sessionId?: string; threadId?: string | null; lang?: string };

const MAX_HISTORIAL = 10;
const MAX_POR_SESION_HORA = 30;
const MAX_DIARIO = Number(process.env.CHAT_MAX_DIARIO ?? 500);
const UUID = /^[0-9a-f-]{36}$/i;

function sse(evento: string, dato: unknown): string {
  return `event: ${evento}\ndata: ${JSON.stringify(dato)}\n\n`;
}

/** Respuesta fija (límite, error) con el mismo formato SSE que una respuesta del modelo. */
function respuestaFija(texto: string, threadId: string | null, sessionId: string) {
  const cuerpo = sse('thread', { threadId, sessionId }) + sse('delta', { text: texto }) + sse('done', { threadId });
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache' } });
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return new Response('Petición no válida', { status: 400 });
  }

  const message = String(body.message ?? '').trim().slice(0, 2000);
  if (!message) return new Response('Mensaje vacío', { status: 400 });
  const sessionId = String(body.sessionId ?? '').slice(0, 80) || crypto.randomUUID();
  const idioma = body.lang === 'en' ? 'en' : 'es';
  const contacto = idioma === 'en' ? `[Contact us](${EN.contact})` : `[Hacer una consulta](${ES.contacto})`;

  const db = supabaseAdmin();

  // 1) El hilo solo se continúa si es de esta sesión. Si no, se abre uno nuevo.
  let threadId: string | null = null;
  let history: Turno[] = [];
  if (db && body.threadId && UUID.test(body.threadId)) {
    const { data: hilo } = await db.from('chat_threads').select('id, session_id').eq('id', body.threadId).maybeSingle();
    if (hilo && hilo.session_id === sessionId) {
      threadId = hilo.id as string;
      // 2) Historial desde la BD, no desde el navegador.
      const { data: previos } = await db
        .from('chat_messages')
        .select('role, content, created_at')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: false })
        .limit(MAX_HISTORIAL);
      history = ((previos ?? []) as Turno[]).reverse().map((t) => ({ role: t.role, content: t.content }));
    }
  }

  // 3) Límites de gasto.
  if (db) {
    const haceUnaHora = new Date(Date.now() - 3600_000).toISOString();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const { data: hilosSesion } = await db.from('chat_threads').select('id').eq('session_id', sessionId);
    const ids = (hilosSesion ?? []).map((h) => h.id as string);
    const [{ count: enSesion }, { count: hoyTotal }] = await Promise.all([
      ids.length
        ? db.from('chat_messages').select('id', { count: 'exact', head: true }).eq('role', 'user').in('thread_id', ids).gte('created_at', haceUnaHora)
        : Promise.resolve({ count: 0 }),
      db.from('chat_messages').select('id', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', hoy.toISOString()),
    ]);
    if ((enSesion ?? 0) >= MAX_POR_SESION_HORA || (hoyTotal ?? 0) >= MAX_DIARIO) {
      const aviso =
        idioma === 'en'
          ? `We have reached the limit of questions for now. Please ${contacto} and our team will answer you.`
          : `Hemos llegado al límite de preguntas por ahora. ${contacto} y le responde el equipo.`;
      return respuestaFija(aviso, threadId, sessionId);
    }
  }

  async function guardar(role: 'user' | 'assistant', content: string, ragGap?: unknown): Promise<string | null> {
    if (!db) return null;
    if (!threadId) {
      const { data, error } = await db.from('chat_threads').insert({ session_id: sessionId, idioma }).select('id').single();
      if (error) {
        console.error('[chat] no se pudo crear el hilo:', error.message);
        return null;
      }
      threadId = data.id as string;
    }
    const { data, error } = await db
      .from('chat_messages')
      .insert({ thread_id: threadId, role, content, rag_gap: ragGap ?? null })
      .select('id')
      .single();
    if (error) console.error('[chat] no se pudo guardar el mensaje:', error.message);
    return (data?.id as string | undefined) ?? null;
  }

  const { mensajes, ragGap, fichaTexto, contexto } = await prepararTurno({ message, history, idioma });
  // Lo que el revisor debe ver: la misma ficha y el mismo contexto que vio el asistente.
  const fichaRevisor = contexto ? `${fichaTexto}\n\n${contexto}` : fichaTexto;
  await guardar('user', message, ragGap);

  const hiloCorto = history
    .map((t) => `${t.role === 'user' ? 'Visitante' : 'Asistente'}: ${t.content}`)
    .join('\n')
    .slice(0, 3500);

  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  // 4) Revisor con after(): se registra YA (antes de devolver la respuesta) y espera a que
  //    termine el stream. Así en Vercel no se corta al cerrar la conexión.
  type Revision = { messageId: string; pregunta: string; respuesta: string; hilo: string; ficha: string };
  let entregarRevision: (r: Revision | null) => void = () => {};
  const revisionPendiente = new Promise<Revision | null>((resolve) => {
    entregarRevision = resolve;
  });
  after(async () => {
    const r = await revisionPendiente;
    if (r) await auditarYGuardar(r);
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (evento: string, dato: unknown) => controller.enqueue(encoder.encode(sse(evento, dato)));
      push('thread', { threadId, sessionId });

      let completo = '';

      if (!apiKey) {
        completo =
          idioma === 'en'
            ? `The assistant is not available right now. Please ${contacto} and we will get back to you.`
            : `Ahora mismo el asistente no está disponible. ${contacto} y le respondemos.`;
        push('delta', { text: completo });
      } else {
        try {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: CHAT_MODEL,
              messages: mensajes,
              stream: true,
              max_completion_tokens: 700, // GPT-5.x: sin temperature
              reasoning_effort: 'none',
            }),
          });
          if (!res.ok || !res.body) {
            console.error('[chat] OpenAI:', res.status, await res.text());
            throw new Error('respuesta no válida del modelo');
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lineas = buffer.split('\n');
            buffer = lineas.pop() ?? '';
            for (const linea of lineas) {
              const t = linea.trim();
              if (!t.startsWith('data:')) continue;
              const payload = t.slice(5).trim();
              if (payload === '[DONE]') continue;
              try {
                const json = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
                const trozo = json.choices?.[0]?.delta?.content;
                if (trozo) {
                  completo += trozo;
                  push('delta', { text: trozo });
                }
              } catch {
                // trozo incompleto: se ignora
              }
            }
          }
        } catch (error) {
          console.error('[chat] fallo del stream:', error);
          if (!completo) {
            completo =
              idioma === 'en'
                ? `My answer was cut off. Please try again or ${contacto}.`
                : `Se me ha cortado la respuesta. Pruebe otra vez o ${contacto}.`;
            push('delta', { text: completo });
          }
        }

        // gpt-5 a veces devuelve vacío: no dejar la burbuja en blanco.
        if (!completo.trim()) {
          completo = idioma === 'en' ? `Sorry, I could not answer that. Please ${contacto}.` : `Disculpe, no he podido responder. ${contacto}.`;
          push('delta', { text: completo });
        }
      }

      const messageId = await guardar('assistant', completo);
      push('done', { threadId });
      controller.close();
      entregarRevision(messageId && apiKey ? { messageId, pregunta: message, respuesta: completo, hilo: hiloCorto, ficha: fichaRevisor } : null);
    },
    cancel() {
      // El visitante cerró la pestaña a mitad: no hay nada que revisar.
      entregarRevision(null);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
