/**
 * MAPA DE REDIRECCIONES del WordPress actual (serveco.es) a la web nueva (H1.6).
 *   npm run seo:redirecciones                       → lee el sitemap público de serveco.es
 *   npm run seo:redirecciones -- --gsc paginas.csv  → + export «Páginas» de Search Console (clics e impresiones)
 *   npm run seo:redirecciones -- --gsc paginas.csv --min-impresiones 20
 *
 * v2 (25 sep, tras la 1.ª pasada de Cursor: 2.789 URLs, 1.526 destinos con reglas demasiado flojas):
 *  1. TIPO de cada URL según el sitemap de Yoast del que sale (page, post, category, tag, author, attachment…).
 *  2. Solo se redirige lo que vale la pena:
 *     · PÁGINAS → equivalente nuevo, comparando PALABRAS ENTERAS del slug (no trozos sueltos en cualquier parte).
 *     · ENTRADAS del blog → /es/blog SOLO si GSC demuestra tráfico (clics > 0 o impresiones ≥ mínimo). Sin GSC, ninguna.
 *     · Adjuntos, autores, etiquetas, paginaciones, feeds, wp-content… → nada (404, que es lo correcto).
 *  3. El HACKEO no se redirige nunca. Lo dudoso NO va a la portada (soft 404): queda para decidir a mano.
 *  4. Aviso si la lista pasa de 300 redirecciones.
 * Escribe src/data/redirecciones.json (lo lee next.config.mjs) y docs/REDIRECCIONES.md (informe). Revisar siempre.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

// Norton/proxy de este PC: el script necesita el .env.local (NODE_TLS_REJECT_UNAUTHORIZED) como el resto.
try {
  process.loadEnvFile?.('.env.local');
} catch {
  /* sin .env.local */
}

const ORIGEN = 'https://serveco.es';
const SITEMAPS = ['/sitemap_index.xml', '/wp-sitemap.xml', '/sitemap.xml'];
const RAIZ = process.cwd(); // ejecutar desde la carpeta webserveco
const AVISO_MAXIMO = 300;

type Tipo = 'page' | 'post' | 'category' | 'tag' | 'author' | 'attachment' | 'otro';
type Fila = { source: string; tipo: Tipo; destination: string | null; motivo: string; spam: boolean; clics: number; impresiones: number };

// ── Hackeo
const SPAM_PALABRAS =
  /casino|slot|apuesta|bet(ting)?\b|poker|bonus|jackpot|ruleta|roulette|viagra|cialis|loan|pr[eé]stamo-r[aá]pido|escort|crypto|bitcoin|forex|replica|outlet|nike|louis|gucci|porn|sex|dating|pharma|pills/i;
