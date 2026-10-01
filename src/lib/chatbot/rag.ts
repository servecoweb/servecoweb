import { supabaseAdmin } from '@/lib/supabase/servidor';
import { EMBEDDING_MODEL } from '@/lib/chatbot/prompt';

/**
 * RAG: embeddings de áreas, landings, internacional y blog en `chatbot_kb` (pgvector).
 * Sin OPENAI_API_KEY o sin Supabase, el chat funciona igual con la ficha (bloqueVivo):
 * menos contexto, cero invención. Molde Neotérmica.
 */
export type KbHit = { source: string; slug: string; content: string; similarity: number };

export async function crearEmbedding(texto: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: texto.slice(0, 7000) }),
    });
    if (!res.ok) {
      console.error('[rag] embeddings:', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { data?: { embedding: number[] }[] };
    return json.data?.[0]?.embedding ?? null;
  } catch (error) {
    console.error('[rag] embeddings:', error);
    return null;
  }
}

export async function buscarContexto(pregunta: string, limite = 5): Promise<KbHit[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  const embedding = await crearEmbedding(pregunta);
  if (!embedding) return [];
  const { data, error } = await db.rpc('match_chatbot_kb', {
    query_embedding: embedding,
    match_threshold: 0.2,
    match_count: limite,
  });
  if (error) {
    console.error('[rag] match_chatbot_kb:', error.message);
    return [];
  }
  return (data ?? []) as KbHit[];
}

export function formatearContexto(hits: KbHit[]): string {
  if (hits.length === 0) return '';
  return `CONTEXTO DE LA WEB (usa solo lo que aparezca aquí):\n${hits
    .map((h) => `— [${h.source}/${h.slug}] ${h.content}`)
    .join('\n\n')}`;
}

/** Qué se buscó y qué se encontró: el revisor lo usa para detectar huecos del RAG. */
export function huecoRag(pregunta: string, hits: KbHit[]) {
  return {
    query: pregunta.slice(0, 300),
    hits: hits.map((h) => ({ slug: h.slug, source: h.source, similarity: Number(h.similarity?.toFixed?.(3) ?? 0) })),
    estado: hits.length === 0 ? 'missing' : 'ok',
  };
}
