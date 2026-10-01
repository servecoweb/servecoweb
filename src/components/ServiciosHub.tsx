import Link from 'next/link';
import PageHead from './PageHead';
import { ContenidoSeo, EsquemasSeo } from './ContenidoSeo';
import { AREAS } from '@/data/areas';
import { HUB_SEO } from '@/data/hub-seo';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/**
 * Página de servicios (hub) ES y EN. Contenido: src/data/hub-seo.ts.
 * Orden: guía «¿Qué necesita?» (situación → página que existe) · las 8 áreas · contenido SEO · también.
 * La guía reutiliza el estilo de tarjetas con flecha de AccesosIntl (.intl-accesos).
 */
export default function ServiciosHub({ lang }: { lang: 'es' | 'en' }) {
  const en = lang === 'en';
  const seo = HUB_SEO[lang];
  const url = `${SITE_URL}${en ? EN.services : ES.servicios}`;

  return (
    <>
      <EsquemasSeo
        pagina={seo}
        url={url}
        migas={[
          { nombre: en ? 'Home' : 'Inicio', url: `${SITE_URL}${en ? EN.home : ES.home}` },
          { nombre: en ? 'Services' : 'Servicios', url },
        ]}
        proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
        areaServida={[
          { '@type': 'AdministrativeArea', name: en ? 'Region of Murcia' : 'Región de Murcia' },
          { '@type': 'AdministrativeArea', name: en ? 'Province of Alicante' : 'Provincia de Alicante' },
        ]}
      />
      <PageHead
        migas={[{ label: en ? 'Home' : 'Inicio', href: en ? EN.home : ES.home }, { label: en ? 'Services' : 'Servicios' }]}
        titulo={seo.h1}
        lead={seo.lead}
      />

      <section>
        <div className="wrap">
          <div className="cabecera" style={{ marginBottom: 20 }}>
            <div>
              <h2>{en ? 'Find the right service for your situation' : 'Encuentre el servicio que necesita'}</h2>
              <p>{en ? 'Choose the situation closest to yours and go straight to the right page.' : 'Elija la situación que más se parezca a la suya y vaya directamente a la página que le corresponde.'}</p>
            </div>
          </div>
          <ul className="intl-accesos">
            {seo.guia.map((g) => (
              <li key={g.situacion}>
                <Link href={g.href}>
                  <strong>{g.situacion}</strong>
                  <span>{g.destino}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cabecera" style={{ marginBottom: 20 }}>
            <div>
              <h2>{en ? 'Our eight areas' : 'Nuestras ocho áreas'}</h2>
            </div>
          </div>
          <div className="areas">
            {AREAS.map((a) => (
              <Link className="area" href={en ? EN.area(a.slugEn) : ES.area(a.slug)} key={a.slug}>
                <h3>{en ? a.nombreEn : a.nombre}</h3>
                <p>{en ? a.resumenEn : a.resumen}</p>
                <span className="ir">{en ? 'See the service' : 'Ver el área'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap dos">
          <div className="texto">
            <ContenidoSeo pagina={seo} lang={lang} />
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn-marca" href={en ? EN.contact : ES.contacto}>
                {en ? 'Tell us about your case' : 'Cuéntenos su caso'}
              </Link>
            </p>
          </div>
          <aside>
            <div className="caja">
              <h3>{en ? 'Also' : 'También'}</h3>
              <ul className="lista-simple">
                {en ? (
                  <>
                    <li><Link href={EN.international}>Non-residents and expats</Link></li>
                    <li><Link href={EN.offices}>Our six offices</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href={ES.subvenciones}>Subvenciones y ayudas</Link></li>
                    <li><Link href={ES.pae}>Punto PAE · crear una empresa</Link></li>
                    <li><Link href={ES.internacional}>Internacional y no residentes</Link></li>
                    <li><Link href={ES.despachos}>Nuestros seis despachos</Link></li>
                  </>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