const ALFABETO_AJENO = /[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;
function tramoAleatorio(ruta: string): boolean {
  return ruta.split('/').some((t) => {
    if (t.includes('-') || t.length < 12) return false;
    const digitos = (t.match(/\d/g) ?? []).length;
    const mayusInternas = (t.slice(1).match(/[A-Z]/g) ?? []).length;
    return mayusInternas >= 3 || digitos / t.length > 0.3 || t.length >= 40;
  });
}
const esSpam = (ruta: string) => {
  const r = decodeURIComponent(ruta);
  return SPAM_PALABRAS.test(r) || ALFABETO_AJENO.test(r) || tramoAleatorio(r);
};

// ── Lo que nunca se redirige
const NO_REDIRIGIR = /^\/(wp-content|wp-json|wp-admin|wp-includes|feed|comments|xmlrpc)|\/(feed|amp|page\/\d+|embed|trackback)(\/|$)|\/author\/|\/attachment\//i;

// ── Reglas para PÁGINAS: palabras enteras del slug (sin acentos). Orden = prioridad. Destinos que EXISTEN.
const quitarAcentos = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const palabras = (ruta: string) => new Set(quitarAcentos(decodeURIComponent(ruta).toLowerCase()).split(/[^a-z0-9+]+/).filter(Boolean));

const REGLAS: { algunas: string[]; destino: string; motivo: string }[] = [
  { algunas: ['nie'], destino: '/es/internacional/nie', motivo: 'NIE' },
  { algunas: ['irnr', 'residentes', 'residente'], destino: '/es/internacional/impuesto-no-residentes', motivo: 'no residentes' },
  { algunas: ['extranjeros', 'extranjero', 'international', 'expats', 'english'], destino: '/es/internacional', motivo: 'internacional' },
  { algunas: ['benidorm'], destino: '/es/la-firma/despachos/benidorm', motivo: 'despacho' },
  { algunas: ['yecla'], destino: '/es/la-firma/despachos/yecla', motivo: 'despacho' },
  { algunas: ['jumilla'], destino: '/es/la-firma/despachos/jumilla', motivo: 'despacho' },
  { algunas: ['lorca'], destino: '/es/la-firma/despachos/lorca', motivo: 'despacho' },
  { algunas: ['balsicas', 'pacheco'], destino: '/es/la-firma/despachos/balsicas', motivo: 'despacho' },
  { algunas: ['oficinas', 'oficina', 'despachos', 'sedes', 'ubicacion', 'donde'], destino: '/es/la-firma/despachos', motivo: 'despachos' },
  { algunas: ['equipo', 'profesionales'], destino: '/es/la-firma/equipo', motivo: 'equipo' },
  // Sin 'firma': «firma-digital» (firma electrónica) caería aquí por error (probado 25 sep).
  { algunas: ['quienes', 'nosotros', 'historia'], destino: '/es/la-firma', motivo: 'la firma' },
  { algunas: ['contacto', 'contactar', 'contact'], destino: '/es/contacto', motivo: 'contacto' },
  { algunas: ['aviso'], destino: '/es/aviso-legal', motivo: 'legal' },
  { algunas: ['privacidad', 'rgpd', 'lopd'], destino: '/es/privacidad', motivo: 'legal' },
  { algunas: ['cookies'], destino: '/es/cookies', motivo: 'legal' },
  { algunas: ['subvenciones', 'subvencion', 'ayudas', 'fandit'], destino: '/es/subvenciones', motivo: 'subvenciones' },
  { algunas: ['pae', 'emprendedor', 'emprendedores', 'emprender', 'constitucion', 'constituir'], destino: '/es/punto-pae', motivo: 'PAE' },
  { algunas: ['idi', 'i+d+i', 'patent', 'innovacion'], destino: '/es/servicios/idi-patent-box', motivo: 'área' },
  { algunas: ['auditoria', 'auditores'], destino: '/es/servicios/auditoria', motivo: 'área' },
  { algunas: ['formacion', 'fundae', 'bonificada'], destino: '/es/servicios/formacion', motivo: 'área' },
  { algunas: ['financiero', 'financiera', 'financiacion'], destino: '/es/servicios/financiero', motivo: 'área' },
  { algunas: ['contable', 'contabilidad'], destino: '/es/servicios/contable', motivo: 'área' },
  { algunas: ['laboral', 'nominas', 'nomina'], destino: '/es/servicios/laboral', motivo: 'área' },
  { algunas: ['juridico', 'juridica', 'legal', 'abogados', 'abogado'], destino: '/es/servicios/juridico', motivo: 'área' },
  { algunas: ['fiscal', 'fiscalidad', 'impuestos', 'tributaria'], destino: '/es/servicios/fiscal', motivo: 'área' },
  { algunas: ['servicios', 'areas'], destino: '/es/servicios', motivo: 'servicios' },
  { algunas: ['blog', 'noticias', 'actualidad'], destino: '/es/blog', motivo: 'blog' },
];

function destinoPagina(ruta: string): { destination: string | null; motivo: string } {
  if (ruta === '/') return { destination: '/es', motivo: 'portada' };
  const p = palabras(ruta);
  for (const r of REGLAS) if (r.algunas.some((w) => p.has(w))) return { destination: r.destino, motivo: r.motivo };
  return { destination: null, motivo: 'sin equivalente claro: decidir a mano' };
}

// ── Tipo según el sitemap de origen (Yoast: page-sitemap.xml, post-sitemap.xml…; WP: wp-sitemap-posts-page-1.xml…)
function tipoDeSitemap(url: string): Tipo {
  const u = url.toLowerCase();
  if (/page-sitemap|posts-page/.test(u)) return 'page';
  if (/post-sitemap|posts-post/.test(u)) return 'post';
  if (/category-sitemap|taxonomies-category/.test(u)) return 'category';
  if (/tag-sitemap|taxonomies-post_tag/.test(u)) return 'tag';
  if (/author-sitemap|users/.test(u)) return 'author';
  if (/attachment/.test(u)) return 'attachment';
  return 'otro';
}

async function leer(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Serveco-migracion/2.0' } });
    return r.ok ? await r.text() : null;
  } catch {
    return null;
  }
}

