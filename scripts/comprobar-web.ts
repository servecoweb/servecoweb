/**
 * Comprueba la web en local (encargo técnico, bloque 2).
 *   npm run web:comprobar
 * Requiere `npm run dev` en http://localhost:3000 (o BASE=http://...).
 *
 * Informe: docs/COMPROBACION-WEB.md
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const BASE = (process.env.BASE || 'http://localhost:3000').replace(/\/$/, '');
const RAIZ = process.cwd();

type Problema = { url: string; detalle: string };

function abs(ruta: string): string {
  return new URL(ruta, BASE).href;
}

async function pedir(ruta: string): Promise<{ status: number; html: string; final: string }> {
  const res = await fetch(abs(ruta), { redirect: 'manual' });
  const html = res.status >= 200 && res.status < 300 ? await res.text() : '';
  return { status: res.status, html, final: ruta };
}

function enlacesDe(html: string): string[] {
  const vistos = new Set<string>();
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1]?.trim() ?? '';
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const limpio = href.split('#')[0]?.split('?')[0] ?? '';
    if (!limpio || limpio.startsWith('/_next')) continue;
    vistos.add(limpio);
  }
  return [...vistos];
}

function textos(html: string, etiqueta: string): string[] {
  const re = new RegExp(`<${etiqueta}\\b[^>]*>([\\s\\S]*?)</${etiqueta}>`, 'gi');
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const t = (m[1] ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (t) out.push(t);
  }
  return out;
}

function jsonLd(html: string): { ok: boolean; detalle: string }[] {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out: { ok: boolean; detalle: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = (m[1] ?? '').trim();
    try {
      const data = JSON.parse(raw) as unknown;
      const nodos = Array.isArray(data) ? data : [data];
      for (const n of nodos) {
        if (!n || typeof n !== 'object') {
          out.push({ ok: false, detalle: 'nodo que no es un objeto' });
          continue;
        }
        const o = n as Record<string, unknown>;
        if (o['@graph'] && Array.isArray(o['@graph'])) {
          if (!o['@context']) out.push({ ok: false, detalle: 'falta @context en el grafo' });
          for (const g of o['@graph'] as unknown[]) {
            if (!g || typeof g !== 'object' || !(g as Record<string, unknown>)['@type']) {
              out.push({ ok: false, detalle: 'un nodo de @graph no tiene @type' });
            }
          }
          if (o['@context']) out.push({ ok: true, detalle: `@graph (${(o['@graph'] as unknown[]).length})` });
          continue;
        }
        if (!o['@context'] || !o['@type']) out.push({ ok: false, detalle: 'falta @context o @type' });
        else out.push({ ok: true, detalle: String(o['@type']) });
      }
    } catch (e) {
      out.push({ ok: false, detalle: e instanceof Error ? e.message : 'JSON inválido' });
    }
  }
  return out;
}

function h2FueraDeFaqs(html: string): string[] {
  const sinFaq = html.replace(/<div class="faq">[\s\S]*?<\/div>/gi, '');
  return textos(sinFaq, 'h2').filter((t) => t.endsWith('?'));
}

async function main() {
  const sitemap = await pedir('/sitemap.xml');
  if (sitemap.status !== 200) {
    console.error(`sitemap.xml respondió ${sitemap.status}. ¿Está npm run dev en ${BASE}?`);
    process.exit(1);
  }
  const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const loc = m[1] ?? '';
    try {
      return new URL(loc).pathname;
    } catch {
      return loc;
    }
  });

  const rotosSitemap: Problema[] = [];
  const rotosEnlace: Problema[] = [];
  const jsonMal: Problema[] = [];
  const h1Mal: Problema[] = [];
  const metaMal: Problema[] = [];
  const titulos = new Map<string, string[]>();
  const h2Pregunta: Problema[] = [];
  const cache = new Map<string, number>();

  async function estado(ruta: string): Promise<number> {
    const previa = cache.get(ruta);
    if (previa !== undefined) return previa;
    const r = await pedir(ruta);
    cache.set(ruta, r.status);
    return r.status;
  }

  console.log(`${urls.length} URLs en el sitemap.`);
  for (const url of urls) {
    const r = await pedir(url);
    cache.set(url, r.status);
    process.stdout.write(`${r.status} ${url}\n`);
    if (r.status !== 200) {
      rotosSitemap.push({ url, detalle: String(r.status) });
      continue;
    }
    for (const href of enlacesDe(r.html)) {
      const st = await estado(href);
      if (st !== 200) rotosEnlace.push({ url, detalle: `${href} → ${st}` });
    }
    for (const bloque of jsonLd(r.html)) {
      if (!bloque.ok) jsonMal.push({ url, detalle: bloque.detalle });
    }
    const h1 = textos(r.html, 'h1');
    if (h1.length !== 1) h1Mal.push({ url, detalle: `${h1.length} H1${h1.length ? `: ${h1.join(' | ')}` : ''}` });
    const title = textos(r.html, 'title')[0] ?? '';
    const desc = r.html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1]
      ?? r.html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1]
      ?? '';
    if (!title) metaMal.push({ url, detalle: 'sin <title>' });
    if (!desc) metaMal.push({ url, detalle: 'sin meta description' });
    if (title) {
      const lista = titulos.get(title) ?? [];
      lista.push(url);
      titulos.set(title, lista);
    }
    for (const h of h2FueraDeFaqs(r.html)) h2Pregunta.push({ url, detalle: h });
  }

  const titulosRepetidos = [...titulos.entries()].filter(([, pags]) => pags.length > 1);

  const lineas = (items: Problema[]) =>
    items.length ? items.map((p) => `- \`${p.url}\`: ${p.detalle}`).join('\n') : 'Ninguno.';

  const md = `# Comprobación de la web

*Generado por \`npm run web:comprobar\` el ${new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })} contra ${BASE}.*

Páginas del sitemap: **${urls.length}**.

## Sitemap que no da 200

${lineas(rotosSitemap)}

## Enlaces internos rotos

${lineas(rotosEnlace)}

## JSON-LD inválido

${lineas(jsonMal)}

## H1 (debe haber uno)

${lineas(h1Mal)}

## Title o meta description ausentes

${lineas(metaMal)}

## Títulos repetidos

${titulosRepetidos.length ? titulosRepetidos.map(([t, pags]) => `- «${t}»: ${pags.map((p) => `\`${p}\``).join(', ')}`).join('\n') : 'Ninguno.'}

## H2 en forma de pregunta fuera de las FAQs

${h2Pregunta.length} (decisión 27: no debería haber ninguno).

${lineas(h2Pregunta)}
`;

  const destino = path.join(RAIZ, 'docs', 'COMPROBACION-WEB.md');
  writeFileSync(destino, md, 'utf8');
  console.log(`\nInforme: docs/COMPROBACION-WEB.md`);
  console.log(`Rotos sitemap: ${rotosSitemap.length}. Enlaces: ${rotosEnlace.length}. JSON-LD: ${jsonMal.length}. H1: ${h1Mal.length}. Meta: ${metaMal.length}. Títulos repetidos: ${titulosRepetidos.length}. H2 pregunta: ${h2Pregunta.length}.`);
  if (rotosSitemap.length || rotosEnlace.length || jsonMal.length || h1Mal.length || metaMal.length || titulosRepetidos.length) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
