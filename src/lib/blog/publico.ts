import { supabasePublico } from '@/lib/supabase/servidor';
import { POSTS } from '@/data/posts';

/**
 * Lectura PÚBLICA del blog (clave publicable → RLS: solo publicado y con fecha ya pasada).
 * Si Supabase falla, usa los 3 artículos de ejemplo de src/data/posts.ts como reserva.
 */
export type ArticuloPublico = {
  slug: string;
  titulo: string;
  seoTitle: string | null;
  categoria: string;
  fecha: string; // ISO
  extracto: string;
  meta: string;
  html: string;
  portada: string | null;
  portadaAlt: string;
  faqs: { q: string; a: string }[];
  fuentes: { titulo: string; url: string }[];
  actualizadoA: string | null;
  revisadoPor: string | null;
};

const CAMPOS =
  'slug, title, seo_title, category, published_at, excerpt, meta_description, body, cover_url, cover_alt, faqs, fuentes, actualizado_a, revisado_por';

type Fila = Record<string, unknown>;

function mapear(f: Fila): ArticuloPublico {
  const revisado = (f.revisado_por as string | null) ?? null;
  return {
    slug: String(f.slug),
    titulo: String(f.title),
    seoTitle: (f.seo_title as string | null) ?? null,
    categoria: String(f.category ?? ''),
    fecha: String(f.published_at ?? new Date().toISOString()),
    extracto: String(f.excerpt ?? ''),
    meta: String(f.meta_description || f.excerpt || ''),
    html: String(f.body ?? ''),
    portada: (f.cover_url as string | null) ?? null,
    portadaAlt: String(f.cover_alt ?? ''),
    faqs: (f.faqs as ArticuloPublico['faqs']) ?? [],
    fuentes: (f.fuentes as ArticuloPublico['fuentes']) ?? [],
    actualizadoA: (f.actualizado_a as string | null) ?? null,
    // Los de ejemplo llevan «EJEMPLO — sin revisar»: no se muestra como firma.
    revisadoPor: revisado && !revisado.startsWith('EJEMPLO') ? revisado : null,
  };
}

function reserva(): ArticuloPublico[] {
  return POSTS.map((p) => ({
    slug: p.slug,
    titulo: p.titulo,
    seoTitle: null,
    categoria: p.categoria,
    fecha: `${p.fecha}T09:00:00Z`,
    extracto: p.extracto,
    meta: p.extracto,
    html: p.cuerpo.map((x) => `<p>${x}</p>`).join(''),
    portada: null,
    portadaAlt: '',
    faqs: [],
    fuentes: [],
    actualizadoA: null,
    revisadoPor: null,
  }));
}

export async function articulosPublicados(limite?: number): Promise<ArticuloPublico[]> {
  const db = supabasePublico();
  if (!db) return reserva().slice(0, limite);
  let q = db
    .from('blog_articles')
    .select(CAMPOS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  if (limite) q = q.limit(limite);
  const { data, error } = await q;
  if (error) {
    console.error('[blog] lectura pública:', error.message);
    return reserva().slice(0, limite);
  }
  return (data ?? []).map(mapear);
}

export async function articuloPublicado(slug: string): Promise<ArticuloPublico | null> {
  const db = supabasePublico();
  if (!db) return reserva().find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from('blog_articles')
    .select(CAMPOS)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();
  if (error) {
    console.error('[blog] lectura pública:', error.message);
    return reserva().find((p) => p.slug === slug) ?? null;
  }
  return data ? mapear(data) : null;
}

export function fechaLarga(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}
