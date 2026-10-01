import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EscenaFoto from '@/components/EscenaFoto';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { AREAS, getArea } from '@/data/areas';
import { getAreaSeo } from '@/data/areas-seo';
import { ESCENA_AREA } from '@/data/escenas';
import { SEDES } from '@/data/offices';
import { LANDINGS } from '@/data/landings';
import { EMPRESA, SITE_URL } from '@/data/site';
import { articulosPublicados } from '@/lib/blog/publico';
import { ES, EN } from '@/lib/rutas';

/**
 * Página de ÁREA (money page). Plantilla SEO: W - SERVECO/PLAN-SEO-PAGINAS.md § 3.1.
 * Contenido en src/data/areas-seo.ts. H1 = búsqueda principal; H2 = preguntas reales; FAQs con schema.
 */
type Params = Promise<{ area: string }>;

export const dynamicParams = false;
// Los artículos del área salen de Supabase: se regenera cada 10 min.
export const revalidate = 600;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { area } = await params;
  const a = getArea(area);
  if (!a) return {};
  const seo = getAreaSeo(a.slug);
  return {
    title: { absolute: seo?.title ?? `Asesoría ${a.nombre.toLowerCase()} para empresas | Serveco` },
    description: seo?.metaDescription ?? a.resumen,
    alternates: { canonical: ES.area(a.slug), languages: { es: ES.area(a.slug), en: EN.area(a.slugEn) } },
    openGraph: { title: seo?.title, description: seo?.metaDescription, type: 'website' },
  };
}

export default async function AreaPage({ params }: { params: Params }) {
  const { area } = await params;
  const a = getArea(area);
  if (!a) notFound();
  const seo = getAreaSeo(a.slug);

  const landings = LANDINGS.filter((l) => l.area === a.slug);
  const relacionadas = (seo?.relacionadas ?? []).map((s) => AREAS.find((x) => x.slug === s)).filter(Boolean) as typeof AREAS;
  const articulos = (await articulosPublicados()).filter((p) => p.categoria === a.nombre).slice(0, 3);

  const url = `${SITE_URL}${ES.area(a.slug)}`;
  const servicioLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: seo?.h1 ?? a.nombre,
    serviceType: seo?.busquedaPrincipal ?? a.nombre,
    description: seo?.metaDescription ?? a.resumen,
    url,
    areaServed: [{ '@type': 'AdministrativeArea', name: 'Región de Murcia' }, { '@type': 'City', name: 'Benidorm' }],
    provider: {
      '@type': 'ProfessionalService',
      name: EMPRESA.razonSocial,
      url: SITE_URL,
      telephone: EMPRESA.tel,
      foundingDate: String(EMPRESA.fundacion),
    },
  };
  const faqLd = seo?.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }
    : null;
  const migasLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}${ES.home}` },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${SITE_URL}${ES.servicios}` },
      { '@type': 'ListItem', position: 3, name: a.nombre, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicioLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(migasLd) }} />

      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Servicios', href: ES.servicios }, { label: a.nombre }]}
        titulo={seo?.h1 ?? `Área ${a.nombre.toLowerCase()}`}
        lead={seo?.lead ?? a.intro}
      />

      <section>
        <div className="wrap dos">
          <div className="texto">
            {ESCENA_AREA[a.slug] && <EscenaFoto id={ESCENA_AREA[a.slug]} />}
            {seo && !seo.validado && (
              <p className="aviso">Texto pendiente de validar por el área {a.nombre.toLowerCase()} de Serveco.</p>
            )}

            {seo ? (
              seo.secciones.map((s) => (
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
              ))
            ) : (
              <>
                <h2>Qué incluye</h2>
                <ul>{a.incluye.map((i) => <li key={i}>{i}</li>)}</ul>
              </>
            )}

            {seo && seo.faqs.length > 0 && (
              <>
                <h2>Preguntas frecuentes sobre {seo.busquedaPrincipal}</h2>
                <div className="faq">
                  {seo.faqs.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside>
            <div className="caja">
              <h3>¿Dónde le atendemos?</h3>
              <p style={{ marginBottom: 10, color: 'var(--tinta-2)' }}>El área {a.nombre.toLowerCase()} trabaja desde todos nuestros despachos:</p>
              <ul className="lista-simple">
                {SEDES.map((s) => {
                  const landing = landings.find((l) => l.sede === s.slug);
                  return (
                    <li key={s.slug}>
                      <Link href={landing ? ES.landing(a.slug, s.slug) : ES.sede(s.slug)}>
                        {landing ? `${a.nombre} en ${s.ciudad}` : `Despacho de ${s.ciudad}`}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {relacionadas.length > 0 && (
              <div className="caja">
                <h3>Áreas relacionadas</h3>
                <ul className="lista-simple">
                  {relacionadas.map((o) => (
                    <li key={o.slug}><Link href={ES.area(o.slug)}>{o.nombre}</Link></li>
                  ))}
                </ul>
              </div>
            )}

            {articulos.length > 0 && (
              <div className="caja">
                <h3>Artículos del área</h3>
                <ul className="lista-simple">
                  {articulos.map((p) => (
                    <li key={p.slug}><Link href={ES.post(p.slug)}>{p.titulo}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="contacto">
        <div className="wrap">
          <div>
            <h2>Consulte con el área {a.nombre.toLowerCase()}</h2>
            <p style={{ color: 'var(--tinta-2)', marginTop: 14 }}>
              Cuéntenos qué necesita y desde qué despacho prefiere que le atendamos. Le responde el área que corresponde.
            </p>
          </div>
          <ContactForm
            lang="es"
            areas={AREAS.map((x) => x.nombre)}
            sedes={SEDES.map((s) => s.ciudad)}
            areaInicial={a.nombre}
          />
        </div>
      </section>
    </>
  );
}
