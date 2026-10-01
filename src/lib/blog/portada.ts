import type { SupabaseClient } from '@supabase/supabase-js';
import { promptPortada } from './editorial';
import { generarImagen } from './openai';

/**
 * Portada del artículo (H7.2): gpt-image-2.5-sunburst (reserva gpt-image-2) con la guía de estilo de Serveco → Storage «blog» (público).
 * Ruta: covers/{slug}-{marca de tiempo}.{webp|png} (la marca evita que el navegador muestre la portada vieja al regenerar).
 */
export async function generarPortada(
  db: SupabaseClient,
  slug: string,
  brief: string,
): Promise<{ url: string; prompt: string }> {
  const prompt = promptPortada(brief);
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
  const brief = briefNuevo?.trim() || `Escena que ilustre, de forma sobria y sin texto, el tema: ${art.title}`;
  const { url, prompt } = await generarPortada(db, String(art.slug), brief);
  const { error: e2 } = await db.from('blog_articles').update({ cover_url: url, cover_prompt: prompt }).eq('id', id);
  if (e2) throw new Error(e2.message);
  return url;
}
