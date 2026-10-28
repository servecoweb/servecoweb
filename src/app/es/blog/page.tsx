import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { AREAS } from '@/data/areas';
import { articulosPublicados, fechaLarga, perteneceAlArea } from '@/lib/blog/publico';
import { ES, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Fiscalidad, laboral, jurídico y ayudas para empresas, explicados por el equipo de Serveco.',
  alternates: { canonical: ES.blog, languages: idiomas(ES.blog) },
};

// H4.2: listado dinámico (lo que se publica en el panel aparece al momento).
export const dynamic = 'force-dynamic';

type SP = Promise<{ area?: string }>;

export default async function Blog({ searchParams }: { searchParams: SP }) {
  const { area } = await searchParams;
  const posts = await articulosPublicados();
  const areas = AREAS.filter((a) => posts.some((p) => perteneceAlArea(p, a)));
  const activa = areas.find((a) => a.slug === area) ?? null;
  const lista = activa ? posts.filter((p) => perteneceAlArea(p, activa)) : posts;
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Blog' }]}
        titulo="Blog"
        lead={activa ? `Artículos de ${activa.nombre}.` : 'Cambios normativos, plazos y ayudas explicados por el equipo.'}
      />
      <section>
        <div className="wrap">
          {areas.length > 0 && (
            <nav className="filtro-zona mb-7" aria-label="Filtrar por categoría">
              <Link href={ES.blog} aria-current={activa ? undefined : 'page'}>Todas</Link>
              {areas.map((a) => (
                <Link key={a.slug} href={`${ES.blog}?area=${a.slug}`} aria-current={activa?.slug === a.slug ? 'page' : undefined}>
                  {a.nombre}
                </Link>
              ))}
            </nav>
          )}
          {lista.length === 0 ? (
            <p>{activa ? `Todavía no hay artículos de ${activa.nombre}.` : 'Todavía no hay artículos publicados.'}</p>
          ) : (
            <div className="posts">
              {lista.map((p) => (
                <Link className="post" href={ES.post(p.slug)} key={p.slug}>
                  {p.portada ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.portada} alt={p.portadaAlt} className="portada" loading="lazy" />
                  ) : (
                    <div className="portada">Serveco</div>
                  )}
                  <div className="cuerpo">
                    <p className="meta">
                      <span className="cat">{p.categoria}</span>
                      <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
                    </p>
                    <h3>{p.titulo}</h3>
                    <p className="extracto">{p.extracto}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
