import { supabaseAdmin } from '@/lib/supabase/servidor';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { INTL } from '@/data/internacional';

/**
 * Ficha del asistente: los datos verificados que recibe en CADA turno.
 * Se lee de Supabase (lo que se edite allí, el asistente lo sabe en ≤ 5 min).
 * Si Supabase falla o está vacío, usa los datos del código (src/data) como reserva.
 */
export type Ficha = {
  areas: { slug: string; slugEn: string; nombre: string; nombreEn: string; resumen: string }[];
  sedes: { slug: string; ciudad: string; central: boolean; locales: { direccion: string; tel: string }[] }[];
  intl: { slug: string; slugEn: string; titulo: string; tituloEn: string }[];
};

export function fichaLocal(): Ficha {
  return {
    areas: AREAS.map((a) => ({ slug: a.slug, slugEn: a.slugEn, nombre: a.nombre, nombreEn: a.nombreEn, resumen: a.resumen })),
    sedes: SEDES.map((s) => ({ slug: s.slug, ciudad: s.ciudad, central: Boolean(s.central), locales: s.locales })),
    intl: INTL.map((p) => ({ slug: p.slug, slugEn: p.slugEn, titulo: p.titulo, tituloEn: p.tituloEn })),
  };
}

type Fila = Record<string, unknown>;

/** Convierte filas de Supabase en ficha (lo usan la web y el script de ingesta). */
export function fichaDesdeFilas(areas: Fila[], sedes: Fila[], locales: Fila[], intl: Fila[]): Ficha {
  return {
    areas: areas.map((a) => ({
      slug: String(a.slug),
      slugEn: String(a.slug_en),
      nombre: String(a.nombre),
      nombreEn: String(a.nombre_en),
      resumen: String(a.resumen),
    })),
    sedes: sedes.map((s) => ({
      slug: String(s.slug),
      ciudad: String(s.ciudad),
      central: Boolean(s.central),
      locales: locales
        .filter((l) => l.office_slug === s.slug)
        .map((l) => ({ direccion: String(l.direccion), tel: String(l.tel) })),
    })),
    intl: intl.map((p) => ({ slug: String(p.slug), slugEn: String(p.slug_en), titulo: String(p.titulo), tituloEn: String(p.titulo_en) })),
  };
}

/** Lee las filas de la ficha con el cliente que se le pase (web o script). */
export async function leerFilasFicha(db: NonNullable<ReturnType<typeof supabaseAdmin>>) {
  const [a, s, l, i] = await Promise.all([
    db.from('service_areas').select('slug, slug_en, nombre, nombre_en, resumen').eq('activo', true).order('orden'),
    db.from('offices').select('slug, ciudad, central').eq('activo', true).order('orden'),
    db.from('office_locations').select('office_slug, direccion, tel, orden').order('orden'),
    db.from('intl_pages').select('slug, slug_en, titulo, titulo_en').eq('published', true).order('orden'),
  ]);
  const error = a.error ?? s.error ?? l.error ?? i.error;
  if (error) throw new Error(error.message);
  return { areas: a.data ?? [], sedes: s.data ?? [], locales: l.data ?? [], intl: i.data ?? [] };
}

let cache: { ficha: Ficha; t: number } | null = null;
const CINCO_MIN = 5 * 60 * 1000;

export async function cargarFicha(): Promise<Ficha> {
  if (cache && Date.now() - cache.t < CINCO_MIN) return cache.ficha;
  const db = supabaseAdmin();
  if (!db) return fichaLocal();
  try {
    const f = await leerFilasFicha(db);
    if (f.areas.length === 0 || f.sedes.length === 0) return fichaLocal();
    const ficha = fichaDesdeFilas(f.areas, f.sedes, f.locales, f.intl);
    cache = { ficha, t: Date.now() };
    return ficha;
  } catch (error) {
    console.error('[ficha] Supabase no disponible, uso los datos del código:', error);
    return fichaLocal();
  }
}
