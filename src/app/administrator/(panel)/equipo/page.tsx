import Link from 'next/link';
import { DEPARTAMENTOS, leerMiembros, type Miembro } from '@/lib/equipo';
import { SEDES } from '@/data/offices';
import { ES } from '@/lib/rutas';

/** /administrator/equipo — las personas que salen en la web. */
export const dynamic = 'force-dynamic';

type SP = Promise<{ ok?: string; error?: string; q?: string; depto?: string; sede?: string; ver?: string }>;

const VISTAS = [
  { valor: 'visibles', texto: 'Visibles', cumple: (p: Miembro) => p.publicado },
  { valor: 'ocultas', texto: 'Ocultas', cumple: (p: Miembro) => !p.publicado },
  { valor: 'portada', texto: 'En portada', cumple: (p: Miembro) => p.destacado },
  { valor: 'sin-foto', texto: 'Sin foto', cumple: (p: Miembro) => !p.foto },
  { valor: 'sin-ingles', texto: 'Sin cargo en inglés', cumple: (p: Miembro) => !p.cargoEn },
] as const;

/** Sin tildes ni mayúsculas: «jose» encuentra a «José». */
const plano = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

const chip = (activo: boolean) =>
  `whitespace-nowrap rounded-full border px-3 py-1 ${activo ? 'border-tinta bg-tinta text-white' : 'border-linea bg-papel hover:border-tinta'}`;

