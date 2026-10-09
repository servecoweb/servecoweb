import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { ContenidoSeo, EsquemasSeo } from '@/components/ContenidoSeo';
import { AREAS } from '@/data/areas';
import { SEDES, comoLlegar, getSede } from '@/data/offices';
import { SEDES_SEO } from '@/data/sedes-seo';
import { LANDINGS } from '@/data/landings';
import { EQUIPO } from '@/data/team';
import { EMPRESA, SITE_URL, telHref } from '@/data/site';
import { ES, idiomas } from '@/lib/rutas';

/**
 * Ficha de despacho (plantilla PLAN-SEO-PAGINAS.md § 3.3). Contenido: src/data/sedes-seo.ts.
 *  · Marcado de negocio local (AccountingService) POR CADA LOCAL, con su dirección y teléfono.
 *  · «Cómo llegar» abre Google Maps en otra pestaña: NO se incrusta el mapa (instalaría cookies sin consentimiento).
 *  · Sin horarios ni coordenadas: pendientes de Serveco (no se inventan).
 */
type Params = Promise<{ sede: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return SEDES.map((s) => ({ sede: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { sede } = await params;
  const s = getSede(sede);
  if (!s) return {};
  const seo = SEDES_SEO[s.slug];
  return {
    title: { absolute: seo?.title ?? `Asesoría en ${s.ciudad} | Serveco Asesores` },
    description: seo?.metaDescription ?? `Despacho de Serveco Asesores en ${s.ciudad}: ${s.locales.map((l) => l.direccion).join(' y ')}.`,
    alternates: { canonical: ES.sede(s.slug), languages: idiomas(ES.sede(s.slug)) },
  };
}

export default async function FichaSede({ params }: { params: Params }) {
  const { sede } = await params;
  const s = getSede(sede);
  if (!s) notFound();
  const seo = SEDES_SEO[s.slug];

  const landings = LANDINGS.filter((l) => l.sede === s.slug);
  const personas = EQUIPO.filter((p) => p.sedeSlug === s.slug);
  const url = `${SITE_URL}${ES.sede(s.slug)}`;
  const region = s.zona === 'Costa de Alicante' ? 'Alicante' : 'Región de Murcia';

  // Negocio local: una entidad por cada local (Murcia y Yecla tienen dos).
  const locales = s.locales.map((l) => ({
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: s.locales.length > 1 ? `${EMPRESA.razonSocial} · ${s.ciudad} (${l.direccion})` : `${EMPRESA.razonSocial} · ${s.ciudad}`,
    url,
    telephone: `+34 ${l.tel}`,
    email: EMPRESA.email,
    address: { '@type': 'PostalAddress', streetAddress: l.direccion, addressLocality: s.ciudad, addressRegion: region, addressCountry: 'ES' },
    areaServed: (seo?.zonaAtendida ?? [s.ciudad]).map((z) => ({ '@type': 'Place', name: z })),
    parentOrganization: { '@type': 'Organization', name: EMPRESA.razonSocial, url: SITE_URL, foundingDate: String(EMPRESA.fundacion) },
    knowsLanguage: s.slug === 'benidorm' ? ['es', 'en'] : ['es'],
  }));

  return (
    <>
      {locales.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {seo && (
        <EsquemasSeo
          pagina={seo}
          url={url}
          migas={[
            { nombre: 'Inicio', url: `${SITE_URL}${ES.home}` },
            { nombre: 'La firma', url: `${SITE_URL}${ES.firma}` },
            { nombre: 'Despachos', url: `${SITE_URL}${ES.despachos}` },
            { nombre: s.ciudad, url },
          ]}
          proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
          areaServida={(seo.zonaAtendida ?? [s.ciudad]).map((z) => ({ '@type': 'Place', name: z }))}
        />
      )}

      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'La firma', href: ES.firma }, { label: 'Despachos', href: ES.despachos }, { label: s.ciudad }]}
        titulo={seo?.h1 ?? `Serveco en ${s.ciudad}`}
        lead={seo?.lead ?? (s.central ? 'Sede central de la firma.' : `Despacho de Serveco Asesores en ${s.ciudad}.`)}
      />

      <section>
        <div className="wrap dos">
          <div className="texto">
            {seo ? <ContenidoSeo pagina={seo} tituloFaqs={`Preguntas frecuentes sobre el despacho de ${s.ciudad}`} /> : null}

            {landings.length > 0 && (
              <>
                <h2>Servicios especializados en {s.ciudad}</h2>
                <ul>
                  {landings.map((l) => {
                    const a = AREAS.find((x) => x.slug === l.area);
                    return <li key={l.area}><Link className="enlace" href={ES.landing(l.area, s.slug)}>{a?.nombre ?? l.area} en {s.ciudad}</Link></li>;
                  })}
                </ul>
              </>
            )}
            {personas.length > 0 && (
              <>
                <h2>Equipo en {s.ciudad}</h2>
                <ul>{personas.map((p, i) => <li key={i}>{p.nombre} · {p.cargo}</li>)}</ul>
              </>
            )}
          </div>

          <aside>
            {s.locales.map((l) => (
              <div className="caja" key={l.direccion}>
                <h3>{s.locales.length > 1 ? l.direccion : `Despacho de ${s.ciudad}`}</h3>
                <p style={{ marginBottom: 8 }}>
                  {l.direccion}
                  <br />
                  {s.ciudad} ({region})
                </p>
                <p style={{ marginBottom: 12 }}>
                  <a className="enlace" href={telHref(l.tel)}>{l.tel}</a>
                </p>
                <p style={{ marginBottom: 8, fontSize: 14, color: 'var(--tinta-2)' }}>Horario: consúltelo por teléfono.</p>
                <a className="btn btn-linea" href={comoLlegar(l.direccion, s.ciudad)} target="_blank" rel="noopener noreferrer">
                  Cómo llegar
                </a>
              </div>
            ))}
            <div className="caja">
              <h3>Áreas que atendemos</h3>
              <ul className="lista-simple">
                {AREAS.map((a) => (
                  <li key={a.slug}><Link href={ES.area(a.slug)}>{a.nombre}</Link></li>
                ))}
              </ul>
            </div>
            {/* Servicios internacionales en LOS SEIS despachos (Narciso, 25 sep); Benidorm, el especializado. */}
            <div className="caja">
              <h3>Clientes internacionales</h3>
              <p style={{ marginBottom: 12, color: 'var(--tinta-2)' }}>
                {s.slug === 'benidorm'
                  ? 'NIE, impuesto de no residentes, herencias y vivienda, en inglés. Este despacho está especializado en clientes internacionales.'
                  : `También en ${s.ciudad}: NIE, impuesto de no residentes, herencias y compraventa de vivienda para extranjeros.`}
              </p>
              <Link className="enlace" href={s.slug === 'benidorm' ? ES.intl('benidorm') : ES.internacional}>
                {s.slug === 'benidorm' ? 'Asesoría para extranjeros en Benidorm' : 'Servicios para extranjeros y no residentes'}
              </Link>
            </div>
            <div className="caja">
              <h3>Otros despachos</h3>
              <ul className="lista-simple">
                {SEDES.filter((o) => o.slug !== s.slug).map((o) => (
                  <li key={o.slug}><Link href={ES.sede(o.slug)}>{o.ciudad}</Link></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="contacto">
        <div className="wrap">
          <div>
            <h2>Escriba al despacho de {s.ciudad}</h2>
            <p style={{ color: 'var(--tinta-2)', marginTop: 14 }}>Le responde el área que corresponde desde {s.ciudad}.</p>
          </div>
          <ContactForm lang="es" areas={AREAS.map((a) => a.nombre)} sedes={SEDES.map((x) => x.ciudad)} sedeInicial={s.ciudad} />
        </div>
      </section>
    </>
  );
}
