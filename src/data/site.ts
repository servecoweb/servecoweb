/**
 * Datos generales de la firma.
 * Fuente: web actual serveco.es (notas 2 sep 2026) + PDF aceptado.
 */
export const SITE_URL = 'https://www.serveco.es';

/** Aviso «pendiente de validar». Solo en local: en producción Google lo indexaría. */
export const AVISO_INTERNO = process.env.NODE_ENV !== 'production';

export const EMPRESA = {
  razonSocial: 'Serveco Asesores S.L.P.',
  marca: 'SERVECO',
  fundacion: 1977,
  profesionales: '30+',
  tel: '968 90 90 20',
  email: 'serveco@serveco.es',
  buscadorSubvenciones: 'https://serveco.fandit.es',
} as const;

/** Perfiles que pasó el cliente (14 oct 2026). El orden es el de la franja y el pie. */
export const REDES = [
  { id: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com/servecoasesores/' },
  { id: 'linkedin', nombre: 'LinkedIn', url: 'https://www.linkedin.com/company/serveco-asesores-s-l-p' },
  { id: 'facebook', nombre: 'Facebook', url: 'https://www.facebook.com/SERVECOAsesores' },
] as const;

/** "968 90 90 20" → "tel:+34968909020" */
export function telHref(tel: string): string {
  return 'tel:+34' + tel.replace(/\s/g, '');
}
