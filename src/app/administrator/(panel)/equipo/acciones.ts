'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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

async function subirFoto(id: string, archivo: FormDataEntryValue | null, actual: string) {
  if (!(archivo instanceof File) || archivo.size === 0) return actual || null;
  if (archivo.size > 4 * 1024 * 1024) conError(`/administrator/equipo/${id}`, 'La foto pesa más de 4 MB.');
  if (!archivo.type.startsWith('image/')) conError(`/administrator/equipo/${id}`, 'La foto tiene que ser una imagen.');
  const ext = archivo.type === 'image/png' ? 'png' : archivo.type === 'image/webp' ? 'webp' : 'jpg';
  const ruta = `${id}.${ext}`;
  const cuerpo = Buffer.from(await archivo.arrayBuffer());
  const cliente = db();
  let subida = await cliente.storage.from('equipo').upload(ruta, cuerpo, { upsert: true, contentType: archivo.type });
  if (subida.error && /bucket|not found/i.test(subida.error.message)) {
    await cliente.storage.createBucket('equipo', { public: true });
    subida = await cliente.storage.from('equipo').upload(ruta, cuerpo, { upsert: true, contentType: archivo.type });
  }
  if (subida.error) conError(`/administrator/equipo/${id}`, `No se pudo guardar la foto: ${subida.error.message}`);
  return cliente.storage.from('equipo').getPublicUrl(ruta).data.publicUrl;
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
  const foto = await subirFoto(data.id, formData.get('foto'), '');
  if (foto) await db().from('team_members').update({ foto_url: foto }).eq('id', data.id);
  refrescar();
  redirect(`/administrator/equipo/${data.id}?ok=${encodeURIComponent('Persona añadida.')}`);
}

export async function guardarMiembro(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = texto(formData, 'id');
  const nombre = texto(formData, 'nombre');
  if (!id) conError('/administrator/equipo', 'Ficha no encontrada.');
  if (nombre.length < 3) conError(`/administrator/equipo/${id}`, 'Escriba el nombre completo.');
  const foto = await subirFoto(id, formData.get('foto'), texto(formData, 'foto_actual'));
  const { error } = await db().from('team_members').update(datos(formData, foto ?? '')).eq('id', id);
  if (error) conError(`/administrator/equipo/${id}`, error.message);
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
