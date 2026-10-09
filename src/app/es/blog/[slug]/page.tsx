import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import { articuloPublicado, articulosPublicados, fechaLarga } from '@/lib/blog/publico';
import { SITE_URL, EMPRESA } from '@/data/site';
import { ES, idiomas } from '@/lib/rutas';

type Params = Promise<{ slug: string }>;

// H4.2: dinámico (lo que se publica en el panel aparece al momento).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await articuloPublicado(slug);
  if (!p) return {};
  return {
    title: p.seoTitle || p.titulo,
    description: p.meta,
    alternates: { canonical: ES.post(p.slug), languages: idiomas(ES.post(p.slug)) },
    openGraph: {
      type: 'article',
      title: p.titulo,
      description: p.meta,
      publishedTime: p.fecha,
      ...(p.portada ? { images: [{ url: p.portada, alt: p.portadaAlt }] } : {}),
    },
    ...(p.portada ? { twitter: { card: 'summary_large_image' as const, images: [p.portada] } } : {}),
  };
}

export default async function Articulo({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await articuloPublicado(slug);
  if (!p) notFound();

  const otros = (await articulosPublicados(4)).filter((x) => x.slug !== p.slug).slice(0, 3);
  const vigencia = p.actualizadoA ? fechaLarga(`${p.actualizadoA}T12:00:00`) : fechaLarga(p.fecha);

  const articuloLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.titulo,
    description: p.meta,
    datePublished: p.fecha,
    dateModified: p.actualizadoA ?? p.fecha,
    mainEntityOfPage: `${SITE_URL}${ES.post(p.slug)}`,
    ...(p.portada ? { image: [p.portada] } : {}),
    author: { '@type': 'Organization', name: EMPRESA.razonSocial, url: SITE_URL },
    publisher: { '@type': 'Organization', name: EMPRESA.razonSocial, url: SITE_URL },
  };
  const faqLd = p.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articuloLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Blog', href: ES.blog }, { label: p.categoria || 'Artículo' }]}
        titulo={p.titulo}
        lead={`${p.categoria ? `${p.categoria} · ` : ''}${fechaLarga(p.fecha)}`}
      />
      <section>
        <div className="wrap dos">
          <article>
            {p.portada && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.portada} alt={p.portadaAlt} className="mb-8 w-full rounded-marca" />
            )}
            <div className="texto articulo" dangerouslySetInnerHTML={{ __html: p.html }} />

            {p.faqs.length > 0 && (
              <div className="texto faq" style={{ marginTop: 40 }}>
                <h2>Preguntas frecuentes</h2>
                {p.faqs.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            )}

            {p.fuentes.length > 0 && (
              <div className="texto" style={{ marginTop: 40 }}>
                <h2>Fuentes oficiales</h2>
                <ul>
                  {p.fuentes.map((f) => (
                    <li key={f.url}>
                      <a className="enlace" href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="aviso" style={{ marginTop: 40 }}>
              Información general actualizada a fecha de {vigencia}.
              {p.revisadoPor ? ` Revisado por ${p.revisadoPor}, de Serveco Asesores.` : ''} Este artículo no sustituye el
              asesoramiento profesional: cada caso requiere un estudio concreto.
            </p>
          </article>

          <aside>
            <div className="caja">
              <h3>¿Le afecta a su empresa?</h3>
              <p style={{ marginBottom: 14, color: 'var(--tinta-2)' }}>Cuéntenos su caso y le responde el área que corresponde.</p>
              <Link className="btn btn-marca" href={ES.contacto}>Hacer una consulta</Link>
            </div>
            {otros.length > 0 && (
              <div className="caja">
                <h3>Más artículos</h3>
                <ul className="lista-simple">
                  {otros.map((o) => <li key={o.slug}><Link href={ES.post(o.slug)}>{o.titulo}</Link></li>)}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
