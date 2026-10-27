'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ESTADOS_CANDIDATO, type EstadoCandidato } from '@/lib/candidatos';

function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? '').trim();
}

/** Cambia el estado de una candidatura. No hay notas: el volumen es bajo y el estado basta. */
export async function cambiarEstadoCandidato(formData: FormData) {
  const id = texto(formData, 'id');
  const estado = texto(formData, 'estado');
  if (!ESTADOS_CANDIDATO.some((e) => e.valor === estado)) redirect('/administrator/candidatos');
  const db = supabaseAdmin();
  if (!db) redirect('/administrator/candidatos?error=' + encodeURIComponent('Sin conexión con la base de datos.'));
  const { error } = await db.from('candidaturas').update({ estado: estado as EstadoCandidato }).eq('id', id);
  if (error) redirect('/administrator/candidatos?error=' + encodeURIComponent(error.message));
  revalidatePath('/administrator/candidatos');
  redirect('/administrator/candidatos?ok=' + encodeURIComponent('Estado actualizado.'));
}
