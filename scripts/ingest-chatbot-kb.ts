/**
 * Actualiza el conocimiento del chatbot: npm run chat:ingest
 * (Lo mismo que el botón «Actualizar conocimiento» del panel /administrator/chatbot.)
 * Windows con Norton: relaja TLS SOLO en este script.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { ingestarConocimiento } from '../src/lib/chatbot/ingesta';

function cargarEnv() {
  const p = path.join(process.cwd(), '.env.local');
  if (!existsSync(p)) return;
  for (const linea of readFileSync(p, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)=(.*)$/.exec(linea.replace(/\r$/, ''));
    if (!m || !m[1] || process.env[m[1]]) continue;
    process.env[m[1]] = (m[2] ?? '').replace(/^["']|["']$/g, '').trim();
  }
}
cargarEnv();
if (process.env.CHAT_INGEST_INSECURE_TLS !== '0') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secreta = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = process.env.OPENAI_API_KEY;
  if (!url || !secreta || !key) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY u OPENAI_API_KEY en .env.local.');
    process.exit(1);
  }
  const db = createClient(url, secreta, { auth: { persistSession: false } });
  console.log('Actualizando el conocimiento del chatbot…');
  const r = await ingestarConocimiento(db, key, (h, t) => process.stdout.write(`\r  ${h}/${t}`));
  console.log(`\nListo: ${r.fragmentos} fragmentos${r.borrados ? `, ${r.borrados} retirados (ya no publicados)` : ''}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
