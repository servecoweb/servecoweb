/**
 * Equipo. En Supabase será la tabla `team_members`.
 * DATOS DE EJEMPLO: faltan nombres, cargos y fotos reales (pedir a Rafael).
 */
export type Persona = {
  nombre: string;
  cargo: string;
  areaSlug?: string;
  sedeSlug?: string;
  foto?: string;
  bio?: string;
};

export const EQUIPO: Persona[] = [
  { nombre: 'Nombre y apellidos', cargo: 'Responsable del área fiscal', areaSlug: 'fiscal', sedeSlug: 'murcia' },
  { nombre: 'Nombre y apellidos', cargo: 'Responsable del área laboral', areaSlug: 'laboral', sedeSlug: 'murcia' },
  { nombre: 'Nombre y apellidos', cargo: 'Responsable del área jurídica', areaSlug: 'juridico', sedeSlug: 'murcia' },
  { nombre: 'Nombre y apellidos', cargo: 'Despacho de Benidorm', sedeSlug: 'benidorm' },
];
