/**
 * Llamadas a OpenAI del redactor (molde Neotérmica, con los errores del taller ya resueltos):
 *  · Reintentos ante errores transitorios (429, 5xx, timeouts, «fetch failed»).
 *  · gpt-5* a veces devuelve vacío: se reintenta, nunca se guarda un artículo en blanco.
 *  · La redacción con web_search va en «background» con sondeo, para no cortar la conexión.
 */
import { MODELO_IMAGEN, MODELO_IMAGEN_RESERVA, MODELO_TEXTO } from './editorial';

function clave(): string {
  const k = process.env.OPENAI_API_KEY?.trim();
  if (!k) throw new Error('Falta OPENAI_API_KEY en .env.local');
  return k;
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

function transitorio(err: unknown): boolean {
  return /429|500|502|503|504|520|timeout|ETIMEDOUT|ECONNRESET|fetch failed|socket hang up|vac[ií]a/i.test(
    String(err instanceof Error ? err.message : err),
  );
}

export async function conReintentos<T>(fn: () => Promise<T>, log: (m: string) => void, veces = 3): Promise<T> {
  let ultimo: unknown;
  for (let i = 0; i < veces; i++) {
    if (i > 0) {
      const ms = [15_000, 45_000, 90_000][i - 1] ?? 45_000;
      log(`   Reintento ${i + 1}/${veces} en ${ms / 1000}s…`);
      await esperar(ms);
    }
    try {
      return await fn();
    } catch (err) {
      ultimo = err;
      if (!transitorio(err) || i === veces - 1) throw err;
      log(`   Error transitorio: ${err instanceof Error ? err.message : err}`);
    }
  }
  throw ultimo instanceof Error ? ultimo : new Error(String(ultimo));
}

/** Chat Completions que devuelve JSON (plan y editor). Sin tools: vale con cualquier reasoning_effort. */
export async function chatJson<T>(
  sistema: string,
  usuario: string,
  maxTokens = 12_000,
  esfuerzo: 'low' | 'medium' | 'high' = 'high',
): Promise<T> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${clave()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODELO_TEXTO,
      messages: [
        { role: 'system', content: sistema },
        { role: 'user', content: usuario },
      ],
      response_format: { type: 'json_object' },
      max_completion_tokens: maxTokens,
      reasoning_effort: esfuerzo,
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`OpenAI chat ${res.status}: ${raw.slice(0, 300)}`);
  const texto = (JSON.parse(raw) as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content?.trim();
  if (!texto) throw new Error('Respuesta vacía del modelo (chat)');
  try {
    return JSON.parse(texto.replace(/^```(?:json)?|```$/g, '').trim()) as T;
  } catch {
    throw new Error('El modelo no devolvió JSON válido');
  }
}

type RespuestaResponses = {
  id: string;
  status: string;
  output_text?: string;
  output?: { content?: { type?: string; text?: string }[] }[];
  error?: { message?: string };
  incomplete_details?: { reason?: string };
};

/** Responses API con web_search obligatoria (redacción). Background + sondeo cada 8 s. */
export async function redactarConBusqueda(instrucciones: string, entrada: string, log: (m: string) => void): Promise<string> {
  const limite = Number(process.env.BLOG_REDACTOR_TIMEOUT_MS) || 600_000;
  const cabeceras = { Authorization: `Bearer ${clave()}`, 'Content-Type': 'application/json' };
  const creado = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify({
      model: MODELO_TEXTO,
      instructions: instrucciones,
      input: entrada,
      tools: [
        {
          type: 'web_search',
          search_context_size: 'high',
          user_location: { type: 'approximate', country: 'ES', region: 'Murcia', timezone: 'Europe/Madrid' },
        },
      ],
      tool_choice: 'required',
      reasoning: { effort: 'high' },
      max_output_tokens: 20_000,
      background: true,
      store: true,
    }),
  });
  const rawCreado = await creado.text();
  if (!creado.ok) throw new Error(`OpenAI responses ${creado.status}: ${rawCreado.slice(0, 300)}`);
  let r = JSON.parse(rawCreado) as RespuestaResponses;

  const inicio = Date.now();
  while (r.status === 'queued' || r.status === 'in_progress') {
    if (Date.now() - inicio > limite) throw new Error(`Redacción: timeout tras ${Math.round(limite / 60_000)} min`);
    await esperar(8_000);
    log(`   …investigando y redactando (${Math.round((Date.now() - inicio) / 1000)} s)`);
    const sondeo = await fetch(`https://api.openai.com/v1/responses/${r.id}`, { headers: cabeceras });
    const rawSondeo = await sondeo.text();
    if (!sondeo.ok) throw new Error(`OpenAI sondeo ${sondeo.status}: ${rawSondeo.slice(0, 200)}`);
    r = JSON.parse(rawSondeo) as RespuestaResponses;
  }
  if (r.status === 'failed' || r.error) throw new Error(r.error?.message || 'La redacción falló');
  if (r.status === 'cancelled') throw new Error('Redacción cancelada');

  const texto = (
    r.output_text ||
    (r.output ?? [])
      .flatMap((o) => o.content ?? [])
      .filter((c) => c.type === 'output_text' && c.text)
      .map((c) => c.text)
      .join('\n')
  ).trim();
  if (!texto) throw new Error(`Respuesta vacía del modelo (redacción: ${r.incomplete_details?.reason ?? 'sin texto'})`);
  return texto;
}

/**
 * Portada: 1536×1024, WebP. Prueba primero MODELO_IMAGEN (gpt-image-2.5-sunburst); si la cuenta no tiene
 * acceso o rechaza algún parámetro, reintenta con la reserva (gpt-image-2) y parámetros mínimos.
 */
export async function generarImagen(prompt: string): Promise<{ bytes: Buffer; formato: 'webp' | 'png' }> {
  const intentos: { formato: 'webp' | 'png'; params: Record<string, unknown> }[] = [
    {
      formato: 'webp',
      params: {
        model: MODELO_IMAGEN,
        size: '1536x1024',
        quality: process.env.BLOG_PORTADA_CALIDAD || 'medium',
        output_format: 'webp',
        output_compression: 82,
      },
    },
    { formato: 'png', params: { model: MODELO_IMAGEN_RESERVA, size: '1536x1024', quality: 'medium' } },
  ];
  let ultimoError = '';
  for (const { formato, params } of intentos) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clave()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, prompt, n: 1 }),
    });
    const raw = await res.text();
    if (!res.ok) {
      ultimoError = `OpenAI imagen ${res.status} (${params.model}): ${raw.slice(0, 300)}`;
      // Modelo no disponible o parámetro no admitido → probar la reserva. Otros errores, fuera.
      if (res.status === 400 || res.status === 403 || res.status === 404) continue;
      throw new Error(ultimoError);
    }
    const b64 = (JSON.parse(raw) as { data?: { b64_json?: string }[] }).data?.[0]?.b64_json;
    if (!b64) throw new Error('Respuesta vacía del modelo (imagen)');
    return { bytes: Buffer.from(b64, 'base64'), formato };
  }
  throw new Error(ultimoError || 'No se pudo generar la imagen');
}
