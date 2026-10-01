/** Tipo de las landings área × sede. Ver src/data/landings.ts. */
import type { PaginaSeo } from '@/components/ContenidoSeo';

export type Landing = PaginaSeo & {
  area: string; // slug de AREAS
  sede: string; // slug de SEDES
  cta: string;
  /** true hasta que Rafael confirme el reparto de las 12 (decisión 22). */
  pendienteReparto: boolean;
};
