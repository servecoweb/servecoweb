import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import EscenaFoto from '@/components/EscenaFoto';
import { ContenidoSeo, EsquemasSeo } from '@/components/ContenidoSeo';
import { PAE_SEO as seo } from '@/data/paginas-seo';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES, idiomas } from '@/lib/rutas';

/** Punto PAE (plantilla PLAN-SEO-PAGINAS.md). Contenido: src/data/paginas-seo.ts. */
export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: ES.pae, languages: idiomas(ES.pae) },
};

export default function PuntoPae() {
  const url = `${SITE_URL}${ES.pae}`;
  return (
    <>
      <EsquemasSeo
        pagina={seo}
        url={url}
        migas={[
          { nombre: 'Inicio', url: `${SITE_URL}${ES.home}` },
          { nombre: 'Punto PAE', url },
        ]}
        proveedor={{ '@type': 'ProfessionalService', name: EMPRESA.razonSocial, url: SITE_URL, telephone: EMPRESA.tel }}
        areaServida={[{ '@type': 'AdministrativeArea', name: 'Región de Murcia' }]}
      />
      <PageHead migas={[{ label: 'Inicio', href: ES.home }, { label: 'Punto PAE' }]} titulo={seo.h1} lead={seo.lead} />
      <section>
        <div className="wrap dos">
          <div className="texto">
            <EscenaFoto id="laboral" />
            <ContenidoSeo pagina={seo} tituloFaqs="Preguntas frecuentes sobre crear una empresa" />
            <p style={{ marginTop: 28 }}>
              <Link className="btn btn-marca" href={ES.contacto}>Cuéntenos su proyecto</Link>
            </p>
          </div>
          <aside>
            <div className="caja">
              <h3>Siguiente paso</h3>
              <p style={{ marginBottom: 14, color: 'var(--tinta-2)' }}>Cuéntenos su proyecto y le decimos qué forma jurídica le conviene.</p>
              <Link className="btn btn-marca" href={ES.contacto}>Hacer una consulta</Link>
            </div>
            <div className="caja">
              <h3>Después de crearla</h3>
              <ul className="lista-simple">
                <li><Link href={ES.area('fiscal')}>Asesoría fiscal</Link></li>
                <li><Link href={ES.area('contable')}>Contabilidad</Link></li>
                <li><Link href={ES.area('laboral')}>Asesoría laboral</Link></li>
                <li><Link href={ES.area('juridico')}>Pactos entre socios y estatutos</Link></li>
                <li><Link href={ES.subvenciones}>Subvenciones para empezar</Link></li>
              </ul>
            </div>
            <div className="caja">
              <h3>¿Es extranjero?</h3>
              <p style={{ marginBottom: 12, color: 'var(--tinta-2)' }}>Para crear una empresa en España necesitará su NIE.</p>
              <Link className="enlace" href={ES.intl('nie')}>Cómo obtener el NIE</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