export default async function EquipoAdmin({ searchParams }: { searchParams: SP }) {
  const { ok: aviso, error: fallo, ...sp } = await searchParams;
  const gente = await leerMiembros();
  const ciudad = (slug: string) => SEDES.find((s) => s.slug === slug)?.ciudad ?? slug;

  const q = plano(sp.q ?? '').trim();
  const vista = VISTAS.find((v) => v.valor === sp.ver);
  const lista = gente.filter(
    (p) =>
      (!sp.depto || p.departamento === sp.depto) &&
      (!sp.sede || (sp.sede === 'ninguno' ? !p.sedeSlug : p.sedeSlug === sp.sede)) &&
      (!vista || vista.cumple(p)) &&
      (!q || plano(`${p.nombre} ${p.cargo} ${p.cargoEn}`).includes(q)),
  );

  const sedesUsadas = SEDES.filter((s) => gente.some((p) => p.sedeSlug === s.slug));
  const sinSede = gente.filter((p) => !p.sedeSlug).length;
  const vistas = VISTAS.map((v) => ({ ...v, total: gente.filter(v.cumple).length })).filter(
    (v) => v.total > 0 || v.valor === 'visibles' || v.valor === 'portada',
  );

  const filtro = (k: string, v: string) => {
    const p = new URLSearchParams(Object.entries(sp).filter(([, x]) => x) as [string, string][]);
    if (p.get(k) === v) p.delete(k);
    else p.set(k, v);
    const s = p.toString();
    return `/administrator/equipo${s ? `?${s}` : ''}`;
  };
  const hayFiltros = Object.values(sp).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Equipo</h1>
          <p className="text-sm text-tinta-2">
            {gente.length} personas · {gente.filter((p) => p.publicado).length} visibles en la web · {gente.filter((p) => p.destacado).length} en portada. Lo
            que se guarda aquí es lo que ve la web, en español y en inglés.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={ES.equipo} target="_blank" rel="noopener" className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold hover:border-tinta">
            Ver en la web ↗
          </a>
          <Link href="/administrator/equipo/nuevo" className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta hover:bg-marca-hover">
            Añadir persona
          </Link>
        </div>
      </div>

      {fallo && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{fallo}</p>}
      {aviso && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{aviso}</p>}

      {gente.length === 0 ? (
        <p className="text-sm text-tinta-2">Todavía no hay nadie en la base. La web sigue enseñando el equipo de reserva.</p>
      ) : (
        <>
          {/* Buscador y filtros */}
          <div className="space-y-3 rounded-xl border border-linea bg-papel p-4">
            <form action="/administrator/equipo" className="flex gap-2">
              {Object.entries(sp).filter(([k, v]) => k !== 'q' && v).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <input
                name="q"
                type="search"
                defaultValue={sp.q ?? ''}
                placeholder="Nombre o cargo: abogado, auditor…"
                className="min-w-0 flex-1 rounded-lg border border-linea px-3 py-2 text-base outline-none focus:border-marca"
              />
              <button type="submit" className="rounded-lg bg-tinta px-4 py-2 text-sm font-semibold text-white">Buscar</button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="w-24 shrink-0 text-tinta-2">Departamento</span>
              {DEPARTAMENTOS.map((d) => {
                const n = gente.filter((p) => p.departamento === d.id).length;
                if (n === 0) return null;
                return (
                  <Link key={d.id} href={filtro('depto', d.id)} className={chip(sp.depto === d.id)}>
                    {d.es.replace('Departamento ', '').replace(/^./, (c) => c.toUpperCase())} <span className="opacity-60">{n}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="w-24 shrink-0 text-tinta-2">Despacho</span>
              {sedesUsadas.map((s) => (
                <Link key={s.slug} href={filtro('sede', s.slug)} className={chip(sp.sede === s.slug)}>
                  {s.ciudad} <span className="opacity-60">{gente.filter((p) => p.sedeSlug === s.slug).length}</span>
                </Link>
              ))}
              {sinSede > 0 && (
                <Link href={filtro('sede', 'ninguno')} className={chip(sp.sede === 'ninguno')}>
                  Sin despacho <span className="opacity-60">{sinSede}</span>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="w-24 shrink-0 text-tinta-2">Mostrar</span>
              {vistas.map((v) => (
                <Link key={v.valor} href={filtro('ver', v.valor)} className={chip(sp.ver === v.valor)}>
                  {v.texto} <span className="opacity-60">{v.total}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-tinta-2">
            <p>
              {hayFiltros ? `${lista.length} de ${gente.length} personas` : 'Pulsa una ficha para editarla.'}
            </p>
            {hayFiltros && <Link href="/administrator/equipo" className="font-semibold text-tinta underline">Quitar filtros</Link>}
          </div>

          {lista.length === 0 && (
            <div className="rounded-xl border border-dashed border-linea bg-papel px-6 py-12 text-center">
              <p className="font-semibold">Nadie con estos filtros.</p>
              <p className="mt-1 text-sm text-tinta-2">
                <Link href="/administrator/equipo" className="underline">Ver a todo el equipo</Link>
              </p>
            </div>
          )}

          {DEPARTAMENTOS.map((d) => {
            const bloque = lista.filter((p) => p.departamento === d.id);
            if (bloque.length === 0) return null;
            return (
              <section key={d.id}>
                <h2 className="mb-3 flex items-baseline gap-2 text-lg font-bold">
                  {d.es} <span className="text-sm font-normal text-tinta-2">{bloque.length}</span>
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {bloque.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/administrator/equipo/${p.id}`}
                        className={`flex h-full items-center gap-4 rounded-xl border border-linea bg-papel p-3 transition-colors hover:border-tinta ${p.publicado ? '' : 'opacity-60'}`}
                      >
                        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-niebla text-sm font-bold text-tinta-2">
                          {p.foto ? <img src={p.foto} alt="" loading="lazy" className="h-full w-full object-cover object-top" /> : iniciales(p.nombre)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-tight">{p.nombre}</span>
                          <span className="mt-0.5 line-clamp-2 text-sm leading-snug text-tinta-2">{p.cargo || 'Sin cargo'}</span>
                          <span className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                            {p.destacado && <span className="rounded-full bg-marca-suave px-2 py-0.5 font-semibold text-marca-texto">Portada</span>}
                            {!p.publicado && <span className="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600">Oculta</span>}
                            {p.sedeSlug && <span className="rounded-full border border-linea px-2 py-0.5">{ciudad(p.sedeSlug)}</span>}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
