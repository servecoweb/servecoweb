'use server';

import { revalidatePath } from 'next/cache';
import { exigirAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { auditarYGuardar } from '@/lib/chatbot/auditor';
import { ingestarConocimiento } from '@/lib/chatbot/ingesta';

/**
 * El revisor califica hasta 30 respuestas sin nota (10/5/0). Nadie pulsa notas a mano.
 * Regla del taller: si salen 5 o 0, se arregla el agente (prompt, ficha o RAG).
 */
export async function revisarPendientes(): Promise<void> {
  await exigirAdmin();
  const db = supabaseAdmin();
  if (!db) return;

  const [{ data: mensajes }, { data: notas }] = await Promise.all([
    db.from('chat_messages').select('id, thread_id, created_at, role, content').order('created_at', { ascending: true }).limit(5000),
    db.from('chat_reviews').select('message_id'),
  ]);
  if (!mensajes) return;

  const conNota = new Set((notas ?? []).map((n) => n.message_id as string));
  const pendientes = mensajes
    .filter((m) => m.role === 'assistant' && !conNota.has(m.id as string))
    .slice(-30);

  for (const m of pendientes) {
    const hilo = mensajes.filter((x) => x.thread_id === m.thread_id);
    const idx = hilo.findIndex((x) => x.id === m.id);
    const pregunta = [...hilo.slice(0, idx)].reverse().find((x) => x.role === 'user')?.content ?? '';
    await auditarYGuardar({ messageId: m.id as string, pregunta: pregunta as string, respuesta: m.content as string });
  }

  revalidatePath('/administrator/chatbot');
}

/**
 * Actualiza el conocimiento del chatbot con lo publicado (áreas, landings, internacional, blog).
 * Lo mismo que `npm run chat:ingest`. Cuando exista el panel del blog, se lanzará solo al publicar.
 */
export async function actualizarConocimiento(): Promise<void> {
  await exigirAdmin();
  const db = supabaseAdmin();
  const key = process.env.OPENAI_API_KEY;
  if (!db || !key) throw new Error('Falta Supabase u OPENAI_API_KEY');
  const r = await ingestarConocimiento(db, key);
  console.log(`[chatbot] conocimiento actualizado: ${r.fragmentos} fragmentos, ${r.borrados} retirados`);
  revalidatePath('/administrator/chatbot');
}
