'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { exigirAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { redactarArticulo, reprocesar, slugificar } from '@/lib/blog/redactor';
import { regenerarPortada } from '@/lib/blog/portada';
import { ingestarConocimiento } from '@/lib/chatbot/ingesta';

/**
 * Acciones del panel del blog (partidas 04 y 07).
 * Regla: publicar o programar exige el nombre del abogado que ha revisado (también lo exige la BD).
 * Al publicar, el chatbot aprende el artículo (H7.3).
 */
const texto = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function db() {
  const c = supabaseAdmin();
  if (!c) throw new Error('Falta configurar Supabase');
  return c;
}

function conError(ruta: string, msg: string): never {
  redirect(`${ruta}?error=${encodeURIComponent(msg)}`);
}

export async function redactarConIA(formData: FormData): Promise<void> {
  await exigirAdmin();
  const tema = texto(formData, 'tema');
  if (tema.length < 8) conError('/administrator/blog', 'Describa el tema con algo más de detalle.');
  let id = '';
  try {
    const r = await redactarArticulo({
      db: db(),
      tema,
      area: texto(formData, 'area') || undefined,
      notas: texto(formData, 'notas') || undefined,
    });
    id = r.id;
  } catch (err) {
    conError('/administrator/blog', `No se pudo redactar: ${err instanceof Error ? err.message : err}`);
  }
  revalidatePath('/administrator/blog');
  redirect(`/administrator/blog/${id}?ok=${encodeURIComponent('Borrador creado. Revíselo antes de publicar.')}`);
}

export async function guardarArticulo(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const ruta = `/administrator/blog/${id}`;
  const c = db();

  const { data: actual } = await c.from('blog_articles').select('fuentes, slug, published_at').eq('id', id).single();
  if (!actual) conError('/administrator/blog', 'Artículo no encontrado.');

  const titulo = texto(formData, 'title');
  if (titulo.length < 3) conError(ruta, 'Escriba el título del artículo.');

  const estado = texto(formData, 'status');
  const revisadoPor = texto(formData, 'revisado_por');
  if (estado !== 'draft' && !revisadoPor) {
    conError(ruta, 'Para publicar o programar hay que indicar qué abogado lo ha revisado.');
  }

  let publicado: string | null = (actual.published_at as string | null) ?? null;
  if (estado === 'published') publicado = publicado && new Date(publicado) <= new Date() ? publicado : new Date().toISOString();
  if (estado === 'scheduled') {
    const fecha = texto(formData, 'published_at');
    if (!fecha) conError(ruta, 'Indique la fecha de publicación programada.');
    publicado = new Date(fecha).toISOString();
  }

  const { md, html, avisos } = reprocesar(texto(formData, 'body_md'), (actual.fuentes as { titulo: string; url: string }[]) ?? []);
  const slug = slugificar(texto(formData, 'slug') || String(actual.slug));

  const { error } = await c
    .from('blog_articles')
    .update({
      title: titulo,
      seo_title: texto(formData, 'seo_title') || null,
      slug,
      excerpt: texto(formData, 'excerpt'),
      meta_description: texto(formData, 'meta_description'),
      body_md: md,
      body: html,
      avisos,
      cover_alt: texto(formData, 'cover_alt') || null,
      status: estado,
      published_at: publicado,
      revisado_por: revisadoPor || null,
      revisado_at: revisadoPor ? new Date().toISOString() : null,
    })
    .eq('id', id);
  if (error) conError(ruta, `No se pudo guardar: ${error.message}`);

  // El chatbot aprende lo publicado (y olvida lo despublicado).
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      await ingestarConocimiento(c, key);
    } catch (err) {
      console.error('[blog] no se pudo actualizar el conocimiento del chat:', err);
    }
  }

  revalidatePath('/administrator/blog');
  revalidatePath('/es/blog');
  revalidatePath(`/es/blog/${slug}`);
  redirect(`${ruta}?ok=${encodeURIComponent('Guardado.')}`);
}

