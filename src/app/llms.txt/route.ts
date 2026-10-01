import { AREAS } from '@/data/areas';
import { AREAS_SEO } from '@/data/areas-seo';
import { AREAS_SEO_EN } from '@/data/areas-seo-en';
import { INTL } from '@/data/internacional';
import { INTL_SEO } from '@/data/intl-seo';
import { SEDES } from '@/data/offices';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/**
 * /llms.txt — resumen de la web para asistentes de IA (formato llmstxt.org), generado desde los mismos
 * datos que las páginas: nunca se desactualiza. Sin datos pendientes de Serveco (CIF, equipo…).
 */
export const dynamic = 'force-static';

export function GET() {
  const u = (ruta: string) => `${SITE_URL}${ruta}`;
  const desc = (t?: string) => (t ? `: ${t}` : '');

  const texto = `# ${EMPRESA.razonSocial}

> Asesoría integral de empresas fundada en ${EMPRESA.fundacion}, con seis despachos en la Región de Murcia y la Costa Blanca (${SEDES.map((s) => s.ciudad).join(', ')}). Fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación, coordinados sobre el mismo expediente. Servicios para extranjeros y no residentes en todos los despachos, en español y en inglés; el de Benidorm está especializado en clientes internacionales.

Datos de contacto: teléfono ${EMPRESA.tel} · ${EMPRESA.email} · formulario en ${u(ES.contacto)} (inglés: ${u(EN.contact)}).
Los contenidos de esta web son informativos y generales: no sustituyen el estudio de cada caso por un profesional.

## Áreas (español)

${AREAS.map((a) => `- [${AREAS_SEO[a.slug]?.h1 ?? a.nombre}](${u(ES.area(a.slug))})${desc(AREAS_SEO[a.slug]?.metaDescription ?? a.resumen)}`).join('\n')}

## Services (English)

${AREAS.map((a) => `- [${AREAS_SEO_EN[a.slug]?.h1 ?? a.nombreEn}](${u(EN.area(a.slugEn))})${desc(AREAS_SEO_EN[a.slug]?.metaDescription ?? a.resumenEn)}`).join('\n')}

## Extranjeros y no residentes / Non-residents and expats

- [${INTL_SEO.portada.es.h1}](${u(ES.internacional)})${desc(INTL_SEO.portada.es.metaDescription)}
- [${INTL_SEO.portada.en.h1}](${u(EN.international)})${desc(INTL_SEO.portada.en.metaDescription)}
${INTL.map((p) => {
  const s = INTL_SEO[p.slug as keyof typeof INTL_SEO];
  return `- [${s?.es.h1 ?? p.titulo}](${u(ES.intl(p.slug))}) · [${s?.en.h1 ?? p.tituloEn}](${u(EN.intl(p.slugEn))})`;
}).join('\n')}

## Despachos / Offices

${SEDES.map((s) => `- [${s.ciudad}](${u(ES.sede(s.slug))}): ${s.locales.map((l) => `${l.direccion}, tel. ${l.tel}`).join(' · ')}`).join('\n')}
- All offices in English: ${u(EN.offices)}

## Otras páginas

- [Servicios](${u(ES.servicios)}) · [Services](${u(EN.services)})
- [Crear una empresa (Punto PAE)](${u(ES.pae)})
- [Subvenciones y ayudas](${u(ES.subvenciones)})
- [La firma](${u(ES.firma)}) · [About us](${u(EN.about)})
- [Blog](${u(ES.blog)})
`;

  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
