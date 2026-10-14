import { DEPARTAMENTOS, EQUIPO, type Departamento, type Persona } from '@/data/team';
import { supabaseAdmin, supabasePublico } from '@/lib/supabase/servidor';

/**
 * Equipo de la web. La ficha viva está en Supabase (`team_members`).
 * `src/data/team.ts` es la reserva si la base falla o sigue con los ejemplos.
 *
 * La tabla no tiene columnas de departamento ni de «sale en la portada»:
 * el departamento es `area_slug` (administración = sin área) y la portada es un orden negativo.
 */

export { DEPARTAMENTOS };
export type { Departamento, Persona };

const AREAS_DEPTO = ['fiscal', 'financiero', 'juridico', 'laboral'] as const;

export type Miembro = {
  id: string;
  nombre: string;
  cargo: string;
  cargoEn: string;
  departamento: Departamento;
  sedeSlug: string;
  foto: string;
  destacado: boolean;
  publicado: boolean;
  orden: number;
};

type Fila = {
  id: string;
  nombre: string;
  cargo: string | null;
  cargo_en: string | null;
  area_slug: string | null;
  office_slug: string | null;
  foto_url: string | null;
  orden: number | null;
  published: boolean | null;
};

export function departamentoDe(area: string | null | undefined): Departamento {
  if (area && (AREAS_DEPTO as readonly string[]).includes(area)) return area as Departamento;
  return 'administracion';
}

export function aPersona(f: Fila): Persona {
  const departamento = departamentoDe(f.area_slug);
  return {
    nombre: f.nombre,
    cargo: f.cargo ?? '',
    cargoEn: f.cargo_en ?? '',
    departamento,
    areaSlug: departamento === 'administracion' ? undefined : departamento,
    sedeSlug: f.office_slug ?? undefined,
    foto: f.foto_url ?? undefined,
    destacado: (f.orden ?? 0) < 0,
  };
}

export function aMiembro(f: Fila): Miembro {
  const p = aPersona(f);
  return {
    id: f.id,
    nombre: p.nombre,
    cargo: p.cargo,
    cargoEn: p.cargoEn,
    departamento: p.departamento,
    sedeSlug: p.sedeSlug ?? '',
    foto: p.foto ?? '',
    destacado: p.destacado ?? false,
    publicado: f.published !== false,
    orden: Math.abs(f.orden ?? 0) || 1,
  };
}

/** Lo que se escribe en la tabla a partir del formulario. */
export function filaDesdeFormulario(c: {
  nombre: string;
  cargo: string;
  cargoEn: string;
  departamento: string;
  sedeSlug: string;
  foto: string;
  destacado: boolean;
  publicado: boolean;
  orden: number;
}) {
  const departamento = DEPARTAMENTOS.some((d) => d.id === c.departamento) ? c.departamento : 'administracion';
  const n = Math.abs(c.orden) || 1;
  return {
    nombre: c.nombre,
    cargo: c.cargo,
    cargo_en: c.cargoEn,
    area_slug: departamento === 'administracion' ? null : departamento,
    office_slug: c.sedeSlug || null,
    foto_url: c.foto || null,
    published: c.publicado,
    orden: c.destacado ? -n : n,
  };
}

function esEjemplo(filas: { nombre: string }[]) {
  return filas.length === 0 || filas.every((f) => f.nombre === 'Nombre y apellidos');
}

const CAMPOS = 'id, nombre, cargo, cargo_en, area_slug, office_slug, foto_url, orden, published';

/** Personas publicadas. Si la base no responde o solo tiene los ejemplos, el equipo del código. */
export async function leerEquipo(): Promise<Persona[]> {
  const db = supabasePublico();
  if (!db) return EQUIPO;
  const { data, error } = await db.from('team_members').select(CAMPOS).eq('published', true);
  if (error || !data || esEjemplo(data)) return EQUIPO;
  return [...data]
    .sort((a, b) => Math.abs(a.orden ?? 0) - Math.abs(b.orden ?? 0))
    .map((f) => aPersona(f as Fila));
}

export async function leerMiembros(): Promise<Miembro[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  const { data, error } = await db.from('team_members').select(CAMPOS);
  if (error || !data) return [];
  return [...(data as Fila[])]
    .sort((a, b) => Math.abs(a.orden ?? 0) - Math.abs(b.orden ?? 0))
    .map(aMiembro);
}

export async function leerMiembro(id: string): Promise<Miembro | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data } = await db.from('team_members').select(CAMPOS).eq('id', id).maybeSingle();
  return data ? aMiembro(data as Fila) : null;
}

/**
 * Sustituye las cuatro fichas de ejemplo por el equipo de src/data/team.ts.
 * No hace nada si ya hay personas reales (no pisa lo editado en el panel).
 */
export async function sembrarEquipo(): Promise<string> {
  const db = supabaseAdmin();
  if (!db) return 'sin supabase';
  const { data, error } = await db.from('team_members').select('id, nombre');
  if (error) return error.message;
  if (!esEjemplo(data ?? [])) return `ya hay ${data?.length ?? 0} personas; no se siembra`;
  if (data && data.length > 0) {
    const del = await db.from('team_members').delete().in('id', data.map((r) => r.id));
    if (del.error) return del.error.message;
  }
  const filas = EQUIPO.map((p, i) => ({
    nombre: p.nombre,
    cargo: p.cargo,
    cargo_en: p.cargoEn,
    area_slug: p.departamento === 'administracion' ? null : p.departamento,
    office_slug: p.sedeSlug ?? null,
    foto_url: p.foto ?? null,
    published: true,
    orden: p.destacado ? -(i + 1) : i + 1,
  }));
  const ins = await db.from('team_members').insert(filas);
  if (ins.error) return ins.error.message;
  return `sembradas ${filas.length}`;
}