async function urlsSitemap(): Promise<Map<string, Tipo>> {
  const paginas = new Map<string, Tipo>();
  let inicio: string | null = null;
  for (const s of SITEMAPS) if (!inicio && (await leer(`${ORIGEN}${s}`))) inicio = `${ORIGEN}${s}`;
  if (!inicio) {
    console.warn('No se encontró ningún sitemap público en serveco.es. Use --gsc con un export de Search Console.');
    return paginas;
  }
  const pendientes: { url: string; tipo: Tipo }[] = [{ url: inicio, tipo: 'otro' }];
  const vistos = new Set<string>();
  while (pendientes.length) {
    const { url, tipo } = pendientes.shift()!;
    if (vistos.has(url)) continue;
    vistos.add(url);
    const xml = await leer(url);
    if (!xml) continue;
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      const l = m[1].replace(/&amp;/g, '&');
      if (/\.xml(\?|$)/.test(l)) pendientes.push({ url: l, tipo: tipoDeSitemap(l) });
      else if (!paginas.has(l)) paginas.set(l, tipo);
    }
  }
  return paginas;
}

/** Export «Páginas» de GSC: 1.ª columna URL, luego Clics e Impresiones (CSV con , o ;). */
function leerGsc(archivo: string): Map<string, { clics: number; impresiones: number }> {
  const out = new Map<string, { clics: number; impresiones: number }>();
  if (!existsSync(archivo)) {
    console.warn(`No existe ${archivo}`);
    return out;
  }
  for (const linea of readFileSync(archivo, 'utf8').split(/\r?\n/)) {
    const c = linea.split(/[;,\t](?=(?:[^"]*"[^"]*")*[^"]*$)/).map((x) => x.replace(/^"|"$/g, '').trim());
    if (!c[0]?.startsWith('http')) continue;
    const num = (s?: string) => Number((s ?? '0').replace(/\./g, '').replace(',', '.')) || 0;
    out.set(c[0], { clics: num(c[1]), impresiones: num(c[2]) });
  }
  return out;
}

const normalizar = (u: string) => {
  try {
    const p = new URL(u);
    if (!/serveco\.es$/.test(p.hostname)) return null;
    return p.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return null;
  }
};

async function main() {
  const arg = (n: string) => {
    const i = process.argv.indexOf(n);
    return i > -1 ? process.argv[i + 1] : undefined;
  };
  const minImp = Number(arg('--min-impresiones') ?? 10);
  const sitemap = await urlsSitemap();
  const gscArchivo = arg('--gsc');
  const gsc = gscArchivo ? leerGsc(gscArchivo) : new Map<string, { clics: number; impresiones: number }>();

  // Tráfico por ruta normalizada
  const trafico = new Map<string, { clics: number; impresiones: number }>();
  for (const [u, t] of gsc) {
    const r = normalizar(u);
    if (!r) continue;
    const prev = trafico.get(r) ?? { clics: 0, impresiones: 0 };
    trafico.set(r, { clics: prev.clics + t.clics, impresiones: prev.impresiones + t.impresiones });
  }

  // Todas las rutas: sitemap + GSC (las de GSC sin sitemap cuentan como 'otro')
  const rutas = new Map<string, Tipo>();
  for (const [u, tipo] of sitemap) {
    const r = normalizar(u);
    if (r) rutas.set(r, tipo);
  }
  for (const r of trafico.keys()) if (!rutas.has(r)) rutas.set(r, 'otro');

  const filas: Fila[] = [];
  for (const [ruta, tipo] of rutas) {
    const t = trafico.get(ruta) ?? { clics: 0, impresiones: 0 };
    const base = { source: ruta, tipo, clics: t.clics, impresiones: t.impresiones };
    if (ruta.startsWith('/es') || ruta.startsWith('/en/') || ruta.startsWith('/administrator')) continue;
    if (esSpam(ruta)) { filas.push({ ...base, destination: null, motivo: 'HACKEO: no se redirige', spam: true }); continue; }
    if (NO_REDIRIGIR.test(ruta) || tipo === 'attachment' || tipo === 'author' || tipo === 'tag') {
      filas.push({ ...base, destination: null, motivo: `no se redirige (${tipo === 'otro' ? 'técnica' : tipo})`, spam: false });
      continue;
    }
    if (!/^[a-zA-Z0-9\-_/.%~]+$/.test(ruta)) {
      filas.push({ ...base, destination: null, motivo: 'caracteres especiales: redirigir a mano', spam: false });
      continue;
    }
    const conTrafico = t.clics > 0 || t.impresiones >= minImp;
    if (tipo === 'post' || tipo === 'category') {
      filas.push(
        conTrafico
          ? { ...base, destination: '/es/blog', motivo: `${tipo} con tráfico en GSC → blog (revisar si hay artículo equivalente)`, spam: false }
          : { ...base, destination: null, motivo: gsc.size ? `${tipo} sin tráfico: 404` : `${tipo}: sin datos de GSC, no se redirige`, spam: false },
      );
      continue;
    }
    // Páginas (o 'otro'): equivalente por palabras enteras
    filas.push({ ...base, ...destinoPagina(ruta), spam: false });
  }
  filas.sort((a, b) => b.clics - a.clics || b.impresiones - a.impresiones || a.source.localeCompare(b.source));

  const redirecciones = filas
    .filter((f) => !f.spam && f.destination && f.source !== '/')
    .map((f) => ({ source: f.source, destination: f.destination, permanent: true }));
  writeFileSync(path.join(RAIZ, 'src/data/redirecciones.json'), JSON.stringify(redirecciones, null, 2) + '\n');

  const con = filas.filter((f) => !f.spam && f.destination);
  const dudas = filas.filter((f) => !f.spam && !f.destination && /decidir|especiales/.test(f.motivo));
  const nada = filas.filter((f) => !f.spam && !f.destination && !/decidir|especiales/.test(f.motivo));
  const spam = filas.filter((f) => f.spam);
  const traf = (f: Fila) => (gsc.size ? ` ${f.clics} / ${f.impresiones} |` : '');
  const cab = (conDestino: boolean) =>
    `| URL antigua | Tipo |${gsc.size ? ' Clics / impr. |' : ''}${conDestino ? ' Destino |' : ''} Motivo |\n|---|---|${gsc.size ? '---|' : ''}${conDestino ? '---|' : ''}---|\n`;
  const tabla = (xs: Fila[], conDestino: boolean, max = 400) =>
    xs.length
      ? cab(conDestino) +
        xs.slice(0, max).map((f) => `| \`${f.source}\` | ${f.tipo} |${traf(f)}${conDestino ? ` \`${f.destination}\` |` : ''} ${f.motivo} |`).join('\n') +
        (xs.length > max ? `\n\n_…y ${xs.length - max} más (ver src/data/redirecciones.json)._` : '')
      : '_Ninguna._';

  const md = `# Mapa de redirecciones serveco.es → web nueva (v2)

*Generado por \`scripts/mapa-redirecciones.ts\` el ${new Date().toLocaleString('es-ES')}. ${rutas.size} URLs (${sitemap.size} del sitemap${gsc.size ? `, ${gsc.size} filas de GSC, mínimo ${minImp} impresiones` : ', **sin datos de GSC**'}).*

${redirecciones.length > AVISO_MAXIMO ? `> ⚠️ **${redirecciones.length} redirecciones**: son muchas. Revisar sobre todo las de menos tráfico; si no aportan, mejor 404.\n` : ''}${!gsc.size ? '> Sin export de Search Console **ninguna entrada del blog se redirige**. Pedir a Serveco acceso a GSC (o el export de «Páginas» de 16 meses) y repetir con `--gsc`.\n' : ''}
**Antes de publicar:** revisar la tabla 1, decidir la 2 a mano (editar \`src/data/redirecciones.json\`), y comprobar por encima la 3 y la 4.

## 1. Se redirigen (${con.length})

${tabla(con, true)}

## 2. Dudas: decidir a mano (${dudas.length})

Si no hay equivalente, mejor 404 que la portada (soft 404).

${tabla(dudas, false)}

## 3. No se redirigen (${nada.length}): adjuntos, autores, etiquetas, entradas sin tráfico, técnicas

${tabla(nada, false, 150)}

## 4. Hackeo (${spam.length})

${tabla(spam, false, 150)}
`;
  writeFileSync(path.join(RAIZ, 'docs/REDIRECCIONES.md'), md);

  console.log(`URLs ${rutas.size} · se redirigen ${con.length} · dudas ${dudas.length} · no se redirigen ${nada.length} · hackeo ${spam.length}`);
  if (redirecciones.length > AVISO_MAXIMO) console.warn(`Aviso: ${redirecciones.length} redirecciones (más de ${AVISO_MAXIMO}). Revíselas.`);
  if (!gsc.size) console.warn('Sin GSC: ninguna entrada del blog se redirige. Repita con --gsc paginas.csv cuando tenga el export.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
