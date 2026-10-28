'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ESTADOS_CANDIDATO, type EstadoCandidato } from '@/lib/candidatos';

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? '').trim();
}

/** Vuelve a la lista con los mismos filtros. Solo se acepta una query propia, nunca otra URL. */
function lista(formData: FormData, aviso?: { ok?: string; error?: string }) {
  const p = new URLSearchParams(texto(formData, 'volver').replace(/^\?/, ''));
  p.delete('ok');
  p.delete('error');
  if (aviso?.ok) p.set('ok', aviso.ok);
  if (aviso?.error) p.set('error', aviso.error);
  const q = p.toString();
  return `/administrator/candidatos${q ? `?${q}` : ''}`;
}

/** Cambia el estado de una candidatura. No hay notas: el volumen es bajo y el estado basta. */
export async function cambiarEstadoCandidato(formData: FormData) {
  const id = texto(formData, 'id');
  const estado = texto(formData, 'estado');
  if (!ESTADOS_CANDIDATO.some((e) => e.valor === estado)) redirect(lista(formData));
  const db = supabaseAdmin();
  if (!db) redirect(lista(formData, { error: 'Sin conexión con la base de datos.' }));
  const { error } = await db.from('candidaturas').update({ estado: estado as EstadoCandidato }).eq('id', id);
  if (error) redirect(lista(formData, { error: error.message }));
  revalidatePath('/administrator/candidatos');
  redirect(lista(formData));
}

/** Borra una candidatura del todo (p. ej., si la persona pide que se borren sus datos). */
export async function eliminarCandidato(formData: FormData) {
  const id = texto(formData, 'id');
  const db = supabaseAdmin();
  if (!db) redirect(lista(formData, { error: 'Sin conexión con la base de datos.' }));
  const { error } = await db.from('candidaturas').delete().eq('id', id);
  if (error) redirect(lista(formData, { error: error.message }));
  revalidatePath('/administrator/candidatos');
  redirect(lista(formData, { ok: 'Candidatura eliminada.' }));
}
