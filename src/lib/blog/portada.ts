import type { SupabaseClient } from '@supabase/supabase-js';
import { promptPortada } from './editorial';
import { generarImagen } from './openai';

/**
 * Portada del artículo (H7.2): gpt-image-2.5-sunburst (reserva gpt-image-2) con la guía de estilo de Serveco → Storage «blog» (público).
 * Ruta: covers/{slug}-{marca de tiempo}.{webp|png} (la marca evita que el navegador muestre la portada vieja al regenerar).
 */
/** El muro solo entiende la escena corta. El prompt largo antiguo («Fotografía…») no se reinyecta. */
function escenasDelMuro(filas: { slug?: string; cover_prompt?: string | null }[] | null, slugActual: string): string[] {
  const vistas: string[] = [];
  for (const f of filas ?? []) {
    if (f.slug === slugActual) continue;
    const t = String(f.cover_prompt ?? '').trim();
    if (!t || t.startsWith('Fotografía') || t.length > 400) continue;
    vistas.push(t);
  }
  return vistas;
}

export async function generarPortada(
  db: SupabaseClient,
  slug: string,
  brief: string,
): Promise<{ url: string; prompt: string }> {
  const { data: resto } = await db.from('blog_articles').select('slug, cover_prompt');
  const prompt = promptPortada(brief, escenasDelMuro(resto, slug));
  const { bytes, formato } = await generarImagen(prompt);
  const ruta = `covers/${slug}-${Date.now()}.${formato}`;
  const { error } = await db.storage.from('blog').upload(ruta, bytes, { contentType: `image/${formato}`, upsert: true });
  if (error) throw new Error(`No se pudo subir la portada: ${error.message}`);
  const { data } = db.storage.from('blog').getPublicUrl(ruta);
  return { url: data.publicUrl, prompt };
}

/** Regenera la portada de un artículo existente con su brief (o uno nuevo) y la guarda. */
export async function regenerarPortada(db: SupabaseClient, id: string, briefNuevo?: string) {
  const { data: art, error } = await db.from('blog_articles').select('slug, title, cover_prompt').eq('id', id).single();
  if (error || !art) throw new Error('Artículo no encontrado');
  const guardado = String(art.cover_prompt ?? '').trim();
  const brief =
    briefNuevo?.trim() ||
    (guardado && !guardado.startsWith('Fotografía') && guardado.length <= 400 ? guardado : '') ||
    `Un objeto o un lugar concreto del tema «${art.title}», en un plano distinto de un despacho con ventanal`;
  const { url } = await generarPortada(db, String(art.slug), brief);
  const { error: e2 } = await db.from('blog_articles').update({ cover_url: url, cover_prompt: brief }).eq('id', id);
  if (e2) throw new Error(e2.message);
  return url;
}
