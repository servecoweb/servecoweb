/**
 * Todas las URLs de la web en un solo sitio.
 * Estructura según la propuesta técnica aceptada (eskaladigital.com/pruebas/serveco-presupuesto):
 *   H1.2  /la-firma · /la-firma/equipo · hub /servicios + 8 áreas · /la-firma/despachos/[sede]
 *   H2.1  /servicios/[area]/[localidad]
 *   H4.2  /blog · /blog/[slug]
 *   H1.4  /aviso-legal · /privacidad · /cookies
 *   H3    /en/… núcleo (~20 páginas) + silo internacional
 * Cambiar una URL = cambiarla aquí.
 */
export const ES = {
  home: '/es',
  servicios: '/es/servicios',
  area: (area: string) => `/es/servicios/${area}`,
  landing: (area: string, sede: string) => `/es/servicios/${area}/${sede}`,
  firma: '/es/la-firma',
  equipo: '/es/la-firma/equipo',
  despachos: '/es/la-firma/despachos',
  sede: (sede: string) => `/es/la-firma/despachos/${sede}`,
  blog: '/es/blog',
  post: (slug: string) => `/es/blog/${slug}`,
  contacto: '/es/contacto',
  subvenciones: '/es/subvenciones',
  internacional: '/es/internacional',
  intl: (slug: string) => `/es/internacional/${slug}`,
  pae: '/es/punto-pae',
  mapaWeb: '/es/sitemap',
  avisoLegal: '/es/aviso-legal',
  privacidad: '/es/privacidad',
  cookies: '/es/cookies',
} as const;

export const EN = {
  home: '/en',
  services: '/en/services',
  area: (areaEn: string) => `/en/services/${areaEn}`,
  about: '/en/about',
  team: '/en/about/team',
  offices: '/en/about/offices',
  international: '/en/international',
  intl: (slugEn: string) => `/en/international/${slugEn}`,
  blog: '/en/blog',
  post: (slug: string) => `/en/blog/${slug}`,
  contact: '/en/contact',
  sitemap: '/en/sitemap',
  legalNotice: '/en/legal-notice',
  privacy: '/en/privacy',
  cookies: '/en/cookies',
} as const;
