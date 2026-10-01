/**
 * Silo internacional (H3.2 de la propuesta): landings NIE / IRNR / Benidorm, ES + EN.
 * TEXTOS DE PARTIDA: a validar por Serveco.
 */
export type PaginaIntl = {
  slug: string;
  slugEn: string;
  titulo: string;
  tituloEn: string;
  lead: string;
  leadEn: string;
  puntos: string[];
  puntosEn: string[];
};

export const INTL: PaginaIntl[] = [
  {
    slug: 'nie',
    slugEn: 'nie-number',
    titulo: 'Obtención del NIE',
    tituloEn: 'Getting your NIE number in Spain',
    lead: 'Le ayudamos a solicitar el NIE para comprar una vivienda, trabajar o abrir un negocio en España.',
    leadEn: 'We help you apply for your NIE to buy property, work or start a business in Spain.',
    puntos: ['Qué documentación necesita', 'Cita y presentación de la solicitud', 'Seguimiento hasta la obtención'],
    puntosEn: ['Which documents you need', 'Booking the appointment and filing', 'Follow-up until you get it'],
  },
  {
    slug: 'impuesto-no-residentes',
    slugEn: 'non-resident-tax',
    titulo: 'Impuesto sobre la renta de no residentes (IRNR)',
    tituloEn: 'Non-resident income tax in Spain (IRNR)',
    lead: 'Presentamos su declaración si tiene una vivienda o ingresos en España y no reside aquí.',
    leadEn: 'We file your return if you own property or earn income in Spain but do not live here.',
    puntos: ['Imputación de rentas por vivienda', 'Alquileres', 'Venta de inmuebles y retenciones'],
    puntosEn: ['Deemed income on your Spanish home', 'Rental income', 'Selling property and withholding tax'],
  },
  {
    slug: 'benidorm',
    slugEn: 'benidorm',
    titulo: 'Asesoría para extranjeros en Benidorm',
    tituloEn: 'Advisers for foreign residents in Benidorm',
    lead: 'Nuestro despacho de Benidorm atiende a residentes extranjeros y no residentes, en español y en inglés.',
    leadEn: 'Our Benidorm office looks after foreign residents and non-residents, in English and Spanish.',
    puntos: ['NIE e IRNR', 'Testamentos y sucesiones', 'Compraventa de inmuebles'],
    puntosEn: ['NIE and non-resident tax', 'Wills and inheritance', 'Buying and selling property'],
  },
];

export function getIntl(slug: string) {
  return INTL.find((p) => p.slug === slug);
}
export function getIntlEn(slugEn: string) {
  return INTL.find((p) => p.slugEn === slugEn);
}
