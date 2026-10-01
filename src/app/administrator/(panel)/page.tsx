import Link from 'next/link';
import { obtenerResumen, type SerieDia } from '@/lib/panel/resumen';
import { CONOCIO, ESTADOS, PRIORIDADES, etiqueta } from '@/lib/crm';
import { usuarioActual } from '@/lib/admin';

/**
 * /administrator — PANEL DE INICIO. Lo primero al entrar: qué requiere atención hoy, cómo van
 * consultas, chat y blog (30 días frente a los 30 anteriores) y el estado técnico.
 * Datos: src/lib/panel/resumen.ts (tolerante a migraciones sin aplicar).
 */
export const dynamic = 'force-dynamic';

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

function saludo(): string {
  const h = Number(new Date().toLocaleString('es-ES', { hour: '2-digit', hour12: false, timeZone: 'Europe/Madrid' }));
  return h < 14 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

function Delta({ ahora, antes }: { ahora: number; antes: number }) {
  if (antes === 0 && ahora === 0) return <span className="text-xs text-tinta-2">sin datos previos</span>;
  if (antes === 0) return <span className="text-xs text-green-700">nuevo</span>;
  const pct = Math.round(((ahora - antes) / antes) * 100);
  const color = pct > 0 ? 'text-green-700' : pct < 0 ? 'text-red-700' : 'text-tinta-2';
  return <span className={`text-xs ${color}`}>{pct > 0 ? '▲' : pct < 0 ? '▼' : '='} {Math.abs(pct)} % vs 30 días anteriores</span>;
}

function Kpi({ titulo, valor, pie }: { titulo: string; valor: string | number; pie?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-linea bg-papel p-4">
      <p className="text-sm text-tinta-2">{titulo}</p>
      <p className="mt-1 text-3xl font-bold">{valor}</p>
      {pie && <div className="mt-1">{pie}</div>}
    </div>
  );
}

function Tarea({ n, texto, href, tono = 'normal', ayuda }: { n: number; texto: string; href: string; tono?: 'urgente' | 'normal' | 'info'; ayuda?: string }) {
  const estilo =
    n === 0
      ? 'border-linea bg-papel text-tinta-2'
      : tono === 'urgente'
        ? 'border-red-300 bg-red-50 text-red-900'
        : tono === 'info'
          ? 'border-linea bg-niebla text-tinta'
          : 'border-marca bg-marca-suave text-tinta';
  return (
    <Link href={href} className={`flex items-center gap-4 rounded-xl border-2 p-4 hover:border-tinta ${estilo}`}>
      <span className="min-w-10 text-3xl font-bold">{n}</span>
      <span className="text-sm">
        <span className="font-semibold">{texto}</span>
        {ayuda && <span className="block text-xs opacity-80">{ayuda}</span>}
      </span>
    </Link>
  );
}

function Barras({ serie, titulo, total }: { serie: SerieDia[]; titulo: string; total: number }) {
  const max = Math.max(1, ...serie.map((s) => s.valor));
  return (
    <div className="rounded-xl border border-linea bg-papel p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-bold">{titulo}</h3>
        <span className="text-sm text-tinta-2">{total} en 30 días</span>
      </div>
      <div className="flex h-28 items-end gap-[3px]" role="img" aria-label={`${titulo}: ${total} en los últimos 30 días`}>
        {serie.map((s) => (
          <div key={s.dia} className="group relative flex-1" title={`${fecha(s.dia)}: ${s.valor}`}>
            <div className={`w-full rounded-t ${s.valor ? 'bg-marca' : 'bg-niebla'}`} style={{ height: `${Math.max(4, (s.valor / max) * 100)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-tinta-2">
        <span>{fecha(serie[0]?.dia ?? new Date().toISOString())}</span>
        <span>hoy</span>
      </div>
    </div>
  );
}

function Etiqueta({ lista, valor }: { lista: readonly { valor: string; texto: string; clase: string }[]; valor: string }) {
  const e = lista.find((x) => x.valor === valor);
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${e?.clase ?? 'bg-gray-100'}`}>{e?.texto ?? valor}</span>;
}

export default async function PanelInicio() {
  const [r, usuario] = await Promise.all([obtenerResumen(), usuarioActual()]);
  if (!r) return <p>Falta configurar Supabase.</p>;
  const { contactos: c, chat, blog, sistema, spam7 } = r;

  const nombre = (usuario?.email ?? '').split('@')[0];
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' });
  const pendientesTotal =
    (c?.altasSinAtender.length ?? 0) + (c?.nuevos ?? 0) + (c?.vencidos.length ?? 0) + (chat?.sinCalificar ?? 0) + (blog?.borradores.length ?? 0);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-tinta-2">{hoy}</p>
          <h1 className="text-2xl font-bold">
            {saludo()}
            {nombre ? `, ${nombre}` : ''}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/administrator/contactos" className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta hover:bg-marca-hover">
            Ver contactos
          </Link>
          <Link href="/administrator/blog" className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta">
            Redactar artículo
          </Link>
          <Link href="/es" className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta">
            Ver la web
          </Link>
        </div>
      </div>

      {/* 1. Requiere atención */}
      <section>
        <h2 className="mb-3 text-lg font-bold">{pendientesTotal === 0 ? 'Todo al día' : 'Requiere atención'}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c && (
            <>
              <Tarea
                n={c.altasSinAtender.length}
                texto="Consultas de prioridad alta sin atender"
                ayuda="Plazos, requerimientos o empresas que quieren cambiar de asesoría"
                href="/administrator/contactos?prioridad=alta&estado=nuevo"
                tono="urgente"
              />
              <Tarea n={c.nuevos} texto="Consultas nuevas" ayuda="Aún en estado «Nuevo»" href="/administrator/contactos?estado=nuevo" />
              <Tarea n={c.vencidos.length} texto="Seguimientos para hoy o vencidos" href="/administrator/contactos" tono="urgente" />
            </>
          )}
          {chat && (
            <>
              <Tarea
                n={chat.sinCalificar}
                texto="Respuestas del chat sin calificar"
                ayuda="Pulse «Revisar pendientes» en el panel del chat"
                href="/administrator/chatbot"
              />
              <Tarea n={chat.reparto30.incorrecta} texto="Respuestas incorrectas del chat (30 días)" ayuda="Hay que ajustar el prompt o el conocimiento" href="/administrator/chatbot" tono="urgente" />
            </>
          )}
          {blog && (
            <Tarea
              n={blog.borradores.length}
              texto="Artículos en borrador"
              ayuda={blog.conGraves ? `${blog.conGraves} con avisos graves · necesitan revisión de un abogado` : 'Necesitan revisión de un abogado para publicarse'}
              href="/administrator/blog"
            />
          )}
          {spam7 !== null && <Tarea n={spam7} texto="Mensajes filtrados como spam (7 días)" ayuda="Revise que no haya un cliente real" href="/administrator/contactos" tono="info" />}
        </div>
      </section>

      {/* 2. Cómo vamos */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Últimos 30 días</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi titulo="Consultas" valor={c?.ultimos30 ?? '—'} pie={c && <Delta ahora={c.ultimos30} antes={c.anteriores30} />} />
          <Kpi titulo="Clientes ganados" valor={c?.clientes30 ?? '—'} pie={<span className="text-xs text-tinta-2">marcados «Cliente»</span>} />
          <Kpi titulo="Conversaciones del chat" valor={chat?.hilos30 ?? '—'} pie={chat && <Delta ahora={chat.hilos30} antes={chat.hilosAnteriores30} />} />
          <Kpi titulo="Preguntas al chat" valor={chat?.preguntas30 ?? '—'} />
          <Kpi
            titulo="Nota media del chat"
            valor={chat?.media30 != null ? chat.media30.toFixed(1) : '—'}
            pie={
              chat && (
                <span className="text-xs text-tinta-2">
                  {chat.reparto30.correcta} bien · {chat.reparto30.mejorable} mejorable · {chat.reparto30.incorrecta} mal
                </span>
              )
            }
          />
          <Kpi titulo="Artículos publicados" valor={blog?.publicados30 ?? '—'} pie={blog && <span className="text-xs text-tinta-2">{blog.publicados} en total</span>} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {c && <Barras serie={c.serie} titulo="Consultas por día" total={c.ultimos30} />}
        {chat && <Barras serie={chat.serie} titulo="Conversaciones del chat por día" total={chat.hilos30} />}
      </div>

      {/* 3. Detalle */}
      <div className="grid gap-4 lg:grid-cols-2">
        {c && (
          <section className="rounded-xl border border-linea bg-papel p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-bold">Últimas consultas</h3>
              <Link href="/administrator/contactos" className="text-sm underline">Ver todas</Link>
            </div>
            {c.recientes.length === 0 ? (
              <p className="text-sm text-tinta-2">Todavía no hay consultas.</p>
            ) : (
              <ul className="divide-y divide-niebla">
                {c.recientes.map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                    <Link href={`/administrator/contactos/${x.id}`} className="min-w-0 flex-1">
                      <span className="font-semibold underline">{x.empresa || x.nombre}</span>
                      <span className="block text-xs text-tinta-2">{fecha(x.created_at)} · {x.area ?? 'sin área'}</span>
                    </Link>
                    <span className="flex gap-1.5">
                      <Etiqueta lista={PRIORIDADES} valor={x.prioridad} />
                      <Etiqueta lista={ESTADOS} valor={x.estado} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {chat && (
          <section className="rounded-xl border border-linea bg-papel p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-bold">Últimas preguntas al chat</h3>
              <Link href="/administrator/chatbot" className="text-sm underline">Ver conversaciones</Link>
            </div>
            {chat.ultimasPreguntas.length === 0 ? (
              <p className="text-sm text-tinta-2">Todavía nadie ha usado el chat.</p>
            ) : (
              <ul className="divide-y divide-niebla">
                {chat.ultimasPreguntas.map((p) => (
                  <li key={p.id} className="py-2.5 text-sm">
                    <span className="line-clamp-2">«{p.content}»</span>
                    <span className="block text-xs text-tinta-2">{fecha(p.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {chat && chat.incorrectas.length > 0 && (
        <section className="rounded-xl border-2 border-red-200 bg-papel p-5">
          <h3 className="mb-1 font-bold">Respuestas del chat calificadas como incorrectas</h3>
          <p className="mb-3 text-sm text-tinta-2">Regla del taller: cada incorrecta se arregla (prompt, ficha o conocimiento) antes de que se repita.</p>
          <ul className="space-y-3">
            {chat.incorrectas.map((n) => (
              <li key={n.message_id} className="border-l-2 border-red-300 pl-3 text-sm">
                <p className="line-clamp-2 text-tinta-2">{n.respuesta}</p>
                <p className="mt-1"><strong>Revisor:</strong> {n.notes ?? '—'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {c && (
          <section className="rounded-xl border border-linea bg-papel p-5">
            <h3 className="mb-3 font-bold">Cómo nos conocen (consultas, 30 días)</h3>
            {c.origen.length === 0 ? (
              <p className="text-sm text-tinta-2">Sin datos todavía.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {c.origen.map(([k, n]) => (
                  <li key={k}>
                    <div className="flex justify-between">
                      <span>{k === 'sin_dato' ? 'Sin respuesta' : etiqueta(CONOCIO, k)}</span>
                      <span className="text-tinta-2">{n}</span>
                    </div>
                    <div className="mt-1 h-2 rounded bg-niebla">
                      <div className="h-2 rounded bg-marca" style={{ width: `${(n / Math.max(1, c.ultimos30)) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {blog?.proximo && (
              <p className="mt-4 border-t border-niebla pt-3 text-sm">
                <strong>Próximo artículo programado:</strong> {blog.proximo.title}
                {blog.proximo.published_at ? ` · ${fecha(blog.proximo.published_at)}` : ''}
              </p>
            )}
          </section>
        )}

        <section className="rounded-xl border border-linea bg-papel p-5">
          <h3 className="mb-3 font-bold">Estado del sistema</h3>
          <ul className="space-y-2 text-sm">
            {sistema.map((s) => (
              <li key={s.nombre} className="flex items-start gap-2">
                <span aria-hidden className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${s.ok ? 'bg-green-600' : 'bg-amber-500'}`} />
                <span>
                  <span className="font-semibold">{s.nombre}</span>
                  <span className="block text-xs text-tinta-2">{s.detalle}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
