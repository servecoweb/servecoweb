import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';
import { mapaES, mapaEN } from '@/lib/mapa-web';
import { ES, EN } from '@/lib/rutas';

/**
 * sitemap.xml bilingüe (H1.5 + H3.1). Sale de la MISMA lista que el mapa web visible
 * (src/lib/mapa-web.ts): lo que existe está en los dos. Las legales no entran (noindex).
 * Incluye los artículos publicados en Supabase; se regenera cada hora.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutas = [...(await mapaES()), ...mapaEN()]
    .filter((g) => g.indexar)
    .flatMap((g) => g.enlaces.map((e) => e.href));
  return [...new Set([...rutas, ES.mapaWeb, EN.sitemap])].map((ruta) => ({ url: `${SITE_URL}${ruta}` }));
}
