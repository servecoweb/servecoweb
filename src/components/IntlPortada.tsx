import Link from 'next/link';
import EscenaFoto from './EscenaFoto';
import PageHead from './PageHead';
import AccesosIntl from './AccesosIntl';
import DespachosIntl from './DespachosIntl';
import { ContenidoSeo, EsquemasSeo } from './ContenidoSeo';
import { INTL_SEO } from '@/data/intl-seo';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/**
 * Portada del silo internacional (/es/internacional y /en/international). Contenido: src/data/intl-seo.ts.
 * Arriba, los accesos con enlace (NIE, IRNR, Benidorm, herencias); debajo, el contenido SEO.
 */
export default function IntlPortada({ lang }: { lang: 'es' | 'en' }) {
  const en = lang === 'en';
  const seo = INTL_SEO.portada[lang];
  const url = `${SITE_URL}${en ? EN.international : ES.internacional}`;

  return (
    <>
      <EsquemasSeo
        pagina={seo}
        url={url}
        migas={[
          { nombre: en ? 'Home' : 'Inicio', url: `${SITE_URL}${en ? EN.home : ES.home}` },
          { nombre: en ? 'International clients' : 'Internacional', url },
        ]}
        proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
        areaServida={[{ '@type': 'Country', name: 'Spain' }]}
      />
      <PageHead
        migas={[{ label: en ? 'Home' : 'Inicio', href: en ? EN.home : ES.home }, { label: en ? 'International clients' : 'Internacional' }]}
        titulo={seo.h1}
        lead={seo.lead}
      />
      <section>
        <div className="wrap dos">
          <div className="texto">
            <AccesosIntl lang={lang} />
            <div style={{ marginTop: 32 }}>
              <EscenaFoto id="llaves" lang={lang} />
            </div>
            <ContenidoSeo pagina={seo} lang={lang} />
            <p style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-marca" href={en ? EN.contact : ES.contacto}>
                {en ? 'Ask us a question' : 'Hacer una consulta'}
              </Link>
              <Link className="btn btn-linea" href={en ? ES.internacional : EN.international} lang={en ? 'es' : 'en'}>
                {en ? 'Leer en español' : 'Read in English'}
              </Link>
            </p>
          </div>
          <aside>
            {/* Los servicios internacionales se prestan en los seis despachos; Benidorm es el especializado. */}
            <DespachosIntl lang={lang} />
            <div className="caja">
              <h3>{en ? 'Talk to us' : 'Hable con nosotros'}</h3>
              <p style={{ marginBottom: 14, color: 'var(--tinta-2)' }}>
                {en ? 'Tell us about your situation and we will reply in English.' : 'Cuéntenos su situación y le responderemos en su idioma.'}
              </p>
              <Link className="btn btn-marca" href={en ? EN.contact : ES.contacto}>{en ? 'Contact us' : 'Contactar'}</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
