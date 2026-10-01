import { EMPRESA, SITE_URL } from '@/data/site';
import { SEDES } from '@/data/offices';
import { ES, EN } from '@/lib/rutas';

/**
 * Datos estructurados de la ORGANIZACIÓN y del SITIO WEB (toda la web, desde el layout raíz).
 * Cada despacho va como `department` con su dirección (las fichas llevan además su AccountingService).
 * PENDIENTE de Serveco: razón social completa (legalName), CIF (taxID), logo SVG y perfiles sociales (sameAs).
 * No se inventan: cuando lleguen, se añaden aquí.
 */
export default function DatosOrganizacion() {
  const central = SEDES.find((s) => s.central) ?? SEDES[0];
  const region = (zona: string) => (zona === 'Costa de Alicante' ? 'Alicante' : 'Región de Murcia');

  const organizacion = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organizacion`,
    name: EMPRESA.razonSocial,
    url: SITE_URL,
    foundingDate: String(EMPRESA.fundacion),
    telephone: `+34 ${EMPRESA.tel}`,
    email: EMPRESA.email,
    description:
      'Asesoría integral de empresas desde 1977: fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación. Servicios para extranjeros y no residentes.',
    knowsLanguage: ['es', 'en'],
    address: central?.locales[0]
      ? {
          '@type': 'PostalAddress',
          streetAddress: central.locales[0].direccion,
          addressLocality: central.ciudad,
          addressRegion: region(central.zona),
          addressCountry: 'ES',
        }
      : undefined,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Región de Murcia' },
      { '@type': 'AdministrativeArea', name: 'Provincia de Alicante' },
      { '@type': 'Country', name: 'España' },
    ],
    department: SEDES.flatMap((s) =>
      s.locales.map((l) => ({
        '@type': 'AccountingService',
        name: `${EMPRESA.razonSocial} · ${s.ciudad}`,
        url: `${SITE_URL}${ES.sede(s.slug)}`,
        telephone: `+34 ${l.tel}`,
        address: { '@type': 'PostalAddress', streetAddress: l.direccion, addressLocality: s.ciudad, addressRegion: region(s.zona), addressCountry: 'ES' },
      })),
    ),
  };

  const sitio = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#web`,
    name: EMPRESA.razonSocial,
    url: SITE_URL,
    inLanguage: ['es-ES', 'en-GB'],
    publisher: { '@id': `${SITE_URL}/#organizacion` },
    hasPart: [
      { '@type': 'WebPage', name: 'Inicio', url: `${SITE_URL}${ES.home}`, inLanguage: 'es-ES' },
      { '@type': 'WebPage', name: 'Home', url: `${SITE_URL}${EN.home}`, inLanguage: 'en-GB' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacion) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sitio) }} />
    </>
  );
}
