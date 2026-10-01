/**
 * Genera las escenas de la web (gpt-image-2.5-sunburst; reserva gpt-image-2) en public/escenas/.
 *   npx tsx scripts/generar-escenas.ts
 * Si el archivo ya existe, lo salta. --forzar lo regenera.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ESCENAS } from '../src/data/escenas';
import { promptPortada } from '../src/lib/blog/editorial';
import { conReintentos, generarImagen } from '../src/lib/blog/openai';

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

const forzar = process.argv.includes('--forzar');
const dir = path.join(process.cwd(), 'public', 'escenas');
mkdirSync(dir, { recursive: true });

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Falta OPENAI_API_KEY en .env.local');
    process.exit(1);
  }
  for (const e of ESCENAS) {
    const destino = path.join(dir, path.basename(e.archivo));
    if (existsSync(destino) && !forzar) {
      console.log(`salta ${e.id} (ya existe)`);
      continue;
    }
    console.log(`generando ${e.id}…`);
    const { bytes, formato } = await conReintentos(() => generarImagen(promptPortada(e.brief)), (m) => console.log(m));
    // generarImagen devuelve { bytes, formato } (24 sep): WebP con el modelo principal, PNG con la reserva.
    if (!destino.endsWith(`.${formato}`)) {
      console.warn(`  aviso: salió en ${formato} (modelo de reserva) pero el archivo se llama ${path.basename(destino)}; el navegador lo mostrará igual.`);
    }
    writeFileSync(destino, bytes);
    console.log(`  ${destino} (${Math.round(bytes.length / 1024)} KB)`);
  }
  console.log('listo');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
