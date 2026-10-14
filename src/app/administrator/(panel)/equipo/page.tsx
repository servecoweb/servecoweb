import Link from 'next/link';
import { DEPARTAMENTOS, leerMiembros } from '@/lib/equipo';
import { SEDES } from '@/data/offices';

/** /administrator/equipo — las personas que salen en la web. */
export const dynamic = 'force-dynamic';

type SP = Promise<{ ok?: string; error?: string }>;

export default async function EquipoAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const gente = await leerMiembros();
  const ciudad = (slug: string) => SEDES.find((s) => s.slug === slug)?.ciudad;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Equipo</h1>
          <p className="text-sm text-tinta-2">
            {gente.length} personas. Lo que se guarda aquí es lo que ve la web, en español y en inglés.
          </p>
        </div>
        <Link href="/administrator/equipo/nuevo" className="rounded-lg bg-marca px-4 py-2 text-sm font-semibold text-tinta hover:bg-marca-hover">
          Añadir persona
        </Link>
      </div>

      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}

      {gente.length === 0 && <p className="text-sm text-tinta-2">Todavía no hay nadie en la base. La web sigue enseñando el equipo de reserva.</p>}

      {DEPARTAMENTOS.map((d) => {
        const bloque = gente.filter((p) => p.departamento === d.id);
        if (bloque.length === 0) return null;
        return (
          <section key={d.id}>
            <h2 className="mb-3 text-lg font-bold">{d.es}</h2>
            <ul className="divide-y divide-linea overflow-hidden rounded-xl border border-linea bg-papel">
              {bloque.map((p) => (
                <li key={p.id}>
                  <Link href={`/administrator/equipo/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-niebla">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-niebla">
                      {p.foto ? <img src={p.foto} alt="" className="h-full w-full object-cover" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{p.nombre}</span>
                      <span className="block truncate text-sm text-tinta-2">
                        {p.cargo}
                        {p.sedeSlug ? ` · ${ciudad(p.sedeSlug)}` : ''}
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-1.5">
                      {p.destacado && <span className="rounded-full bg-marca-suave px-2 py-0.5 text-xs font-semibold">Portada</span>}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.publicado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {p.publicado ? 'Visible' : 'Oculta'}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
