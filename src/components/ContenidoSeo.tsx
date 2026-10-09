import type { SeccionSeo } from '@/data/areas-seo';
import { AVISO_INTERNO } from '@/data/site';

/**
 * Pinta el contenido SEO de una página (plantilla de PLAN-SEO-PAGINAS.md): apartados con H2 descriptivos,
 * listas con título + explicación y bloque de preguntas frecuentes. Lo usan internacional, fichas, PAE, etc.
 * Las áreas usan su propia plantilla (misma forma de datos).
 */
export type PaginaSeo = {
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  busquedaPrincipal: string;
  secciones: SeccionSeo[];
  faqs: { q: string; a: string }[];
  validado: boolean;
};

export function ContenidoSeo({ pagina, lang = 'es', tituloFaqs }: { pagina: PaginaSeo; lang?: 'es' | 'en'; tituloFaqs?: string }) {
  const en = lang === 'en';
  return (
    <>
      {AVISO_INTERNO && !pagina.validado && (
        <p className="aviso">{en ? 'Draft text, pending review by Serveco.' : 'Texto pendiente de validar por Serveco.'}</p>
      )}
      {pagina.secciones.map((s) => (
        <div key={s.h2}>
          <h2>{s.h2}</h2>
          {s.parrafos.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
          {s.lista && (
            <ul className="servicios-lista">
              {s.lista.map((i) => (
                <li key={i.t}>
                  <strong>{i.t}.</strong> {i.d}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {pagina.faqs.length > 0 && (
        <>
          <h2>{tituloFaqs ?? (en ? 'Frequently asked questions' : 'Preguntas frecuentes')}</h2>
          <div className="faq">
            {pagina.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** Datos estructurados: Service + FAQPage + BreadcrumbList. */
export function EsquemasSeo({
  pagina,
  url,
  migas,
  proveedor,
  areaServida,
}: {
  pagina: PaginaSeo;
  url: string;
  migas: { nombre: string; url: string }[];
  proveedor: Record<string, unknown>;
  areaServida: Record<string, unknown>[];
}) {
  const servicio = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pagina.h1,
    serviceType: pagina.busquedaPrincipal,
    description: pagina.metaDescription,
    url,
    areaServed: areaServida,
    provider: proveedor,
  };
  const faq = pagina.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pagina.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }
    : null;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.nombre, item: m.url })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicio) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
