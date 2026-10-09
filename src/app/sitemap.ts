import type { MetadataRoute } from 'next';
import { AREAS } from '@/data/areas';
import { INTL } from '@/data/internacional';
import { SITE_URL } from '@/data/site';
import { mapaES, mapaEN } from '@/lib/mapa-web';
import { ES, EN } from '@/lib/rutas';

/**
 * sitemap.xml bilingüe (H1.5 + H3.1). Sale de la MISMA lista que el mapa web visible
 * (src/lib/mapa-web.ts): lo que existe está en los dos. Las legales no entran (noindex).
 * Cada URL lleva hreflang (xhtml:link). x-default = español. Incluye los artículos
 * publicados en Supabase; se regenera cada hora.
 */
export const revalidate = 3600;

function abs(ruta: string) {
  return `${SITE_URL}${ruta}`;
}

function hreflang(es: string, en?: string) {
  const languages: Record<string, string> = { es: abs(es), 'x-default': abs(es) };
  if (en) languages.en = abs(en);
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pares: Array<[string, string]> = [
    [ES.home, EN.home],
    [ES.servicios, EN.services],
    [ES.firma, EN.about],
    [ES.equipo, EN.team],
    [ES.despachos, EN.offices],
    [ES.contacto, EN.contact],
    [ES.internacional, EN.international],
    [ES.mapaWeb, EN.sitemap],
    ...AREAS.map((a) => [ES.area(a.slug), EN.area(a.slugEn)] as [string, string]),
    ...INTL.map((p) => [ES.intl(p.slug), EN.intl(p.slugEn)] as [string, string]),
  ];
  const porRuta = new Map<string, Record<string, string>>();
  for (const [es, en] of pares) {
    const languages = hreflang(es, en);
    porRuta.set(es, languages);
    porRuta.set(en, languages);
  }

  const rutas = [...new Set([...(await mapaES()), ...mapaEN()].filter((g) => g.indexar).flatMap((g) => g.enlaces.map((e) => e.href)))];
  return rutas.map((ruta) => ({
    url: abs(ruta),
    alternates: { languages: porRuta.get(ruta) ?? hreflang(ruta) },
  }));
}
