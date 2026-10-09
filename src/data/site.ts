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

/** "968 90 90 20" → "tel:+34968909020" */
export function telHref(tel: string): string {
  return 'tel:+34' + tel.replace(/\s/g, '');
}
