'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { exigirAdmin } from '@/lib/admin';
import { filaDesdeFormulario } from '@/lib/equipo';
import { EN, ES } from '@/lib/rutas';
import { supabaseAdmin } from '@/lib/supabase/servidor';

const texto = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function db() {
  const c = supabaseAdmin();
  if (!c) throw new Error('Falta configurar Supabase');
  return c;
}

function conError(ruta: string, msg: string): never {
  redirect(`${ruta}?error=${encodeURIComponent(msg)}`);
}

function refrescar() {
  for (const ruta of [ES.home, ES.firma, ES.equipo, EN.team, '/administrator/equipo']) revalidatePath(ruta);
  revalidatePath('/es/la-firma/despachos/[sede]', 'page');
}

/** Lado largo máximo. Cubre la ficha del equipo en pantalla retina; no se amplía una foto más pequeña. */
const FOTO_LADO = 800;
const TIPOS_FOTO = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Endereza según la cámara, limita el lado largo y guarda WebP. */
async function prepararFoto(archivo: File, rutaError: string): Promise<Buffer> {
  if (!TIPOS_FOTO.has(archivo.type)) conError(rutaError, 'La foto tiene que ser JPG, PNG o WebP.');
  try {
    return await sharp(Buffer.from(await archivo.arrayBuffer()))
      .rotate()
      .resize(FOTO_LADO, FOTO_LADO, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    conError(rutaError, 'No se pudo preparar la foto. Pruebe con otro JPG, PNG o WebP.');
  }
}

async function subirFoto(id: string, archivo: FormDataEntryValue | null, actual: string) {
  if (!(archivo instanceof File) || archivo.size === 0) return actual || null;
  const rutaError = `/administrator/equipo/${id}`;
  if (archivo.size > 4 * 1024 * 1024) conError(rutaError, 'La foto pesa más de 4 MB.');
  const cuerpo = await prepararFoto(archivo, rutaError);
  // El archivo siempre se llama como la persona. Si la dirección no cambia, el navegador
  // enseña la foto anterior. El ?v= obliga a pedir la nueva.
  const ruta = `${id}.webp`;
  const cliente = db();
  const opciones = { upsert: true, contentType: 'image/webp', cacheControl: '0' };
  let subida = await cliente.storage.from('equipo').upload(ruta, cuerpo, opciones);
  if (subida.error && /bucket|not found/i.test(subida.error.message)) {
    await cliente.storage.createBucket('equipo', { public: true });
    subida = await cliente.storage.from('equipo').upload(ruta, cuerpo, opciones);
  }
  if (subida.error) conError(rutaError, `No se pudo guardar la foto: ${subida.error.message}`);
  const publica = cliente.storage.from('equipo').getPublicUrl(ruta).data.publicUrl;
  return `${publica}?v=${Date.now()}`;
}

/** El JPG o PNG anterior deja de servir cuando la ficha ya apunta al WebP. */
async function quitarOriginal(id: string) {
  await db().storage.from('equipo').remove([`${id}.jpg`, `${id}.jpeg`, `${id}.png`]);
}

function datos(f: FormData, foto: string) {
  return filaDesdeFormulario({
    nombre: texto(f, 'nombre'),
    cargo: texto(f, 'cargo'),
    cargoEn: texto(f, 'cargo_en'),
    departamento: texto(f, 'departamento'),
    sedeSlug: texto(f, 'sede'),
    foto,
    destacado: f.get('destacado') === 'on',
    publicado: f.get('publicado') === 'on',
    orden: Number(texto(f, 'orden')) || 1,
  });
}

export async function crearMiembro(formData: FormData): Promise<void> {
  await exigirAdmin();
  const nombre = texto(formData, 'nombre');
  if (nombre.length < 3) conError('/administrator/equipo/nuevo', 'Escriba el nombre completo.');
  const { data, error } = await db()
    .from('team_members')
    .insert(datos(formData, ''))
    .select('id')
    .single();
  if (error || !data) conError('/administrator/equipo/nuevo', error?.message ?? 'No se pudo crear.');
  const archivo = formData.get('foto');
  const foto = await subirFoto(data.id, archivo, '');
  if (foto) {
    const guardada = await db().from('team_members').update({ foto_url: foto }).eq('id', data.id);
    if (!guardada.error && archivo instanceof File && archivo.size > 0) await quitarOriginal(data.id);
  }
  refrescar();
  redirect(`/administrator/equipo/${data.id}?ok=${encodeURIComponent('Persona añadida.')}`);
}

export async function guardarMiembro(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const nombre = texto(formData, 'nombre');
  if (!id) conError('/administrator/equipo', 'Ficha no encontrada.');
  if (nombre.length < 3) conError(`/administrator/equipo/${id}`, 'Escriba el nombre completo.');
  const archivo = formData.get('foto');
  const foto = await subirFoto(id, archivo, texto(formData, 'foto_actual'));
  const { error } = await db().from('team_members').update(datos(formData, foto ?? '')).eq('id', id);
  if (error) conError(`/administrator/equipo/${id}`, error.message);
  if (archivo instanceof File && archivo.size > 0) await quitarOriginal(id);
  refrescar();
  redirect(`/administrator/equipo/${id}?ok=${encodeURIComponent('Cambios guardados.')}`);
}

export async function borrarMiembro(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  if (!id) conError('/administrator/equipo', 'Ficha no encontrada.');
  const { error } = await db().from('team_members').delete().eq('id', id);
  if (error) conError(`/administrator/equipo/${id}`, error.message);
  refrescar();
  redirect(`/administrator/equipo?ok=${encodeURIComponent('Persona quitada del equipo.')}`);
}
