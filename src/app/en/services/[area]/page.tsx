import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EscenaFoto from '@/components/EscenaFoto';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { ContenidoSeo, EsquemasSeo } from '@/components/ContenidoSeo';
import { AREAS, getAreaEn } from '@/data/areas';
import { AREAS_SEO_EN } from '@/data/areas-seo-en';
import { ESCENA_AREA } from '@/data/escenas';
import { SEDES } from '@/data/offices';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES, EN, idiomas } from '@/lib/rutas';

/**
 * Área en inglés (plantilla PLAN-SEO-PAGINAS.md § 3.1). Contenido propio en src/data/areas-seo-en.ts
 * (no traducción: escrito para quien busca en inglés).
 */
type Params = Promise<{ area: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slugEn }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { area } = await params;
  const a = getAreaEn(area);
  if (!a) return {};
  const seo = AREAS_SEO_EN[a.slug];
  return {
    title: { absolute: seo?.title ?? `${a.nombreEn} advice in Spain | Serveco` },
    description: seo?.metaDescription ?? a.resumenEn,
    alternates: { canonical: EN.area(a.slugEn), languages: idiomas(ES.area(a.slug), EN.area(a.slugEn)) },
  };
}

export default async function AreaEn({ params }: { params: Params }) {
  const { area } = await params;
  const a = getAreaEn(area);
  if (!a) notFound();
  const seo = AREAS_SEO_EN[a.slug];
  const url = `${SITE_URL}${EN.area(a.slugEn)}`;
  const relacionadas = (seo?.relacionadas ?? []).map((s) => AREAS.find((x) => x.slug === s)).filter(Boolean) as typeof AREAS;

  return (
    <>
      {seo && (
        <EsquemasSeo
          pagina={seo}
          url={url}
          migas={[
            { nombre: 'Home', url: `${SITE_URL}${EN.home}` },
            { nombre: 'Services', url: `${SITE_URL}${EN.services}` },
            { nombre: a.nombreEn, url },
          ]}
          proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
          areaServida={[
            { '@type': 'AdministrativeArea', name: 'Region of Murcia' },
            { '@type': 'AdministrativeArea', name: 'Province of Alicante' },
          ]}
        />
      )}
      <PageHead
        migas={[{ label: 'Home', href: EN.home }, { label: 'Services', href: EN.services }, { label: a.nombreEn }]}
        titulo={seo?.h1 ?? `${a.nombreEn} advice`}
        lead={seo?.lead ?? a.resumenEn}
      />
      <section>
        <div className="wrap dos">
          <div className="texto">
            {ESCENA_AREA[a.slug] && <EscenaFoto id={ESCENA_AREA[a.slug]} lang="en" />}
            {seo && <ContenidoSeo pagina={seo} lang="en" />}
            <p style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-marca" href={EN.contact}>Ask us a question</Link>
              <Link className="btn btn-linea" href={ES.area(a.slug)} lang="es">Leer en español</Link>
            </p>
          </div>
          <aside>
            {relacionadas.length > 0 && (
              <div className="caja">
                <h3>Related services</h3>
                <ul className="lista-simple">
                  {relacionadas.map((o) => (
                    <li key={o.slug}><Link href={EN.area(o.slugEn)}>{o.nombreEn}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="caja">
              <h3>For international clients</h3>
              <ul className="lista-simple">
                <li><Link href={EN.international}>Non-residents and expats</Link></li>
                <li><Link href={EN.intl('nie-number')}>NIE number</Link></li>
                <li><Link href={EN.intl('non-resident-tax')}>Non-resident tax</Link></li>
              </ul>
            </div>
            <div className="caja">
              <h3>Our offices</h3>
              <p style={{ color: 'var(--tinta-2)', marginBottom: 12 }}>{SEDES.map((s) => s.ciudad).join(' · ')}</p>
              <Link className="enlace" href={EN.offices}>See all offices</Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="contacto">
        <div className="wrap">
          <div>
            <h2>Talk to our {a.nombreEn.toLowerCase()} team</h2>
            <p style={{ color: 'var(--tinta-2)', marginTop: 14 }}>We reply in English.</p>
          </div>
          <ContactForm lang="en" areas={AREAS.map((x) => x.nombreEn)} sedes={SEDES.map((s) => s.ciudad)} areaInicial={a.nombreEn} />
        </div>
      </section>
    </>
  );
}
