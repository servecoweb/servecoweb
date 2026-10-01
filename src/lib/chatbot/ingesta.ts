import type { SupabaseClient } from '@supabase/supabase-js';
import { bloqueVivo, EMBEDDING_MODEL } from '@/lib/chatbot/prompt';
import { fichaDesdeFilas, leerFilasFicha } from '@/lib/chatbot/ficha';
import { chunksContenidoWeb } from '@/lib/chatbot/conocimiento-web';
import { ES, EN } from '@/lib/rutas';

/**
 * Ingesta del conocimiento del chatbot → chatbot_kb (pgvector).
 * Fuentes: lo PUBLICADO en Supabase (ficha, áreas, landings, internacional, blog) + el CONTENIDO SEO de la
 * web en español e inglés (conocimiento-web.ts: áreas ES/EN, internacional ES/EN, fichas, PAE, subvenciones).
 * Cada fragmento lleva su «Página:» para que el asistente pueda enlazarlo.
 * Borra de chatbot_kb lo que ya no esté publicado (un artículo despublicado deja de responderse).
 * La usan: npm run chat:ingest y el botón del panel /administrator/chatbot.
 */
type Chunk = { source: string; slug: string; content: string };

async function embed(texto: string, key: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texto.slice(0, 7000) }),
  });
  if (!res.ok) throw new Error(`embeddings ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: { embedding: number[] }[] };
  const vec = json.data?.[0]?.embedding;
  if (!vec) throw new Error('embedding vacío');
  return vec;
}

const sinHtml = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const lista = (v: unknown) => (Array.isArray(v) ? (v as string[]).join('; ') : '');

export async function ingestarConocimiento(
  db: SupabaseClient,
  openaiKey: string,
  progreso?: (hecho: number, total: number) => void,
): Promise<{ fragmentos: number; borrados: number }> {
  const filasFicha = await leerFilasFicha(db);
  const ficha = fichaDesdeFilas(filasFicha.areas, filasFicha.sedes, filasFicha.locales, filasFicha.intl);

  const [areas, landings, intl, blog, sedes] = await Promise.all([
    db.from('service_areas').select('slug, slug_en, nombre, resumen, intro, incluye').eq('activo', true),
    db.from('seo_landings').select('area_slug, office_slug, h1, lead, cuando_h2, cuando_texto, que_hacemos, angulo_local, faqs').eq('published', true),
    db.from('intl_pages').select('slug, slug_en, titulo, lead, puntos, titulo_en, lead_en, puntos_en').eq('published', true),
    db.from('blog_articles').select('slug, title, excerpt, body, category').eq('status', 'published').lte('published_at', new Date().toISOString()),
    db.from('offices').select('slug, ciudad').eq('activo', true),
  ]);
  for (const r of [areas, landings, intl, blog, sedes]) if (r.error) throw new Error(r.error.message);
  const ciudad = new Map((sedes.data ?? []).map((s) => [s.slug as string, s.ciudad as string]));

  const chunks: Chunk[] = [
    { source: 'ficha', slug: 'serveco', content: bloqueVivo(ficha) },
    ...(areas.data ?? []).map((a) => ({
      source: 'area',
      slug: String(a.slug),
      content:
        `Área ${a.nombre}. ${a.resumen}\n${a.intro}\nIncluye: ${lista(a.incluye)}\n` +
        `Página: ${ES.area(String(a.slug))} · EN: ${EN.area(String(a.slug_en))}`,
    })),
    ...(landings.data ?? []).map((l) => ({
      source: 'landing',
      slug: `${l.area_slug}-${l.office_slug}`,
      content:
        `${l.h1} (${ciudad.get(String(l.office_slug)) ?? l.office_slug})\n${l.lead}\n${l.cuando_h2} ${l.cuando_texto}\n` +
        `Qué hacemos: ${lista(l.que_hacemos)}\n${l.angulo_local}\n` +
        ((l.faqs as { q: string; a: string }[] | null) ?? []).map((f) => `P: ${f.q} R: ${f.a}`).join('\n') +
        `\nPágina: ${ES.landing(String(l.area_slug), String(l.office_slug))}`,
    })),
    ...(intl.data ?? []).map((p) => ({
      source: 'internacional',
      slug: String(p.slug),
      content:
        `${p.titulo}. ${p.lead}\n${lista(p.puntos)}\nPágina: ${ES.intl(String(p.slug))}\n` +
        `[EN] ${p.titulo_en}. ${p.lead_en}\n${lista(p.puntos_en)}\nPage: ${EN.intl(String(p.slug_en))}`,
    })),
    ...(blog.data ?? []).map((b) => ({
      source: 'blog',
      slug: String(b.slug),
      content:
        `Artículo del blog (${b.category}): ${b.title}\nPágina: ${ES.post(String(b.slug))}\n` +
        `${b.excerpt}\n${sinHtml(String(b.body)).slice(0, 4000)}`,
    })),
    // Contenido SEO de la web (ES + EN): lo que dicen las páginas, con su enlace e idioma.
    ...chunksContenidoWeb(),
  ];

  for (const [i, c] of chunks.entries()) {
    const embedding = await embed(c.content, openaiKey);
    const { error } = await db.from('chatbot_kb').upsert({ ...c, embedding }, { onConflict: 'source,slug' });
    if (error) throw new Error(error.message);
    progreso?.(i + 1, chunks.length);
  }

  // Limpieza: lo que ya no está publicado sale del conocimiento.
  const vigentes = new Set(chunks.map((c) => `${c.source}|${c.slug}`));
  const { data: existentes, error: e2 } = await db.from('chatbot_kb').select('id, source, slug');
  if (e2) throw new Error(e2.message);
  const sobran = (existentes ?? []).filter((r) => !vigentes.has(`${r.source}|${r.slug}`)).map((r) => r.id as string);
  if (sobran.length) {
    const { error } = await db.from('chatbot_kb').delete().in('id', sobran);
    if (error) throw new Error(error.message);
  }

  return { fragmentos: chunks.length, borrados: sobran.length };
}
