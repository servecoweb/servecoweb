import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import EscenaFoto from '@/components/EscenaFoto';
import BuscadorExterno from '@/components/BuscadorExterno';
import { ContenidoSeo, EsquemasSeo } from '@/components/ContenidoSeo';
import { SUBVENCIONES_SEO as seo } from '@/data/paginas-seo';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES } from '@/lib/rutas';

/**
 * Subvenciones (plantilla PLAN-SEO-PAGINAS.md). Contenido: src/data/paginas-seo.ts.
 * El buscador de Fandit (H1.2) se carga SOLO si el visitante lo pide (BuscadorExterno): cookies de terceros.
 */
export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: ES.subvenciones },
};

export default function Subvenciones() {
  const url = `${SITE_URL}${ES.subvenciones}`;
  return (
    <>
      <EsquemasSeo
        pagina={seo}
        url={url}
        migas={[
          { nombre: 'Inicio', url: `${SITE_URL}${ES.home}` },
          { nombre: 'Servicios', url: `${SITE_URL}${ES.servicios}` },
          { nombre: 'Subvenciones', url },
        ]}
        proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
        areaServida={[{ '@type': 'AdministrativeArea', name: 'Región de Murcia' }]}
      />
      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'Servicios', href: ES.servicios }, { label: 'Subvenciones' }]}
        titulo={seo.h1}
        lead={seo.lead}
      />
      <section>
        <div className="wrap">
          <BuscadorExterno url={EMPRESA.buscadorSubvenciones} titulo="Buscador de subvenciones de Serveco" />
        </div>
      </section>
      <section style={{ paddingTop: 0 }}>
        <div className="wrap dos">
          <div className="texto">
            <EscenaFoto id="financiero" />
            <ContenidoSeo pagina={seo} tituloFaqs="Preguntas frecuentes sobre subvenciones" />
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn-marca" href={ES.contacto}>Consultar una ayuda</Link>
            </p>
          </div>
          <aside>
            <div className="caja">
              <h3>¿Va a invertir?</h3>
              <p style={{ marginBottom: 14, color: 'var(--tinta-2)' }}>Consúltenos antes de empezar: muchas ayudas no se pueden pedir si la inversión ya ha comenzado.</p>
              <Link className="btn btn-marca" href={ES.contacto}>Hacer una consulta</Link>
            </div>
            <div className="caja">
              <h3>Relacionado</h3>
              <ul className="lista-simple">
                <li><Link href={ES.area('financiero')}>Área financiera</Link></li>
                <li><Link href={ES.area('idi-patent-box')}>I+D+i y Patent Box</Link></li>
                <li><Link href={ES.area('formacion')}>Formación bonificada</Link></li>
                <li><Link href={ES.pae}>Crear una empresa (Punto PAE)</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
