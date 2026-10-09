import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { articulosPublicados, fechaLarga } from '@/lib/blog/publico';
import { ES, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Fiscalidad, laboral, jurídico y ayudas para empresas, explicados por el equipo de Serveco.',
  alternates: { canonical: ES.blog, languages: idiomas(ES.blog) },
};

// H4.2: listado dinámico (lo que se publica en el panel aparece al momento).
export const dynamic = 'force-dynamic';

export default async function Blog() {
  const posts = await articulosPublicados();
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Blog' }]}
        titulo="Blog"
        lead="Cambios normativos, plazos y ayudas explicados por el equipo."
      />
      <section>
        <div className="wrap">
          {posts.length === 0 ? (
            <p>Todavía no hay artículos publicados.</p>
          ) : (
            <div className="posts">
              {posts.map((p) => (
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
