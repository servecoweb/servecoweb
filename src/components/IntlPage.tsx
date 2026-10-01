import Link from 'next/link';
import EscenaFoto from './EscenaFoto';
import PageHead from './PageHead';
import DespachosIntl from './DespachosIntl';
import { ContenidoSeo, EsquemasSeo } from './ContenidoSeo';
import type { PaginaIntl } from '@/data/internacional';
import { INTL } from '@/data/internacional';
import { INTL_SEO } from '@/data/intl-seo';
import { getArea } from '@/data/areas';
import { getSede } from '@/data/offices';
import { EMPRESA, SITE_URL, telHref } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/**
 * Página del silo internacional (NIE, IRNR, Benidorm), ES y EN. Plantilla SEO: PLAN-SEO-PAGINAS.md.
 * Contenido en src/data/intl-seo.ts. Enlaces cruzados: portada internacional, las otras dos páginas,
 * despacho de Benidorm y áreas fiscal / jurídica (refuerzan las páginas de área).
 */
export default function IntlPage({ p, lang }: { p: PaginaIntl; lang: 'es' | 'en' }) {
  const en = lang === 'en';
  const seo = INTL_SEO[p.slug as keyof typeof INTL_SEO]?.[lang];
  const benidorm = getSede('benidorm');
  const otras = INTL.filter((x) => x.slug !== p.slug);
  const fiscal = getArea('fiscal');
  const juridico = getArea('juridico');

  const url = `${SITE_URL}${en ? EN.intl(p.slugEn) : ES.intl(p.slug)}`;
  const titulo = seo?.h1 ?? (en ? p.tituloEn : p.titulo);

  return (
    <>
      {seo && (
        <EsquemasSeo
          pagina={seo}
          url={url}
          migas={[
            { nombre: en ? 'Home' : 'Inicio', url: `${SITE_URL}${en ? EN.home : ES.home}` },
            { nombre: en ? 'International clients' : 'Internacional', url: `${SITE_URL}${en ? EN.international : ES.internacional}` },
            { nombre: titulo, url },
          ]}
          proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
          areaServida={[{ '@type': 'Country', name: 'Spain' }]}
        />
      )}
      <PageHead
        migas={[
          { label: en ? 'Home' : 'Inicio', href: en ? EN.home : ES.home },
          { label: en ? 'International clients' : 'Internacional', href: en ? EN.international : ES.internacional },
          { label: en ? p.tituloEn : p.titulo },
        ]}
        titulo={titulo}
        lead={seo?.lead ?? (en ? p.leadEn : p.lead)}
      />
      <section>
        <div className="wrap dos">
          <div className="texto">
            <EscenaFoto id="llaves" lang={lang} />
            {seo ? (
              <ContenidoSeo pagina={seo} lang={lang} />
            ) : (
              <>
                <h2>{en ? 'How we help' : 'Cómo le ayudamos'}</h2>
                <ul>{(en ? p.puntosEn : p.puntos).map((x) => <li key={x}>{x}</li>)}</ul>
              </>
            )}
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn-marca" href={en ? EN.contact : ES.contacto}>
                {en ? 'Ask us a question' : 'Hacer una consulta'}
              </Link>
            </p>
          </div>
          <aside>
            {/* Los servicios internacionales se prestan en los seis despachos (Narciso, 25 sep). En la página de Benidorm, además, su dirección. */}
            {p.slug === 'benidorm' && benidorm && (
              <div className="caja">
                <h3>{en ? 'Benidorm office' : 'Despacho de Benidorm'}</h3>
                {benidorm.locales.map((l) => (
                  <p key={l.direccion}>
                    {l.direccion}
                    <br />
                    <a className="enlace" href={telHref(l.tel)}>{en ? '+34 ' : ''}{l.tel}</a>
                  </p>
                ))}
              </div>
            )}
            <DespachosIntl lang={lang} />
            <div className="caja">
              <h3>{en ? 'Also for international clients' : 'También para clientes internacionales'}</h3>
              <ul className="lista-simple">
                <li><Link href={en ? EN.international : ES.internacional}>{en ? 'All international services' : 'Todos los servicios internacionales'}</Link></li>
                {otras.map((o) => (
                  <li key={o.slug}>
                    <Link href={en ? EN.intl(o.slugEn) : ES.intl(o.slug)}>{en ? o.tituloEn : o.titulo}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="caja">
              <h3>{en ? 'Related services' : 'Áreas relacionadas'}</h3>
              <ul className="lista-simple">
                {fiscal && <li><Link href={en ? EN.area(fiscal.slugEn) : ES.area(fiscal.slug)}>{en ? 'Tax advice' : 'Asesoría fiscal'}</Link></li>}
                {juridico && <li><Link href={en ? EN.area(juridico.slugEn) : ES.area(juridico.slug)}>{en ? 'Legal advice, wills and inheritance' : 'Asesoría jurídica, testamentos y herencias'}</Link></li>}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
