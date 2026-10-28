/**
 * Opciones de empleo y prácticas. Sin acceso a la base: el formulario del navegador importa este archivo.
 * El guardado está en candidatura.ts. La tabla no se mezcla con las consultas de clientes.
 */

export const TIPOS_CANDIDATURA = [
  { valor: 'empleo', es: 'Empleo', en: 'A job' },
  { valor: 'practicas', es: 'Prácticas', en: 'An internship' },
] as const;

export const AREAS_CANDIDATURA = ['Fiscal', 'Laboral', 'Contable', 'Jurídica', 'Administración', 'Otra'] as const;

export const ESTADOS_CANDIDATO = [
  { valor: 'nuevo', texto: 'Nuevo', clase: 'bg-blue-100 text-blue-800', punto: 'bg-blue-500' },
  { valor: 'contactado', texto: 'Contactado', clase: 'bg-amber-100 text-amber-800', punto: 'bg-amber-500' },
  { valor: 'entrevista', texto: 'Entrevista', clase: 'bg-purple-100 text-purple-800', punto: 'bg-purple-500' },
  { valor: 'descartado', texto: 'Descartado', clase: 'bg-gray-100 text-gray-600', punto: 'bg-gray-400' },
] as const;

export type TipoCandidatura = (typeof TIPOS_CANDIDATURA)[number]['valor'];
export type EstadoCandidato = (typeof ESTADOS_CANDIDATO)[number]['valor'];

export function tipoCandidatura(valor: string | null | undefined): TipoCandidatura {
  return TIPOS_CANDIDATURA.some((t) => t.valor === valor) ? (valor as TipoCandidatura) : 'empleo';
}

export function areaCandidatura(valor: string | null | undefined): string | null {
  const t = (valor ?? '').trim();
  return (AREAS_CANDIDATURA as readonly string[]).includes(t) ? t : null;
}
