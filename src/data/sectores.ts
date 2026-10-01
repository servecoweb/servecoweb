/**
 * Sectores del carrusel «Conocemos su sector» de la home.
 * Los `id` coinciden con SECTORES de src/lib/crm.ts (desplegable del formulario): mismo vocabulario en web y panel.
 * Son TEXTO, no enlaces: no hay páginas por sector (cero huérfanos; páginas por sector = fuera del PDF).
 * Frases: redacción de Eskala, generales y sin cifras. PENDIENTE de validar con Serveco (qué sectores y qué decir).
 * «Empresa familiar» y «Autónomos» no están: son perfiles, no sectores (van en el menú «Para quién»).
 */
export type Sector = { id: string; nombre: string; nombreEn: string; frase: string; fraseEn: string; escena: string };

export const SECTORES_HOME: Sector[] = [
  {
    id: 'agroalimentario',
    nombre: 'Agroalimentario',
    nombreEn: 'Agri-food',
    frase: 'Campañas con picos de contratación, fiscalidad agraria y ayudas para modernizar la explotación.',
    fraseEn: 'Seasonal hiring peaks, farm taxation and grants to modernise.',
    escena: 'agro',
  },
  {
    id: 'vitivinicola',
    nombre: 'Vitivinícola',
    nombreEn: 'Wine',
    frase: 'Vendimia y contratación de temporada, exportación y ayudas del sector.',
    fraseEn: 'Harvest and seasonal staff, exports and sector grants.',
    escena: 'bodega',
  },
  {
    id: 'mueble',
    nombre: 'Industria del mueble',
    nombreEn: 'Furniture industry',
    frase: 'Empresa familiar industrial: costes de producción, relevo generacional e innovación en producto.',
    fraseEn: 'Family-owned manufacturing: production costs, succession and product innovation.',
    escena: 'taller',
  },
  {
    id: 'transporte',
    nombre: 'Transporte y logística',
    nombreEn: 'Transport and logistics',
    frase: 'Jornadas y descansos de conductores, operaciones internacionales y financiación de la flota.',
    fraseEn: 'Drivers’ working time, international operations and fleet financing.',
    escena: 'transporte',
  },
  {
    id: 'construccion',
    nombre: 'Construcción e inmobiliario',
    nombreEn: 'Construction and real estate',
    frase: 'Subcontratación, particularidades del IVA en obra y promociones inmobiliarias.',
    fraseEn: 'Subcontracting, VAT specifics in construction and property developments.',
    escena: 'construccion',
  },
  {
    id: 'comercio',
    nombre: 'Comercio y distribución',
    nombreEn: 'Retail and distribution',
    frase: 'Márgenes y existencias, plantillas con turnos y el relevo del negocio familiar.',
    fraseEn: 'Margins and stock, shift-based staff and handing over the family business.',
    escena: 'comercio',
  },
  {
    id: 'hosteleria',
    nombre: 'Hostelería y turismo',
    nombreEn: 'Hospitality and tourism',
    frase: 'Temporada alta, contratos fijos discontinuos, trabajadores extranjeros y clientes internacionales.',
    fraseEn: 'High season, seasonal permanent contracts, foreign staff and international guests.',
    escena: 'costa',
  },
  {
    id: 'servicios',
    nombre: 'Servicios profesionales',
    nombreEn: 'Professional services',
    frase: 'Autónomos y sociedades profesionales: cuándo dar el salto a sociedad y cómo organizar la facturación.',
    fraseEn: 'Freelancers and professional firms: when to incorporate and how to organise invoicing.',
    escena: 'servicios',
  },
];
