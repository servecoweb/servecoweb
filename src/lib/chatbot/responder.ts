import { buscarContexto, formatearContexto, huecoRag, type KbHit } from '@/lib/chatbot/rag';
import { bloqueVivo, SYSTEM_PROMPT } from '@/lib/chatbot/prompt';
import { cargarFicha } from '@/lib/chatbot/ficha';

/**
 * Prepara un turno del asistente: prompt + ficha (Supabase) + contexto RAG + historial.
 * Lo usan /api/chat y el script de pruebas (npm run chat:probar): se prueba lo mismo que responde la web.
 */
export type Turno = { role: 'user' | 'assistant'; content: string };
export type MensajeModelo = { role: 'system' | 'user' | 'assistant'; content: string };

export async function prepararTurno(opts: { message: string; history: Turno[]; idioma: 'es' | 'en' }) {
  const [ficha, hits] = await Promise.all([cargarFicha(), buscarContexto(opts.message)]);
  const fichaTexto = bloqueVivo(ficha);
  const contexto = formatearContexto(hits);

  const mensajes: MensajeModelo[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: fichaTexto },
    ...(contexto ? [{ role: 'system' as const, content: contexto }] : []),
    ...(opts.idioma === 'en'
      ? [{ role: 'system' as const, content: 'The visitor is browsing the English site. Reply in the language they write in (normally English) and, in English, prefer /en/ links.' }]
      : []),
    ...opts.history,
    { role: 'user', content: opts.message },
  ];

  return { mensajes, hits: hits as KbHit[], ragGap: huecoRag(opts.message, hits), fichaTexto, contexto };
}
