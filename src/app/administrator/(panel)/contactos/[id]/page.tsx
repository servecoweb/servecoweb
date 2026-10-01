import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ASESORIA, CONOCIO, ESTADOS, PRIORIDADES, SECTORES, TAMANOS, TIPOS, URGENCIAS, etiqueta } from '@/lib/crm';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { actualizarContacto, anadirNota } from '../acciones';

/** Ficha de una consulta del mini-CRM: datos, cualificación, origen, gestión e historial. */
export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;
type SP = Promise<{ error?: string; ok?: string }>;

const campo = 'w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca';
const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function Dato({ etq, valor }: { etq: string; valor: React.ReactNode }) {
  if (valor === null || valor === undefined || valor === '' || valor === '—') return null;
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-niebla py-2 text-sm last:border-0">
      <dt className="text-tinta-2">{etq}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

export default async function FichaContacto({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { id } = await params;
  const sp = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  const [{ data: c }, { data: notas }] = await Promise.all([
    db.from('contact_submissions').select('*').eq('id', id).maybeSingle(),
    db.from('contact_notas').select('id, created_at, autor, tipo, texto').eq('contact_id', id).order('created_at', { ascending: false }),
  ]);
  if (!c) notFound();

  const telefono = c.telefono ? String(c.telefono) : null;

  return (
    <div className="space-y-6">
      <Link href="/administrator/contactos" className="text-sm underline">← Volver a contactos</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{c.empresa || c.nombre}</h1>
          <p className="text-sm text-tinta-2">
            {fechaHora(c.created_at)} · {etiqueta(TIPOS, c.tipo)} · {c.area ?? 'sin área'} · {c.sede ?? 'sin despacho'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${c.email}?subject=${encodeURIComponent('Su consulta a Serveco Asesores')}`} className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta">
            Responder por correo
          </a>
          {telefono && (
            <a href={`tel:${telefono.replace(/\s/g, '')}`} className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold">
              Llamar {telefono}
            </a>
          )}
        </div>
      </div>

      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-2 font-bold">Mensaje</h2>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{c.mensaje}</p>
          </div>

          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-2 font-bold">Datos y cualificación</h2>
            <dl>
              <Dato etq="Nombre" valor={c.nombre} />
              <Dato etq="Empresa" valor={c.empresa} />
              <Dato etq="Correo" valor={<a className="underline" href={`mailto:${c.email}`}>{c.email}</a>} />
              <Dato etq="Teléfono" valor={telefono} />
              <Dato etq="Tipo" valor={etiqueta(TIPOS, c.tipo)} />
              <Dato etq="Tamaño" valor={etiqueta(TAMANOS, c.tamano)} />
              <Dato etq="Sector" valor={etiqueta(SECTORES, c.sector)} />
              <Dato etq="¿Tiene asesoría?" valor={etiqueta(ASESORIA, c.tiene_asesoria)} />
              <Dato etq="Urgencia" valor={etiqueta(URGENCIAS, c.urgencia)} />
              <Dato etq="Idioma" valor={c.idioma === 'en' ? 'Inglés' : 'Español'} />
            </dl>
          </div>

          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-2 font-bold">Origen</h2>
            <dl>
              <Dato etq="Nos conoció por" valor={etiqueta(CONOCIO, c.como_conocio)} />
              <Dato etq="Escribió desde" valor={c.origen} />
              <Dato etq="Página de entrada" valor={c.pagina_entrada} />
              <Dato etq="Venía de" valor={c.referrer} />
              <Dato etq="Campaña" valor={[c.utm_source, c.utm_medium, c.utm_campaign].filter(Boolean).join(' · ') || null} />
            </dl>
            {!c.pagina_entrada && !c.referrer && (
              <p className="mt-2 text-xs text-tinta-2">Sin página de entrada: el visitante no aceptó las cookies analíticas (es lo correcto; no se guarda sin permiso).</p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <form action={actualizarContacto} className="space-y-4 rounded-xl border-2 border-marca bg-papel p-5">
            <h2 className="font-bold">Gestión</h2>
            <input type="hidden" name="id" value={c.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="estado" className="mb-1 block text-sm font-semibold">Estado</label>
                <select id="estado" name="estado" defaultValue={c.estado} className={campo}>
                  {ESTADOS.map((e) => <option key={e.valor} value={e.valor}>{e.texto}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="prioridad" className="mb-1 block text-sm font-semibold">Prioridad</label>
                <select id="prioridad" name="prioridad" defaultValue={c.prioridad} className={campo}>
                  {PRIORIDADES.map((p) => <option key={p.valor} value={p.valor}>{p.texto}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="responsable" className="mb-1 block text-sm font-semibold">Responsable</label>
              <input id="responsable" name="responsable" defaultValue={c.responsable ?? ''} placeholder="Nombre o área / despacho" className={campo} />
            </div>
            <div>
              <label htmlFor="seguimiento_el" className="mb-1 block text-sm font-semibold">Volver a contactar el</label>
              <input id="seguimiento_el" name="seguimiento_el" type="date" defaultValue={c.seguimiento_el ?? ''} className={campo} />
            </div>
            <p className="text-xs text-tinta-2">En este estado desde {fechaHora(c.estado_desde ?? c.created_at)}.</p>
            <BotonEnviar texto="Guardar" trabajando="Guardando…" />
          </form>

          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-3 font-bold">Notas e historial</h2>
            <form action={anadirNota} className="mb-4 space-y-2">
              <input type="hidden" name="id" value={c.id} />
              <textarea name="nota" rows={3} placeholder="Qué se habló, qué se acordó…" className={campo} />
              <BotonEnviar
                texto="Añadir nota"
                trabajando="Guardando…"
                className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold disabled:opacity-60"
              />
            </form>
            <ol className="space-y-3">
              {(notas ?? []).map((n) => (
                <li key={n.id} className={`border-l-2 pl-3 text-sm ${n.tipo === 'nota' ? 'border-marca' : 'border-linea text-tinta-2'}`}>
                  <p className="text-xs text-tinta-2">{fechaHora(n.created_at)} · {n.autor}</p>
                  <p className="whitespace-pre-wrap">{n.texto}</p>
                </li>
              ))}
              {(notas ?? []).length === 0 && <li className="text-sm text-tinta-2">Sin notas.</li>}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