function mensajePortadaIa(err: unknown): string {
  const bruto = err instanceof Error ? err.message : String(err);
  if (/expired_secret_key|API key has expired/i.test(bruto)) {
    return 'No se pudo generar la portada: la clave de OpenAI ha caducado. Puede subir una imagen propia.';
  }
  if (/Falta OPENAI_API_KEY|invalid_api_key|Incorrect API key/i.test(bruto)) {
    return 'No se pudo generar la portada: no hay una clave de OpenAI válida. Puede subir una imagen propia.';
  }
  return `No se pudo generar la portada: ${bruto}`;
}

function refrescarPortada(id: string, slug: string) {
  revalidatePath(`/administrator/blog/${id}`);
  revalidatePath('/administrator/blog');
  revalidatePath('/es');
  revalidatePath('/es/blog');
  if (slug) revalidatePath(`/es/blog/${slug}`);
}

export async function nuevaPortada(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const c = db();
  const { data: art } = await c.from('blog_articles').select('slug').eq('id', id).maybeSingle();
  try {
    await regenerarPortada(c, id, texto(formData, 'brief') || undefined);
  } catch (err) {
    conError(`/administrator/blog/${id}`, mensajePortadaIa(err));
  }
  refrescarPortada(id, String(art?.slug ?? ''));
  redirect(`/administrator/blog/${id}?ok=${encodeURIComponent('Portada nueva generada.')}`);
}

/** Sustituye la portada por un archivo del despacho. No llama a OpenAI. */
export async function subirPortada(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const ruta = `/administrator/blog/${id}`;
  const archivo = formData.get('imagen');
  if (!(archivo instanceof File) || archivo.size === 0) conError(ruta, 'Elija una imagen.');
  if (archivo.size > 4 * 1024 * 1024) conError(ruta, 'La imagen pesa más de 4 MB.');
  const porTipo: Record<string, string> = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const nombre = archivo.name.toLowerCase();
  const ext =
    porTipo[archivo.type] ||
    (nombre.endsWith('.png') ? 'png' : nombre.endsWith('.webp') ? 'webp' : nombre.endsWith('.jpg') || nombre.endsWith('.jpeg') ? 'jpg' : '');
  if (!ext) conError(ruta, 'La imagen tiene que ser JPG, PNG o WebP.');
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const c = db();
  const { data: art } = await c.from('blog_articles').select('slug').eq('id', id).maybeSingle();
  if (!art) conError('/administrator/blog', 'Artículo no encontrado.');

  const storageRuta = `covers/${art.slug}-${Date.now()}.${ext}`;
  const cuerpo = Buffer.from(await archivo.arrayBuffer());
  const subida = await c.storage.from('blog').upload(storageRuta, cuerpo, { contentType, upsert: true });
  if (subida.error) conError(ruta, `No se pudo subir la portada: ${subida.error.message}`);

  const url = c.storage.from('blog').getPublicUrl(storageRuta).data.publicUrl;
  const { error } = await c.from('blog_articles').update({ cover_url: url, cover_prompt: null }).eq('id', id);
  if (error) conError(ruta, `No se pudo guardar la portada: ${error.message}`);

  refrescarPortada(id, String(art.slug));
  redirect(`${ruta}?ok=${encodeURIComponent('Portada sustituida por su imagen.')}`);
}

/** Solo borradores: lo publicado no se borra desde aquí (se despublica pasándolo a borrador). */
export async function descartarBorrador(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const { error } = await db().from('blog_articles').delete().eq('id', id).eq('status', 'draft');
  if (error) conError(`/administrator/blog/${id}`, `No se pudo descartar: ${error.message}`);
  revalidatePath('/administrator/blog');
  redirect(`/administrator/blog?ok=${encodeURIComponent('Borrador descartado.')}`);
}
