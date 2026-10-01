import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { CONOCIO, ESTADOS, PRIORIDADES, TIPOS, etiqueta } from '@/lib/crm';
import { MOTIVOS, type Motivo } from '@/lib/spam';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { recuperarSpam } from './acciones';

/**
 * /administrator/contactos — mini-CRM (partida 06). Molde Tricholand (contacts + estados + prioridad).
 * Embudo, seguimientos pendientes, filtros, tabla, exportación y conversión por origen.
 */
export const dynamic = 'force-dynamic';

type SP = Promise<{ estado?: string; prioridad?: string; area?: string; sede?: string; q?: string; ok?: string; error?: string }>;

type Fila = {
  id: string;
  created_at: string;
  tipo: string;
  nombre: string;
  empresa: string | null;
  email: string;
  area: string | null;
  sede: string | null;
  estado: string;
  prioridad: string;
  responsable: string | null;
  seguimiento_el: string | null;
  como_conocio: string | null;
  origen: string | null;
};

const fechaCorta = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
const hoy = () => new Date().toISOString().slice(0, 10);

function Etiqueta({ lista, valor }: { lista: readonly { valor: string; texto: string; clase: string }[]; valor: string }) {
  const e = lista.find((x) => x.valor === valor);
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${e?.clase ?? 'bg-gray-100'}`}>{e?.texto ?? valor}</span>;
}

export default async function ContactosAdmin({ searchParams }: { searchParams: SP }) {
  const { ok: aviso, error: fallo, ...sp } = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  // Bandeja de spam (30 días). Si la tabla aún no existe (falta 0007), simplemente no se muestra.
  const { data: spam } = await db
    .from('contact_spam')
    .select('id, created_at, motivo, nombre, email, extracto')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data, error } = await db
    .from('contact_submissions')
    .select('id, created_at, tipo, nombre, empresa, email, area, sede, estado, prioridad, responsable, seguimiento_el, como_conocio, origen')
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">No se pueden leer los contactos.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <p className="mt-3 text-sm">Si falta una columna: ejecutar <code>supabase/migrations/0006_crm_contactos.sql</code> en el SQL Editor.</p>
      </div>
    );
  }

  const todos = (data ?? []) as Fila[];
  const q = (sp.q ?? '').toLowerCase();
  const filtrados = todos.filter(
    (c) =>
      (!sp.estado || c.estado === sp.estado) &&
      (!sp.prioridad || c.prioridad === sp.prioridad) &&
      (!sp.area || c.area === sp.area) &&
      (!sp.sede || c.sede === sp.sede) &&
      (!q || [c.nombre, c.empresa, c.email].some((v) => (v ?? '').toLowerCase().includes(q))),
  );

  const recuento = (estado: string) => todos.filter((c) => c.estado === estado).length;
  const pendientes = todos
    .filter((c) => c.seguimiento_el && c.seguimiento_el <= hoy() && c.estado !== 'cliente' && c.estado !== 'descartado')
    .sort((a, b) => (a.seguimiento_el ?? '').localeCompare(b.seguimiento_el ?? ''));
  const altasSinAtender = todos.filter((c) => c.prioridad === 'alta' && c.estado === 'nuevo').length;

  // Conversión por «cómo nos conoció» (cuántas consultas acaban en cliente).
  const porOrigen = CONOCIO.map((o) => {
    const grupo = todos.filter((c) => c.como_conocio === o.valor);
    const clientes = grupo.filter((c) => c.estado === 'cliente').length;
    return { texto: o.es, total: grupo.length, clientes };
  }).filter((g) => g.total > 0);
  const sinDato = todos.filter((c) => !c.como_conocio);

  const areas = [...new Set(todos.map((c) => c.area).filter(Boolean))] as string[];
  const sedes = [...new Set(todos.map((c) => c.sede).filter(Boolean))] as string[];
  const exportar = `/administrator/contactos/exportar?${new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString()}`;

  const filtro = (k: string, v: string) => {
    const p = new URLSearchParams(Object.entries(sp).filter(([, x]) => x) as [string, string][]);
    if (p.get(k) === v) p.delete(k);
    else p.set(k, v);
    return `/administrator/contactos?${p.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-sm text-tinta-2">
            {todos.length} consultas · {altasSinAtender > 0 ? <strong className="text-red-700">{altasSinAtender} de prioridad alta sin atender</strong> : 'ninguna alta sin atender'}
          </p>
        </div>
        <a href={exportar} className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta">
          Exportar a Excel (CSV)
        </a>
      </div>

      {fallo && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{fallo}</p>}
      {aviso && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{aviso}</p>}

      {/* Embudo */}
      <div className="grid gap-3 sm:grid-cols-5">
        {ESTADOS.map((e) => (
          <Link
            key={e.valor}
            href={filtro('estado', e.valor)}
            className={`rounded-xl border bg-papel p-4 hover:border-tinta ${sp.estado === e.valor ? 'border-tinta' : 'border-linea'}`}
          >
            <p className="text-2xl font-bold">{recuento(e.valor)}</p>
            <p className="text-sm text-tinta-2">{e.texto}</p>
          </Link>
        ))}
      </div>

      {pendientes.length > 0 && (
        <div className="rounded-xl border-2 border-marca bg-marca-suave p-5">
          <h2 className="mb-2 font-bold">Seguimientos para hoy o vencidos ({pendientes.length})</h2>
          <ul className="space-y-1 text-sm">
            {pendientes.slice(0, 10).map((c) => (
              <li key={c.id}>
                <Link href={`/administrator/contactos/${c.id}`} className="underline">{c.empresa || c.nombre}</Link>
                {' · '}
                {c.seguimiento_el && fechaCorta(c.seguimiento_el)} · {c.responsable ?? 'sin responsable'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-tinta-2">Prioridad:</span>
        {PRIORIDADES.map((p) => (
          <Link key={p.valor} href={filtro('prioridad', p.valor)} className={`rounded-full border px-3 py-1 ${sp.prioridad === p.valor ? 'border-tinta bg-tinta text-white' : 'border-linea bg-papel'}`}>
            {p.texto}
          </Link>
        ))}
        {areas.length > 0 && <span className="ml-3 text-tinta-2">Área:</span>}
        {areas.map((a) => (
          <Link key={a} href={filtro('area', a)} className={`rounded-full border px-3 py-1 ${sp.area === a ? 'border-tinta bg-tinta text-white' : 'border-linea bg-papel'}`}>
            {a}
          </Link>
        ))}
        {sedes.length > 0 && <span className="ml-3 text-tinta-2">Despacho:</span>}
        {sedes.map((s) => (
          <Link key={s} href={filtro('sede', s)} className={`rounded-full border px-3 py-1 ${sp.sede === s ? 'border-tinta bg-tinta text-white' : 'border-linea bg-papel'}`}>
            {s}
          </Link>
        ))}
        <form className="ml-auto flex gap-2" action="/administrator/contactos">
          {Object.entries(sp).filter(([k, v]) => k !== 'q' && v).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <input name="q" defaultValue={sp.q ?? ''} placeholder="Buscar nombre, empresa o correo" className="rounded-lg border border-linea px-3 py-1.5" />
        </form>
        {Object.values(sp).some(Boolean) && <Link href="/administrator/contactos" className="underline">Quitar filtros</Link>}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-linea bg-papel">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-linea bg-niebla text-xs text-tinta-2">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Área · despacho</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Responsable</th>
              <th className="px-4 py-3">Seguimiento</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => {
              const vencido = c.seguimiento_el && c.seguimiento_el <= hoy() && c.estado !== 'cliente' && c.estado !== 'descartado';
              return (
                <tr key={c.id} className="border-b border-niebla last:border-0 hover:bg-niebla">
                  <td className="whitespace-nowrap px-4 py-3">{fechaCorta(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/administrator/contactos/${c.id}`} className="font-semibold underline">{c.empresa || c.nombre}</Link>
                    <p className="text-xs text-tinta-2">{c.empresa ? `${c.nombre} · ` : ''}{c.email}</p>
                  </td>
                  <td className="px-4 py-3">{etiqueta(TIPOS, c.tipo)}</td>
                  <td className="px-4 py-3">{c.area ?? '—'} · {c.sede ?? '—'}</td>
                  <td className="px-4 py-3"><Etiqueta lista={PRIORIDADES} valor={c.prioridad} /></td>
                  <td className="px-4 py-3"><Etiqueta lista={ESTADOS} valor={c.estado} /></td>
                  <td className="px-4 py-3">{c.responsable ?? <span className="text-tinta-2">—</span>}</td>
                  <td className={`whitespace-nowrap px-4 py-3 ${vencido ? 'font-semibold text-red-700' : ''}`}>
                    {c.seguimiento_el ? fechaCorta(c.seguimiento_el) : '—'}
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-tinta-2">No hay consultas con estos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Conversión */}
      <div className="rounded-xl border border-linea bg-papel p-5">
        <h2 className="mb-1 font-bold">¿De dónde salen los clientes?</h2>
        <p className="mb-4 text-sm text-tinta-2">Consultas y clientes según cómo nos conocieron. Marque «Cliente» en cada consulta que se convierta para que este cuadro sea fiable.</p>
        {porOrigen.length === 0 ? (
          <p className="text-sm text-tinta-2">Todavía no hay datos.</p>
        ) : (
          <table className="w-full max-w-lg text-sm">
            <thead className="text-xs text-tinta-2">
              <tr><th className="py-1 text-left">Origen</th><th className="py-1 text-right">Consultas</th><th className="py-1 text-right">Clientes</th><th className="py-1 text-right">Conversión</th></tr>
            </thead>
            <tbody>
              {porOrigen.map((g) => (
                <tr key={g.texto} className="border-t border-niebla">
                  <td className="py-1.5">{g.texto}</td>
                  <td className="py-1.5 text-right">{g.total}</td>
                  <td className="py-1.5 text-right">{g.clientes}</td>
                  <td className="py-1.5 text-right">{Math.round((g.clientes / g.total) * 100)} %</td>
                </tr>
              ))}
              {sinDato.length > 0 && (
                <tr className="border-t border-niebla text-tinta-2">
                  <td className="py-1.5">Sin respuesta</td>
                  <td className="py-1.5 text-right">{sinDato.length}</td>
                  <td className="py-1.5 text-right">{sinDato.filter((c) => c.estado === 'cliente').length}</td>
                  <td className="py-1.5 text-right">—</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Bandeja de spam */}
      <details className="rounded-xl border border-linea bg-papel p-5">
        <summary className="cursor-pointer font-bold">
          Filtrado como spam ({(spam ?? []).length}) <span className="font-normal text-tinta-2">· últimos 30 días</span>
        </summary>
        <p className="mt-2 text-sm text-tinta-2">
          El filtro descarta en silencio la venta comercial, las ofertas de SEO, los textos aleatorios y los duplicados. Si ve aquí a un cliente
          real, recúperelo: pasará a contactos (no recibió confirmación, así que conviene contestarle). Los bots evidentes no se guardan.
        </p>
        {(spam ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-tinta-2">Nada filtrado.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(spam ?? []).map((s) => (
              <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 border-t border-niebla pt-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p>
                    <strong>{s.nombre || '—'}</strong> · {s.email || '—'} · <span className="text-tinta-2">{fechaCorta(s.created_at)}</span>
                  </p>
                  <p className="text-xs text-red-700">{MOTIVOS[s.motivo as Motivo] ?? s.motivo}</p>
                  <p className="mt-1 text-tinta-2">{s.extracto}</p>
                </div>
                <form action={recuperarSpam}>
                  <input type="hidden" name="id" value={s.id} />
                  <BotonEnviar
                    texto="No era spam: recuperar"
                    trabajando="Recuperando…"
                    className="whitespace-nowrap rounded-lg border border-linea bg-papel px-3 py-1.5 text-xs font-semibold hover:border-tinta disabled:opacity-60"
                  />
                </form>
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
