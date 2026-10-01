import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { aHtml } from '@/lib/chatbot/markdown';
import { actualizarConocimiento, revisarPendientes } from './acciones';

/**
 * /administrator/chatbot (H5.3). Molde Andrea / Neotérmica:
 *   · Respuestas: cada respuesta del asistente con su pregunta y la nota del revisor (10/5/0).
 *   · Conversaciones: cada hilo con su nota media; al pulsar, el hilo completo.
 * Solo lectura: el chat de un visitante no se borra nunca.
 */
export const dynamic = 'force-dynamic';

type Msg = { id: string; thread_id: string; created_at: string; role: 'user' | 'assistant'; content: string };
type Hilo = { id: string; created_at: string; session_id: string; idioma: string };
type SP = Promise<{ vista?: string; calidad?: string; hilo?: string; q?: string }>;

const CALIDADES = [
  { id: 'correcta', label: 'Correcta (10)', score: 10, clase: 'bg-green-100 text-green-800' },
  { id: 'mejorable', label: 'Mejorable (5)', score: 5, clase: 'bg-amber-100 text-amber-800' },
  { id: 'incorrecta', label: 'Incorrecta (0)', score: 0, clase: 'bg-red-100 text-red-800' },
  { id: 'sin', label: 'Sin nota', score: null, clase: 'bg-gray-100 text-gray-600' },
] as const;

function calidadDe(score: number | null | undefined) {
  return CALIDADES.find((c) => c.score === (score ?? null)) ?? CALIDADES[3];
}

