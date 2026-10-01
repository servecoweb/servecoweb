'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { exigirAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ESTADOS, PRIORIDADES } from '@/lib/crm';
import { MOTIVOS, type Motivo } from '@/lib/spam';

/**
 * Acciones del mini-CRM (/administrator/contactos). Cada cambio de estado o prioridad deja
 * una nota automática en el historial con quién lo hizo. Las consultas no se borran: se descartan.
 */
const texto = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function db() {
  const c = supabaseAdmin();
  if (!c) throw new Error('Falta configurar Supabase');
  return c;
}

export async function actualizarContacto(formData: FormData): Promise<void> {
  const usuario = await exigirAdmin();
  const autor = usuario.email ?? 'panel';
  const id = texto(formData, 'id');
  const c = db();

  const { data: antes } = await c.from('contact_submissions').select('estado, prioridad, responsable, seguimiento_el').eq('id', id).single();
  if (!antes) redirect('/administrator/contactos');

  const estado = ESTADOS.some((e) => e.valor === texto(formData, 'estado')) ? texto(formData, 'estado') : antes.estado;
  const prioridad = PRIORIDADES.some((p) => p.valor === texto(formData, 'prioridad')) ? texto(formData, 'prioridad') : antes.prioridad;
  const responsable = texto(formData, 'responsable') || null;
  const seguimiento = texto(formData, 'seguimiento_el') || null;

  const cambios: Record<string, unknown> = { prioridad, responsable, seguimiento_el: seguimiento };
  if (estado !== antes.estado) {
    cambios.estado = estado;
    cambios.estado_desde = new Date().toISOString();
  }
  const { error } = await c.from('contact_submissions').update(cambios).eq('id', id);
  if (error) redirect(`/administrator/contactos/${id}?error=${encodeURIComponent(error.message)}`);

  const historial: { contact_id: string; autor: string; tipo: string; texto: string }[] = [];
  if (estado !== antes.estado) historial.push({ contact_id: id, autor, tipo: 'estado', texto: `Estado: ${antes.estado} → ${estado}` });
  if (prioridad !== antes.prioridad) historial.push({ contact_id: id, autor, tipo: 'estado', texto: `Prioridad: ${antes.prioridad} → ${prioridad}` });
  if (responsable !== (antes.responsable ?? null)) historial.push({ contact_id: id, autor, tipo: 'estado', texto: `Responsable: ${responsable ?? '—'}` });
  if (seguimiento !== (antes.seguimiento_el ?? null)) historial.push({ contact_id: id, autor, tipo: 'estado', texto: `Seguimiento: ${seguimiento ?? 'sin fecha'}` });
  if (historial.length) await c.from('contact_notas').insert(historial);

  revalidatePath('/administrator/contactos');
  redirect(`/administrator/contactos/${id}?ok=${encodeURIComponent('Guardado.')}`);
}

export async function anadirNota(formData: FormData): Promise<void> {
  const usuario = await exigirAdmin();
  const id = texto(formData, 'id');
  const nota = texto(formData, 'nota').slice(0, 5000);
  if (nota) {
    const { error } = await db().from('contact_notas').insert({ contact_id: id, autor: usuario.email ?? 'panel', tipo: 'nota', texto: nota });
    if (error) redirect(`/administrator/contactos/${id}?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath(`/administrator/contactos/${id}`);
  redirect(`/administrator/contactos/${id}`);
}

/** «No era spam»: pasa la consulta filtrada a contactos (tal cual llegó) y deja constancia en el historial. */
export async function recuperarSpam(formData: FormData): Promise<void> {
  const usuario = await exigirAdmin();
  const spamId = texto(formData, 'id');
  const c = db();
  const { data: s } = await c.from('contact_spam').select('motivo, datos, created_at').eq('id', spamId).maybeSingle();
  if (!s) redirect('/administrator/contactos?ok=' + encodeURIComponent('Ya no estaba en la bandeja de spam.'));

  const { data: nueva, error } = await c
    .from('contact_submissions')
    .insert({ ...(s.datos as Record<string, unknown>), created_at: s.created_at })
    .select('id')
    .single();
  if (error || !nueva) redirect('/administrator/contactos?error=' + encodeURIComponent(`No se pudo recuperar: ${error?.message}`));

  await c.from('contact_notas').insert({
    contact_id: nueva.id,
    autor: usuario.email ?? 'panel',
    tipo: 'sistema',
    texto: `Recuperada del filtro de spam (motivo: ${MOTIVOS[s.motivo as Motivo] ?? s.motivo}). No se envió correo de confirmación al visitante: conviene contestarle.`,
  });
  await c.from('contact_spam').delete().eq('id', spamId);

  revalidatePath('/administrator/contactos');
  redirect(`/administrator/contactos/${nueva.id}?ok=${encodeURIComponent('Recuperada. Conteste al visitante: no recibió confirmación.')}`);
}
