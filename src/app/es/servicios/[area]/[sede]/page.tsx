import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EscenaFoto from '@/components/EscenaFoto';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { ContenidoSeo, EsquemasSeo } from '@/components/ContenidoSeo';
import { AREAS, getArea } from '@/data/areas';
import { ESCENA_AREA } from '@/data/escenas';
import { SEDES, getSede } from '@/data/offices';
import { LANDINGS, getLanding } from '@/data/landings';
import { AVISO_INTERNO, EMPRESA, SITE_URL, telHref } from '@/data/site';
import { ES, idiomas } from '@/lib/rutas';

/**
 * Landing área × sede (partida 02). Contenido: src/data/landings-*.ts (plantilla PLAN-SEO-PAGINAS.md).
 * Busca «[área] en [ciudad]»: no compite con el área («… en Murcia») ni con la ficha («asesoría en [ciudad]»).
 */
type Params = Promise<{ area: string; sede: string }>;

// Solo existen las landings que hay en datos (tabla seo_landings). El resto, 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ area: l.area, sede: l.sede }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { area, sede } = await params;
  const l = getLanding(area, sede);
  if (!l) return {};
  return {
    title: { absolute: l.title },
    description: l.metaDescription,
    alternates: { canonical: ES.landing(area, sede), languages: idiomas(ES.landing(area, sede)) },
  };
}

export default async function LandingPage({ params }: { params: Params }) {
  const { area, sede } = await params;
  const l = getLanding(area, sede);
  const a = getArea(area);
  const s = getSede(sede);
  if (!l || !a || !s) notFound();

  const url = `${SITE_URL}${ES.landing(area, sede)}`;
  const region = s.zona === 'Costa de Alicante' ? 'Alicante' : 'Región de Murcia';
  const mismaArea = LANDINGS.filter((x) => x.area === area && x.sede !== sede);
  const mismaSede = LANDINGS.filter((x) => x.sede === sede && x.area !== area);

  return (
    <>
      <EsquemasSeo
        pagina={l}
        url={url}
        migas={[
          { nombre: 'Inicio', url: `${SITE_URL}${ES.home}` },
          { nombre: 'Servicios', url: `${SITE_URL}${ES.servicios}` },
          { nombre: a.nombre, url: `${SITE_URL}${ES.area(a.slug)}` },
          { nombre: s.ciudad, url },
        ]}
        proveedor={{
          '@type': 'AccountingService',
          name: `${EMPRESA.razonSocial} · ${s.ciudad}`,
          url: `${SITE_URL}${ES.sede(s.slug)}`,
          telephone: s.locales[0] ? `+34 ${s.locales[0].tel}` : undefined,
          address: s.locales[0]
            ? { '@type': 'PostalAddress', streetAddress: s.locales[0].direccion, addressLocality: s.ciudad, addressRegion: region, addressCountry: 'ES' }
            : undefined,
        }}
        areaServida={[{ '@type': 'City', name: s.ciudad }]}
      />

      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Servicios', href: ES.servicios }, { label: a.nombre, href: ES.area(a.slug) }, { label: s.ciudad }]}
        titulo={l.h1}
        lead={l.lead}
      />

      <section>
        <div className="wrap dos">
          <div className="texto">
            {ESCENA_AREA[a.slug] && <EscenaFoto id={ESCENA_AREA[a.slug]} />}
            {AVISO_INTERNO && l.pendienteReparto && (
              <p className="aviso">Página propuesta: pendiente de que Serveco confirme el reparto de las 12 landings.</p>
            )}
            <ContenidoSeo pagina={l} tituloFaqs={`Preguntas frecuentes: ${a.nombre.toLowerCase()} en ${s.ciudad}`} />
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn-marca" href="#consulta">{l.cta}</Link>
            </p>
          </div>

          <aside>
            <div className="caja">
              <h3>Despacho de {s.ciudad}</h3>
              {s.locales.map((loc) => (
                <p key={loc.direccion} style={{ marginBottom: 10 }}>
                  {loc.direccion}
                  <br />
                  <a className="enlace" href={telHref(loc.tel)}>{loc.tel}</a>
                </p>
              ))}
              <Link className="enlace" href={ES.sede(s.slug)}>Ver ficha del despacho</Link>
            </div>
            <div className="caja">
              <h3>Área {a.nombre.toLowerCase()}</h3>
              <p style={{ marginBottom: 12, color: 'var(--tinta-2)' }}>{a.resumen}</p>
              <Link className="enlace" href={ES.area(a.slug)}>Todo sobre el área {a.nombre.toLowerCase()}</Link>
            </div>
            {mismaSede.length > 0 && (
              <div className="caja">
                <h3>También en {s.ciudad}</h3>
                <ul className="lista-simple">
                  {mismaSede.map((x) => {
                    const xa = AREAS.find((y) => y.slug === x.area);
                    return <li key={x.area}><Link href={ES.landing(x.area, s.slug)}>{xa?.nombre ?? x.area} en {s.ciudad}</Link></li>;
                  })}
                </ul>
              </div>
            )}
            {mismaArea.length > 0 && (
              <div className="caja">
                <h3>{a.nombre} en otras ciudades</h3>
                <ul className="lista-simple">
                  {mismaArea.map((h) => {
                    const hs = SEDES.find((x) => x.slug === h.sede);
                    return <li key={h.sede}><Link href={ES.landing(area, h.sede)}>{hs?.ciudad ?? h.sede}</Link></li>;
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="contacto" id="consulta">
        <div className="wrap">
          <div>
            <h2>{l.cta}</h2>
            <p style={{ color: 'var(--tinta-2)', marginTop: 14 }}>Le atiende el área {a.nombre.toLowerCase()} desde {s.ciudad}.</p>
          </div>
          <ContactForm
            lang="es"
            areas={AREAS.map((x) => x.nombre)}
            sedes={SEDES.map((x) => x.ciudad)}
            areaInicial={a.nombre}
            sedeInicial={s.ciudad}
          />
        </div>
      </section>
    </>
  );
}