function fecha(iso: string) {
  return new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function Nota({ score }: { score: number | null | undefined }) {
  const c = calidadDe(score);
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.clase}`}>{c.label}</span>;
}

export default async function ChatbotAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase en .env.local.</p>;

  const [t, m, r] = await Promise.all([
    db.from('chat_threads').select('id, created_at, session_id, idioma').order('created_at', { ascending: false }).limit(1000),
    db.from('chat_messages').select('id, thread_id, created_at, role, content').order('created_at', { ascending: true }).limit(5000),
    db.from('chat_reviews').select('message_id, score, notes'),
  ]);

  const error = t.error ?? m.error ?? r.error;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">No se pueden leer las tablas del chat.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <p className="mt-3 text-sm">Si dice que la tabla no existe: ejecutar <code>supabase/migrations/0003_chatbot.sql</code> en el SQL Editor de Supabase.</p>
      </div>
    );
  }

  const hilos = (t.data ?? []) as Hilo[];
  const mensajes = (m.data ?? []) as Msg[];
  const nota = new Map((r.data ?? []).map((x) => [x.message_id as string, { score: x.score as number, notes: (x.notes as string | null) ?? '' }]));

  const porHilo = new Map<string, Msg[]>();
  for (const msg of mensajes) {
    const lista = porHilo.get(msg.thread_id) ?? [];
    lista.push(msg);
    porHilo.set(msg.thread_id, lista);
  }
  const preguntaDe = (msg: Msg) => {
    const hilo = porHilo.get(msg.thread_id) ?? [];
    const idx = hilo.findIndex((x) => x.id === msg.id);
    return [...hilo.slice(0, idx)].reverse().find((x) => x.role === 'user')?.content ?? '';
  };

  const respuestas = mensajes.filter((x) => x.role === 'assistant').reverse();
  const stats = Object.fromEntries(CALIDADES.map((c) => [c.id, respuestas.filter((x) => calidadDe(nota.get(x.id)?.score).id === c.id).length]));
  const vista = sp.hilo ? 'hilo' : sp.vista === 'conversaciones' ? 'conversaciones' : 'respuestas';

  const pestaña = (id: string, texto: string) => (
    <Link
      href={`/administrator/chatbot${id === 'respuestas' ? '' : `?vista=${id}`}`}
      className={`rounded-md px-4 py-2 text-sm font-semibold ${vista === id ? 'bg-tinta text-white' : 'bg-papel hover:bg-white'}`}
    >
      {texto}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Chatbot</h1>
          <p className="text-sm text-tinta-2">
            {hilos.length} conversaciones · {respuestas.length} respuestas. El chat de un visitante no se borra.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={actualizarConocimiento}>
            <button
              type="submit"
              title="Vuelve a leer áreas, landings, internacional y blog publicados"
              className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta"
            >
              Actualizar conocimiento
            </button>
          </form>
          <form action={revisarPendientes}>
            <button type="submit" className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta hover:bg-marca-hover disabled:opacity-40" disabled={stats.sin === 0}>
              Revisar pendientes ({stats.sin})
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {CALIDADES.map((c) => (
          <Link
            key={c.id}
            href={`/administrator/chatbot?calidad=${c.id}`}
            className={`rounded-xl border bg-papel p-4 hover:border-tinta ${sp.calidad === c.id ? 'border-tinta' : 'border-linea'}`}
          >
            <p className="text-2xl font-bold">{stats[c.id]}</p>
            <Nota score={c.score} />
          </Link>
        ))}
      </div>

      <div className="flex gap-2">
        {pestaña('respuestas', 'Respuestas')}
        {pestaña('conversaciones', 'Conversaciones')}
      </div>

      {vista === 'respuestas' && (
        <div className="overflow-x-auto rounded-xl border border-linea bg-papel">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-linea bg-niebla text-xs text-tinta-2">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Pregunta</th>
                <th className="px-4 py-3">Respuesta</th>
                <th className="px-4 py-3">Nota del revisor</th>
              </tr>
            </thead>
            <tbody>
              {respuestas
                .filter((x) => !sp.calidad || calidadDe(nota.get(x.id)?.score).id === sp.calidad)
                .map((x) => (
                  <tr key={x.id} className="border-b border-niebla align-top last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-tinta-2">
                      <Link href={`/administrator/chatbot?hilo=${x.thread_id}`} className="underline">{fecha(x.created_at)}</Link>
                    </td>
                    <td className="max-w-[220px] px-4 py-3 font-medium">{preguntaDe(x)}</td>
                    <td className="max-w-[420px] px-4 py-3">
                      <div className="chat-markdown line-clamp-6" dangerouslySetInnerHTML={{ __html: aHtml(x.content) }} />
                    </td>
                    <td className="max-w-[240px] px-4 py-3">
                      <Nota score={nota.get(x.id)?.score} />
                      {nota.get(x.id)?.notes && <p className="mt-1.5 text-xs text-tinta-2">{nota.get(x.id)?.notes}</p>}
                    </td>
                  </tr>
                ))}
              {respuestas.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-tinta-2">Todavía no hay conversaciones. Pruebe el chat en la web.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {vista === 'conversaciones' && (
        <div className="overflow-x-auto rounded-xl border border-linea bg-papel">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-linea bg-niebla text-xs text-tinta-2">
              <tr>
                <th className="px-4 py-3">Último mensaje</th>
                <th className="px-4 py-3">Primera pregunta</th>
                <th className="px-4 py-3">Idioma</th>
                <th className="px-4 py-3">Preguntas</th>
                <th className="px-4 py-3">Nota media</th>
              </tr>
            </thead>
            <tbody>
              {hilos
                .map((h) => {
                  const msgs = porHilo.get(h.id) ?? [];
                  const notas = msgs.filter((x) => x.role === 'assistant').map((x) => nota.get(x.id)?.score).filter((n): n is number => typeof n === 'number');
                  return {
                    h,
                    ultimo: msgs[msgs.length - 1]?.created_at ?? h.created_at,
                    primera: msgs.find((x) => x.role === 'user')?.content ?? '',
                    preguntas: msgs.filter((x) => x.role === 'user').length,
                    media: notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null,
                  };
                })
                .sort((a, b) => (a.ultimo < b.ultimo ? 1 : -1))
                .map(({ h, ultimo, primera, preguntas, media }) => (
                  <tr key={h.id} className="border-b border-niebla last:border-0 hover:bg-niebla">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-tinta-2">{fecha(ultimo)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/administrator/chatbot?hilo=${h.id}`} className="font-medium underline">{primera || '(sin texto)'}</Link>
                    </td>
                    <td className="px-4 py-3 uppercase">{h.idioma}</td>
                    <td className="px-4 py-3">{preguntas}</td>
                    <td className="px-4 py-3">{media === null ? <Nota score={null} /> : <span className="font-semibold">{media.toFixed(1)} / 10</span>}</td>
                  </tr>
                ))}
              {hilos.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-tinta-2">Todavía no hay conversaciones.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {vista === 'hilo' && sp.hilo && (
        <div className="space-y-3">
          <Link href="/administrator/chatbot?vista=conversaciones" className="text-sm underline">← Volver a las conversaciones</Link>
          <div className="space-y-3 rounded-xl border border-linea bg-papel p-5">
            {(porHilo.get(sp.hilo) ?? []).map((x) => (
              <div key={x.id} className={x.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${x.role === 'user' ? 'bg-tinta text-white' : 'bg-niebla'}`}>
                  <p className="mb-1 text-[11px] opacity-60">{x.role === 'user' ? 'Visitante' : 'Asistente'} · {fecha(x.created_at)}</p>
                  {x.role === 'assistant' ? (
                    <>
                      <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: aHtml(x.content) }} />
                      <div className="mt-2 border-t border-linea pt-2">
                        <Nota score={nota.get(x.id)?.score} />
                        {nota.get(x.id)?.notes && <p className="mt-1 text-xs text-tinta-2">{nota.get(x.id)?.notes}</p>}
                      </div>
                    </>
                  ) : (
                    x.content
                  )}
                </div>
              </div>
            ))}
            {(porHilo.get(sp.hilo) ?? []).length === 0 && <p className="text-tinta-2">Conversación no encontrada.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
