/**
 * LANDINGS SEO área × sede (partida 02 del PDF: 12 landings de 800-1.200 palabras, texto propio).
 * En Supabase será la tabla `seo_landings`: una fila = una URL (/es/servicios/[area]/[sede]).
 * Plantilla: PLAN-SEO-PAGINAS.md (H1 «[Área] en [ciudad]», H2 descriptivos, FAQs distintas de los H2).
 *
 * REPARTO PROPUESTO a Rafael (decisión 22; sin Murcia capital, que cubren las áreas):
 *   Fiscal ×5 y Laboral ×5 (Yecla, Jumilla, Lorca, Balsicas, Benidorm) · Jurídico ×2 (Yecla, Lorca).
 * Contenido en un archivo por área: landings-fiscal.ts, landings-laboral.ts, landings-juridico.ts.
 * `pendienteReparto: true` hasta que Rafael confirme. Si cambia una sede, se ajusta esa landing.
 * Regla: texto PROPIO por sede. Nada de copiar y cambiar el pueblo. Eskala, 25 sep 2026 · validado: false.
 */
import type { Landing } from './landings-tipos';
import { LANDINGS_FISCAL } from './landings-fiscal';
import { LANDINGS_LABORAL } from './landings-laboral';
import { LANDINGS_JURIDICO } from './landings-juridico';

export type { Landing } from './landings-tipos';

export const LANDINGS: Landing[] = [...LANDINGS_FISCAL, ...LANDINGS_LABORAL, ...LANDINGS_JURIDICO];

export function getLanding(area: string, sede: string): Landing | undefined {
  return LANDINGS.find((l) => l.area === area && l.sede === sede);
}
