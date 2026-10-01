/**
 * Redacta un artículo nuevo desde la terminal (lo mismo que «Redactar con IA» en el panel).
 *   npm run blog:redactar -- "Cuándo pasar de autónomo a sociedad limitada" --area fiscal --notas "Mencionar Punto PAE"
 * Siempre queda en BORRADOR: publicar exige la revisión de un abogado en /administrator/blog.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { redactarArticulo } from '../src/lib/blog/redactor';
import { regenerarPortada } from '../src/lib/blog/portada';

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

function cliente() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secreta = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secreta || !process.env.OPENAI_API_KEY) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY u OPENAI_API_KEY en .env.local.');
    process.exit(1);
  }
  return createClient(url, secreta, { auth: { persistSession: false } }) as SupabaseClient;
}

function arg(nombre: string): string | undefined {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function reescribirLosTres(db: SupabaseClient) {
  const { data, error } = await db.from('blog_articles').select('id, slug, title, area_slug').order('published_at', { ascending: false });
  if (error || !data?.length) throw new Error(error?.message || 'No hay artículos que reescribir.');
  console.log(`Reescribiendo ${data.length} artículo(s), título fijo, sin portada todavía.\n`);
  for (const art of data) {
    console.log(`\n════ ${art.title}`);
    const r = await redactarArticulo({
      db,
      tema: String(art.title),
      tituloFijo: String(art.title),
      actualizarId: String(art.id),
      area: art.area_slug ? String(art.area_slug) : undefined,
      sinPortada: true,
      notas: 'Reescritura del artículo de ejemplo. Respeta el título al pie de la letra.',
    });
    console.log(`«${r.titulo}» · ${r.palabras} palabras`);
    for (const a of r.avisos) console.log(`  ${a.nivel === 'grave' ? '✗' : '~'} ${a.texto}`);
  }
}

async function portadas(db: SupabaseClient) {
  const { data, error } = await db.from('blog_articles').select('id, title, cover_prompt').order('title');
  if (error || !data?.length) throw new Error(error?.message || 'No hay artículos.');
  for (const art of data) {
    console.log(`\nPortada: ${art.title}`);
    const brief = art.cover_prompt && !String(art.cover_prompt).startsWith('Fotografía') ? String(art.cover_prompt) : undefined;
    const url = await regenerarPortada(db, String(art.id), brief);
    console.log(`  ${url}`);
  }
}

async function main() {
  if (process.argv.includes('--portadas')) {
    const db = cliente();
    await portadas(db);
    return;
  }
  if (process.argv.includes('--reescribir')) {
    const db = cliente();
    await reescribirLosTres(db);
    return;
  }
  const tema = process.argv.slice(2).find((a, i, arr) => !a.startsWith('--') && !(arr[i - 1] ?? '').startsWith('--'));
  if (!tema) {
    console.error('Uso: npm run blog:redactar -- "tema del artículo" [--area fiscal] [--notas "..."]');
    process.exit(1);
  }
  const db = cliente();
  const r = await redactarArticulo({ db, tema, area: arg('area'), notas: arg('notas') });

  console.log(`\n«${r.titulo}» · ${r.palabras} palabras · portada: ${r.portada ? 'sí' : 'NO'}`);
  if (r.avisos.length) {
    console.log('Avisos:');
    for (const a of r.avisos) console.log(`  ${a.nivel === 'grave' ? '✗' : '~'} ${a.texto}`);
  }
  console.log('Revíselo en /administrator/blog: queda en BORRADOR hasta que lo valide un abogado.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
