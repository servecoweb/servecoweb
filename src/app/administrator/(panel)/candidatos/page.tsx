import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ESTADOS_CANDIDATO, TIPOS_CANDIDATURA } from '@/lib/candidatos';
import { ES } from '@/lib/rutas';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { cambiarEstadoCandidato, eliminarCandidato } from './acciones';

/**
 * /administrator/candidatos — empleo y prácticas, aparte de las consultas de clientes.
 * Molde de Neotérmica (/administrator/candidatos), con la lista en el servidor como el resto de este panel.
 */
export const dynamic = 'force-dynamic';

type SP = Promise<{ ok?: string; error?: string; estado?: string; tipo?: string; area?: string; q?: string }>;

type Fila = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: string;
  area: string | null;
  mensaje: string;
  idioma: string | null;
  origen: string | null;
  estado: string;
};

const LARGO = 280;

const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });

function hace(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return min <= 1 ? 'ahora mismo' : `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return 'ayer';
  if (d < 30) return `hace ${d} días`;
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** «pascual sanchez monreal» → «Pascual Sanchez Monreal». Si ya trae mayúsculas, se respeta. */
function nombreVisible(nombre: string) {
  const n = nombre.trim().replace(/\s+/g, ' ');
  if (n !== n.toLowerCase()) return n;
  return n
    .split(' ')
    .map((p, i) => (i > 0 && ['de', 'del', 'la', 'las', 'los', 'y'].includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
}

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .filter((p) => p.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(p))
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('') || nombre.charAt(0).toUpperCase();

const chip = (activo: boolean) =>
  `rounded-full border px-3 py-1 ${activo ? 'border-tinta bg-tinta text-white' : 'border-linea bg-papel hover:border-tinta'}`;

export default async function CandidatosAdmin({ searchParams }: { searchParams: SP }) {
  const { ok: aviso, error: fallo, ...sp } = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  const { data, error } = await db
    .from('candidaturas')
    .select('id, created_at, nombre, email, telefono, tipo, area, mensaje, idioma, origen, estado')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">No se pueden leer las candidaturas.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <p className="mt-3 text-sm">Si falta la tabla: aplicar <code>supabase/migrations/0009_candidaturas.sql</code>.</p>
      </div>
    );
  }

  const todos = (data ?? []) as Fila[];
  const q = (sp.q ?? '').toLowerCase().trim();
  const lista = todos.filter(
    (c) =>
      (!sp.estado || c.estado === sp.estado) &&
      (!sp.tipo || c.tipo === sp.tipo) &&
      (!sp.area || c.area === sp.area) &&
      (!q || [c.nombre, c.email, c.telefono, c.mensaje].some((v) => (v ?? '').toLowerCase().includes(q))),
  );
  const recuento = (estado: string) => todos.filter((c) => c.estado === estado).length;
  const sinMirar = recuento('nuevo');
  const areas = [...new Set(todos.map((c) => c.area).filter(Boolean))] as string[];

  const params = () => new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  const filtro = (k: string, v: string) => {
    const p = params();
    if (p.get(k) === v) p.delete(k);
    else p.set(k, v);
    const s = p.toString();
    return `/administrator/candidatos${s ? `?${s}` : ''}`;
  };
  const volver = params().toString();
  const hayFiltros = Object.values(sp).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Candidatos</h1>
          <p className="text-sm text-tinta-2">
            Empleo y prácticas, aparte de las consultas de clientes · {todos.length} en total ·{' '}
            {sinMirar > 0 ? <strong className="text-tinta">{sinMirar} sin mirar</strong> : 'todas miradas'}
          </p>
        </div>
        <a
          href={ES.trabaja}
          target="_blank"
          rel="noopener"
          className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta"
        >
          Ver la página de empleo ↗
        </a>
      </div>

      {fallo && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{fallo}</p>}
      {aviso && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{aviso}</p>}

      {/* Embudo: cada caja filtra por su estado. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ESTADOS_CANDIDATO.map((e) => (
          <Link
            key={e.valor}
            href={filtro('estado', e.valor)}
            aria-current={sp.estado === e.valor ? 'true' : undefined}
            className={`rounded-xl border bg-papel p-4 transition-colors hover:border-tinta ${sp.estado === e.valor ? 'border-tinta ring-1 ring-tinta' : 'border-linea'}`}
          >
            <p className="flex items-center gap-2 text-sm text-tinta-2">
              <span className={`h-2 w-2 rounded-full ${e.punto}`} aria-hidden />
              {e.texto}
            </p>
            <p className="mt-1 text-3xl font-bold">{recuento(e.valor)}</p>
          </Link>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-tinta-2">Busca:</span>
        {TIPOS_CANDIDATURA.map((t) => (
          <Link key={t.valor} href={filtro('tipo', t.valor)} className={chip(sp.tipo === t.valor)}>
            {t.es}
          </Link>
        ))}
        {areas.length > 0 && <span className="ml-3 text-tinta-2">Área:</span>}
        {areas.map((a) => (
          <Link key={a} href={filtro('area', a)} className={chip(sp.area === a)}>
            {a}
          </Link>
        ))}
        <form className="flex w-full gap-2 sm:ml-auto sm:w-auto" action="/administrator/candidatos">
          {Object.entries(sp).filter(([k, v]) => k !== 'q' && v).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <input
            name="q"
            type="search"
            defaultValue={sp.q ?? ''}
            placeholder="Buscar nombre, correo o texto"
            className="w-full rounded-lg border sm:w-64 border-linea bg-papel px-3 py-1.5 outline-none focus:border-marca"
          />
        </form>
        {hayFiltros && <Link href="/administrator/candidatos" className="underline">Quitar filtros</Link>}
      </div>

      {lista.length === 0 ? (
        <div className="rounded-xl border border-dashed border-linea bg-papel px-6 py-12 text-center">
          <p className="font-semibold">{hayFiltros ? 'Nadie con estos filtros.' : 'Todavía no ha llegado ninguna candidatura.'}</p>
          <p className="mt-1 text-sm text-tinta-2">
            {hayFiltros ? (
              <Link href="/administrator/candidatos" className="underline">Ver todas</Link>
            ) : (
              <>Llegan desde la página «Trabaja con nosotros» y, si alguien pide empleo en el formulario de clientes, también acaban aquí.</>
            )}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {lista.map((c) => {
            const nombre = nombreVisible(c.nombre);
            const tipo = TIPOS_CANDIDATURA.find((t) => t.valor === c.tipo)?.es ?? c.tipo;
            const estado = ESTADOS_CANDIDATO.find((e) => e.valor === c.estado);
            const mensaje = c.mensaje.trim();
            const largo = mensaje.length > LARGO;
            const resumen = largo ? `${mensaje.replace(/\s*\n\s*/g, ' ').slice(0, LARGO).replace(/\s+\S*$/, '')}…` : mensaje;
            const asunto = encodeURIComponent(c.tipo === 'practicas' ? 'Tus prácticas en Serveco Asesores' : 'Tu candidatura en Serveco Asesores');
            const descartado = c.estado === 'descartado';
            return (
              <li
                key={c.id}
                className={`overflow-hidden rounded-xl border bg-papel ${c.estado === 'nuevo' ? 'border-linea border-l-4 border-l-marca' : 'border-linea'} ${descartado ? 'opacity-70' : ''}`}
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <span
                    className={`hidden h-11 w-11 shrink-0 place-items-center sm:grid rounded-full text-sm font-bold ${descartado ? 'bg-niebla text-tinta-2' : 'bg-marca-suave text-marca-texto'}`}
                    aria-hidden
                  >
                    {iniciales(nombre)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold leading-tight">{nombre}</h2>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${estado?.clase ?? 'bg-gray-100'}`}>{estado?.texto ?? c.estado}</span>
                      </div>
                      <time dateTime={c.created_at} title={fechaHora(c.created_at)} className="whitespace-nowrap text-sm text-tinta-2">
                        {hace(c.created_at)}
                      </time>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-md bg-tinta px-2 py-0.5 font-semibold text-white">{tipo}</span>
                      {c.area && <span className="rounded-md border border-linea px-2 py-0.5 font-semibold">{c.area}</span>}
                      {c.idioma === 'en' && <span className="rounded-md border border-linea px-2 py-0.5 font-semibold">Inglés</span>}
                      <span className="text-tinta-2">
                        · {c.origen === 'contacto' ? 'escribió en el formulario de clientes' : 'formulario de empleo'}
                      </span>
                    </div>

                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a className="text-tinta-2 hover:text-tinta hover:underline" href={`mailto:${c.email}`}>{c.email}</a>
                      {c.telefono && (
                        <a className="text-tinta-2 hover:text-tinta hover:underline" href={`tel:${c.telefono.replace(/\s/g, '')}`}>{c.telefono}</a>
                      )}
                    </p>

                    {largo ? (
                      <details className="group mt-3 rounded-lg bg-niebla px-4 py-3 text-[15px] leading-relaxed">
                        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <span className="group-open:hidden">{resumen}</span>
                          <span className="mt-1 block text-sm font-semibold text-marca-texto underline-offset-2 hover:underline group-open:mt-0 group-open:mb-2">
                            <span className="group-open:hidden">Leer el mensaje entero ▾</span>
                            <span className="hidden group-open:inline">Recoger ▴</span>
                          </span>
                        </summary>
                        <p className="whitespace-pre-line">{mensaje}</p>
                      </details>
                    ) : (
                      <p className="mt-3 whitespace-pre-line rounded-lg bg-niebla px-4 py-3 text-[15px] leading-relaxed">{mensaje}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-niebla bg-papel px-4 py-3 sm:px-5">
                  <form action={cambiarEstadoCandidato} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="volver" value={volver} />
                    <span className="text-xs text-tinta-2">Estado:</span>
                    <div className="grid w-full grid-cols-2 rounded-lg border border-linea p-0.5 sm:inline-flex sm:w-auto" role="group" aria-label={`Estado de ${nombre}`}>
                      {ESTADOS_CANDIDATO.map((e) => {
                        const actual = e.valor === c.estado;
                        return (
                          <button
                            key={e.valor}
                            type="submit"
                            name="estado"
                            value={e.valor}
                            disabled={actual}
                            aria-pressed={actual}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                              actual ? `${e.clase} cursor-default` : 'text-tinta-2 hover:bg-niebla hover:text-tinta'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${e.punto}`} aria-hidden />
                            {e.texto}
                          </button>
                        );
                      })}
                    </div>
                  </form>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={eliminarCandidato}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="volver" value={volver} />
                      <BotonEnviar
                        texto="Eliminar"
                        trabajando="Eliminando…"
                        confirmar={`Se borra la candidatura de ${nombre}. No se puede recuperar.`}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      />
                    </form>
                    {c.telefono && (
                      <a
                        href={`tel:${c.telefono.replace(/\s/g, '')}`}
                        className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta"
                      >
                        Llamar
                      </a>
                    )}
                    <a href={`mailto:${c.email}?subject=${asunto}`} className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta hover:bg-marca-hover">
                      Responder por correo
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
