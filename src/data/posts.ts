/**
 * Blog. En Supabase será la tabla `blog_articles` (molde Neotérmica).
 * ARTÍCULOS DE EJEMPLO para maquetar: no publicar tal cual.
 */
export type Post = {
  slug: string;
  titulo: string;
  categoria: string;
  fecha: string; // ISO
  extracto: string;
  cuerpo: string[];
};

export const POSTS: Post[] = [
  {
    slug: 'deduccion-idi-como-saber-si-su-empresa-puede-aplicarla',
    titulo: 'Cómo saber si su empresa puede aplicar la deducción por I+D+i',
    categoria: 'Fiscal',
    fecha: '2026-09-15',
    extracto: 'Requisitos, informe motivado y errores habituales al cuantificar el gasto.',
    cuerpo: [
      'Artículo de ejemplo para maquetar el blog. El texto definitivo lo redactará el agente del blog y lo validará un abogado de Serveco.',
    ],
  },
  {
    slug: 'convocatorias-ayudas-pymes-region-de-murcia',
    titulo: 'Convocatorias abiertas para pymes en la Región de Murcia',
    categoria: 'Ayudas',
    fecha: '2026-09-08',
    extracto: 'Plazos, requisitos y documentación para presentarse.',
    cuerpo: ['Artículo de ejemplo para maquetar el blog.'],
  },
  {
    slug: 'comprar-vivienda-en-espana-no-residente',
    titulo: 'Comprar vivienda en España siendo no residente',
    categoria: 'Internacional',
    fecha: '2026-09-01',
    extracto: 'NIE, impuestos de la compra y retenciones en la venta.',
    cuerpo: ['Artículo de ejemplo para maquetar el blog.'],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function fechaLarga(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
