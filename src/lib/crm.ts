/**
 * Mini-CRM de consultas (partida 06). Definiciones COMPARTIDAS por el formulario (navegador),
 * el guardado (servidor) y el panel /administrator/contactos. Sin imports de servidor.
 * Doc: docs/CRM-CONTACTOS.md.
 */
type Opcion = { valor: string; es: string; en: string };

export const TIPOS: Opcion[] = [
  { valor: 'particular', es: 'Particular', en: 'Private individual' },
  { valor: 'autonomo', es: 'Autónomo', en: 'Self-employed' },
  { valor: 'empresa', es: 'Empresa', en: 'Company' },
];

export const TAMANOS: Opcion[] = [
  { valor: '1-9', es: '1 a 9 trabajadores', en: '1 to 9 employees' },
  { valor: '10-49', es: '10 a 49 trabajadores', en: '10 to 49 employees' },
  { valor: '50-249', es: '50 a 249 trabajadores', en: '50 to 249 employees' },
  { valor: '250+', es: '250 o más', en: '250 or more' },
];

/** Mismos `id` que el carrusel de la home (src/data/sectores.ts) + «Otro». Pendiente de validar con Serveco. */
export const SECTORES: Opcion[] = [
  { valor: 'agroalimentario', es: 'Agroalimentario', en: 'Agri-food' },
  { valor: 'vitivinicola', es: 'Vitivinícola', en: 'Wine' },
  { valor: 'mueble', es: 'Industria del mueble', en: 'Furniture industry' },
  { valor: 'transporte', es: 'Transporte y logística', en: 'Transport and logistics' },
  { valor: 'construccion', es: 'Construcción e inmobiliario', en: 'Construction and real estate' },
  { valor: 'comercio', es: 'Comercio y distribución', en: 'Retail and distribution' },
  { valor: 'hosteleria', es: 'Hostelería y turismo', en: 'Hospitality and tourism' },
  { valor: 'servicios', es: 'Servicios profesionales', en: 'Professional services' },
  { valor: 'otro', es: 'Otro', en: 'Other' },
];

export const ASESORIA: Opcion[] = [
  { valor: 'no', es: 'No, es la primera vez', en: 'No, this is the first time' },
  { valor: 'cambiar', es: 'Sí, pero quiero cambiar', en: 'Yes, but I want to change' },
  { valor: 'puntual', es: 'Sí, es una consulta puntual', en: 'Yes, this is a one-off question' },
];

export const URGENCIAS: Opcion[] = [
  { valor: 'plazo', es: 'Tengo un plazo o un requerimiento', en: 'I have a deadline or an official notice' },
  { valor: 'mes', es: 'En las próximas semanas', en: 'In the next few weeks' },
  { valor: 'sin_prisa', es: 'Sin prisa', en: 'No rush' },
];

export const CONOCIO: Opcion[] = [
  { valor: 'google', es: 'Buscando en Google', en: 'Google search' },
  { valor: 'recomendacion', es: 'Me lo recomendaron', en: 'Recommendation' },
  { valor: 'cliente', es: 'Ya soy cliente', en: 'I am already a client' },
  { valor: 'redes', es: 'Redes sociales', en: 'Social media' },
  { valor: 'otro', es: 'Otro', en: 'Other' },
];

export const ESTADOS = [
  { valor: 'nuevo', texto: 'Nuevo', clase: 'bg-blue-100 text-blue-800' },
  { valor: 'contactado', texto: 'Contactado', clase: 'bg-amber-100 text-amber-800' },
  { valor: 'cita', texto: 'Cita', clase: 'bg-purple-100 text-purple-800' },
  { valor: 'cliente', texto: 'Cliente', clase: 'bg-green-100 text-green-800' },
  { valor: 'descartado', texto: 'Descartado', clase: 'bg-gray-100 text-gray-600' },
] as const;

export const PRIORIDADES = [
  { valor: 'alta', texto: 'Alta', clase: 'bg-red-100 text-red-800' },
  { valor: 'media', texto: 'Media', clase: 'bg-amber-50 text-amber-800' },
  { valor: 'baja', texto: 'Baja', clase: 'bg-gray-100 text-gray-600' },
] as const;

export type Prioridad = (typeof PRIORIDADES)[number]['valor'];

/** Texto legible de una opción guardada (para el panel y los correos). */
export function etiqueta(lista: Opcion[], valor: string | null | undefined, lang: 'es' | 'en' = 'es'): string {
  if (!valor) return '—';
  const o = lista.find((x) => x.valor === valor);
  return o ? o[lang] : valor;
}

/**
 * Prioridad automática. Criterio (Narciso, 24 sep): que la consulta con más valor o más prisa
 * se atienda antes. Ajustable aquí; el panel permite cambiarla a mano.
 *  · ALTA: tiene un plazo o requerimiento · o empresa que quiere cambiar de asesoría · o empresa de 50+.
 *  · BAJA: particular con consulta puntual y sin prisa.
 *  · MEDIA: el resto.
 */
export function calcularPrioridad(c: {
  tipo?: string | null;
  tamano?: string | null;
  tiene_asesoria?: string | null;
  urgencia?: string | null;
}): Prioridad {
  if (c.urgencia === 'plazo') return 'alta';
  const esNegocio = c.tipo === 'empresa' || c.tipo === 'autonomo';
  if (esNegocio && c.tiene_asesoria === 'cambiar') return 'alta';
  if (c.tipo === 'empresa' && (c.tamano === '50-249' || c.tamano === '250+')) return 'alta';
  if (c.tipo === 'particular' && c.tiene_asesoria === 'puntual' && c.urgencia !== 'mes') return 'baja';
  return 'media';
}

/** Valida que un valor esté en la lista (lo que llega del navegador no es de fiar). */
export function valido(lista: Opcion[], v: string): string | null {
  return lista.some((o) => o.valor === v) ? v : null;
}
