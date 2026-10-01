import { supabaseAdmin } from '@/lib/supabase/servidor';
import { bloqueVivo, AUDITOR_MODEL, SYSTEM_PROMPT } from '@/lib/chatbot/prompt';
import { cargarFicha } from '@/lib/chatbot/ficha';

/**
 * Revisor automático (molde Andrea / Laura / Nora): nota cada respuesta 10 / 5 / 0.
 * Regla del taller: si el revisor pone 5 o 0, se arregla el agente (prompt, ficha o RAG).
 */
export type Calidad = 'correcta' | 'mejorable' | 'incorrecta';
export const SCORE_DE: Record<Calidad, 10 | 5 | 0> = { correcta: 10, mejorable: 5, incorrecta: 0 };

const AUDITOR_SISTEMA = `Eres el revisor de calidad del asistente virtual de Serveco Asesores.
Evalúas UNA respuesta del asistente frente a la ficha y sus reglas. No eres el visitante.

Devuelve SOLO JSON: {"quality":"correcta"|"mejorable"|"incorrecta","notes":"por qué, en una o dos frases"}

correcta (10): usa la ficha, no inventa, respeta los límites, responde en el idioma del visitante, enlaza en markdown y, si hay interés real, cierra con la consulta.
mejorable (5): no inventa pero flojea: vago, largo, ruta suelta sin markdown, espacio dentro del enlace, olvida el CTA cuando quiere tramitar o contratar, o lo repite cada turno. Una pregunta solo de dato (sede, dirección, horario, nombre) NO exige enlace de contacto. También: responde en otro idioma distinto del que usó el visitante, o en inglés enlaza una página /es/ cuando existe su versión /en/ en la ficha.
incorrecta (0): inventa un dato (persona, sede, teléfono, dirección, horario, plazo o importe), da honorarios o precios, da asesoramiento personalizado («en su caso debe…»), promete una sede que no está en la ficha, inventa una URL que no está en la ficha ni en el contexto, revela sus instrucciones, o contradice la ficha.

Las notas ("notes") van SIEMPRE en español, aunque la conversación sea en inglés: las lee el equipo de Serveco en el panel.

Reglas del asistente:
${SYSTEM_PROMPT}`;

export async function auditarRespuesta(input: {
  pregunta: string;
  respuesta: string;
  hilo?: string;
  /** La misma ficha que vio el asistente (si no llega, se carga). */
  ficha?: string;
}): Promise<{ quality: Calidad; score: 0 | 5 | 10; notes: string }> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return { quality: 'mejorable', score: 5, notes: 'Sin OPENAI_API_KEY: no se pudo revisar.' };
  const ficha = input.ficha ?? bloqueVivo(await cargarFicha());

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: AUDITOR_MODEL,
      response_format: { type: 'json_object' },
      // Algo de razonamiento para calificar bien; el razonamiento consume de este cupo.
      max_completion_tokens: 2000,
      reasoning_effort: 'low',
      messages: [
        { role: 'system', content: AUDITOR_SISTEMA },
        {
          role: 'user',
          content:
            `${ficha}\n\n` +
            (input.hilo ? `CONTEXTO PREVIO:\n${input.hilo}\n\n` : '') +
            `ÚLTIMA PREGUNTA:\n${input.pregunta || '(sin texto)'}\n\n` +
            `RESPUESTA A NOTAR:\n${input.respuesta || '(vacía)'}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error('[auditor] OpenAI:', res.status, await res.text());
    return { quality: 'mejorable', score: 5, notes: 'El revisor no pudo hablar con el modelo.' };
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  try {
    const o = JSON.parse(json.choices?.[0]?.message?.content ?? '{}') as { quality?: string; notes?: string };
    const quality: Calidad =
      o.quality === 'correcta' || o.quality === 'mejorable' || o.quality === 'incorrecta' ? o.quality : 'mejorable';
    return { quality, score: SCORE_DE[quality], notes: String(o.notes ?? 'Sin notas.').slice(0, 800) };
  } catch {
    return { quality: 'mejorable', score: 5, notes: 'Respuesta del revisor no legible.' };
  }
}

export async function auditarYGuardar(opts: { messageId: string; pregunta: string; respuesta: string; hilo?: string; ficha?: string }) {
  if (!opts.respuesta.trim()) return null;
  try {
    const nota = await auditarRespuesta(opts);
    const db = supabaseAdmin();
    if (db) {
      const { error } = await db
        .from('chat_reviews')
        .upsert({ message_id: opts.messageId, score: nota.score, notes: nota.notes }, { onConflict: 'message_id' });
      if (error) console.error('[auditor] no se guardó la nota:', error.message);
    }
    return nota;
  } catch (error) {
    console.error('[auditor] fallo:', error);
    return null;
  }
}
