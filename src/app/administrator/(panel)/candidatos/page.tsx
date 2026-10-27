import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ESTADOS_CANDIDATO, TIPOS_CANDIDATURA } from '@/lib/candidatos';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { cambiarEstadoCandidato } from './acciones';

/**
 * /administrator/candidatos — empleo y prácticas, aparte de las consultas de clientes.
 * Molde de Neotérmica (/administrator/candidatos), con la lista en el servidor como el resto de este panel.
 */
export const dynamic = 'force-dynamic';

type Fila = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: string;
  area: string | null;
  mensaje: string;
  origen: string | null;
  estado: string;
};

const fecha = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default async function CandidatosAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; estado?: string }> }) {
  const sp = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  const { data, error } = await db
    .from('candidaturas')
    .select('id, created_at, nombre, email, telefono, tipo, area, mensaje, origen, estado')
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
  const lista = sp.estado ? todos.filter((c) => c.estado === sp.estado) : todos;
  const recuento = (estado: string) => todos.filter((c) => c.estado === estado).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Candidatos</h1>
        <p className="text-sm text-tinta-2">
          Empleo y prácticas. No son consultas de clientes. {todos.length} en total
          {recuento('nuevo') > 0 ? <> · <strong>{recuento('nuevo')} sin mirar</strong></> : null}.
        </p>
      </div>

      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}
      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}

      <div className="flex flex-wrap gap-2">
        <Link href="/administrator/candidatos" className={`rounded-full px-3 py-1 text-sm font-semibold ${!sp.estado ? 'bg-tinta text-white' : 'bg-papel text-tinta-2'}`}>
          Todas ({todos.length})
        </Link>
        {ESTADOS_CANDIDATO.map((e) => (
          <Link
            key={e.valor}
            href={`/administrator/candidatos?estado=${e.valor}`}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${sp.estado === e.valor ? 'bg-tinta text-white' : 'bg-papel text-tinta-2'}`}
          >
            {e.texto} ({recuento(e.valor)})
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="rounded-xl border border-linea bg-papel p-6 text-sm text-tinta-2">No hay candidaturas en esta vista.</p>
      ) : (
        <ul className="space-y-4">
          {lista.map((c) => {
            const tipo = TIPOS_CANDIDATURA.find((t) => t.valor === c.tipo)?.es ?? c.tipo;
            const pill = ESTADOS_CANDIDATO.find((e) => e.valor === c.estado);
            return (
              <li key={c.id} className="rounded-xl border border-linea bg-papel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {c.nombre}{' '}
                      <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill?.clase ?? 'bg-gray-100'}`}>{pill?.texto ?? c.estado}</span>
                    </p>
                    <p className="mt-1 text-sm text-tinta-2">
                      {fecha(c.created_at)} · {tipo}
                      {c.area ? ` · ${c.area}` : ''} · {c.origen === 'contacto' ? 'llegó por el formulario de clientes' : 'formulario de empleo'}
                    </p>
                    <p className="mt-1 text-sm">
                      <a className="underline" href={`mailto:${c.email}`}>{c.email}</a>
                      {c.telefono ? <> · <a className="underline" href={`tel:${c.telefono}`}>{c.telefono}</a></> : null}
                    </p>
                  </div>
                  <form action={cambiarEstadoCandidato} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <select name="estado" defaultValue={c.estado} className="rounded-lg border border-linea bg-papel px-2 py-2 text-sm">
                      {ESTADOS_CANDIDATO.map((e) => (
                        <option key={e.valor} value={e.valor}>{e.texto}</option>
                      ))}
                    </select>
                    <BotonEnviar texto="Guardar" trabajando="Guardando…" className="rounded-lg border border-linea bg-papel px-3 py-2 text-sm font-semibold hover:border-tinta" />
                  </form>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm">{c.mensaje}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
