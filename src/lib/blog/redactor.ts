/**
 * AGENTE REDACTOR del blog de Serveco (partida 07). Crea un artículo NUEVO a partir de un tema.
 *
 *  1. PLAN          chatJson(promptPlan)      → título, slug, esquema, fuentes, solapamiento
 *  2. REDACCIÓN     Responses + web_search    → borrador verificado en fuentes oficiales
 *  3. EDITOR        chatJson(promptEditor)    → cuerpo final + SEO + FAQs + fuentes + puntos de revisión
 *  4. CONTROLES     controlar() (código)      → retira enlaces no permitidos, genera avisos
 *  5. GUARDADO      blog_articles, SIEMPRE status 'draft' (publicar exige revisión de un abogado)
 *  6. PORTADA       gpt-image-2 → Storage «blog»
 *
 * Lo usan el panel (/administrator/blog) y el script `npm run blog:redactar`.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { AREAS } from '../../data/areas';
import { MODELO_TEXTO, promptEditor, promptPlan, promptRedactor } from './editorial';
import { chatJson, conReintentos, redactarConBusqueda } from './openai';
import { controlar, contarPalabras, limpiarMarkdown, type Aviso } from './controles';
import { generarPortada } from './portada';

type Plan = {
  titulo: string;
  slug: string;
  palabra_clave: string;
  intencion: string;
  publico: string;
  area: string;
  esquema: string[];
  fuentes_a_consultar: string[];
  solapamiento: string;
};

type Editado = {
  titulo: string;
  seo_title: string;
  slug: string;
  extracto: string;
  meta_description: string;
  palabra_clave: string;
  cuerpo_markdown: string;
  faqs: { q: string; a: string }[];
  fuentes: { titulo: string; url: string }[];
  puntos_revision: string[];
  portada_brief: string;
  portada_alt: string;
};

export type ResultadoRedaccion = {
  id: string;
  slug: string;
  titulo: string;
  palabras: number;
  avisos: Aviso[];
  portada: boolean;
};

export function slugificar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const recortar = (s: string, max: number) => {
  const t = (s ?? '').trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  const esp = corte.lastIndexOf(' ');
  return (esp > max * 0.6 ? corte.slice(0, esp) : corte).trim();
};

export async function redactarArticulo(opts: {
  db: SupabaseClient;
  tema: string;
  area?: string;
  notas?: string;
  /** Si se indica, el plan y el editor no pueden cambiar este título. */
  tituloFijo?: string;
  /** Si se indica, actualiza esa fila (mismo slug) en vez de crear otra. */
  actualizarId?: string;
  /** Por defecto genera la portada. En una reescritura se puede dejar para después. */
  sinPortada?: boolean;
  log?: (m: string) => void;
}): Promise<ResultadoRedaccion> {
  const log = opts.log ?? ((m: string) => console.log(m));
  const { db } = opts;
  const tema = opts.tema.trim();
  const tituloFijo = opts.tituloFijo?.trim();
  if ((tituloFijo || tema).length < 8) throw new Error('El tema es demasiado corto: describa de qué debe tratar el artículo.');

  const { data: existentes } = await db.from('blog_articles').select('id, slug, title');
  const listaExistentes = (existentes ?? []).map((e) => `- ${e.title} (${e.slug})`).join('\n') || '(ninguno)';

  // 1) PLAN
  log('1/6 Planificando…');
  const plan = await conReintentos(
    () =>
      chatJson<Plan>(
        promptPlan(),
        `TEMA: ${tema}\nÁREA sugerida: ${opts.area || 'la que mejor encaje'}\nNOTAS DEL DESPACHO: ${opts.notas?.trim() || '(ninguna)'}\n${tituloFijo ? `TÍTULO OBLIGATORIO (cópialo tal cual en "titulo"; no lo acortes ni lo reformules): ${tituloFijo}\n` : ''}\nARTÍCULOS YA PUBLICADOS O EN BORRADOR:\n${listaExistentes}`,
        4_000,
        'medium',
      ),
    log,
  );
  if (tituloFijo) plan.titulo = tituloFijo;
  log(`   «${plan.titulo}» · ${plan.esquema?.length ?? 0} apartados · solapamiento: ${plan.solapamiento}`);

  // 2) REDACCIÓN con búsqueda en fuentes oficiales
  log('2/6 Redactando con búsqueda en fuentes oficiales (puede tardar 2-5 min)…');
  const entrada = [
    `TÍTULO (no lo repitas como encabezado): ${plan.titulo}`,
    `PALABRA CLAVE: ${plan.palabra_clave}`,
    `INTENCIÓN: ${plan.intencion}`,
    `PÚBLICO: ${plan.publico}`,
    `ESQUEMA (apartados ##):\n${(plan.esquema ?? []).map((h) => `- ${h}`).join('\n')}`,
    `FUENTES A VERIFICAR:\n${(plan.fuentes_a_consultar ?? []).map((f) => `- ${f}`).join('\n')}`,
    `NOTAS DEL DESPACHO: ${opts.notas?.trim() || '(ninguna)'}`,
    '',
    'Redacta ahora el artículo completo en Markdown.',
  ].join('\n');
  const borrador = limpiarMarkdown(await conReintentos(() => redactarConBusqueda(promptRedactor(), entrada, log), log), plan.titulo);
  log(`   Borrador: ${contarPalabras(borrador)} palabras`);

  // 3) EDITOR JURÍDICO
  log('3/6 Revisión editorial y jurídica…');
  let ed: Editado | null = null;
  try {
    ed = await conReintentos(
      () =>
        chatJson<Editado>(
          promptEditor(),
          `TÍTULO PLANIFICADO: ${plan.titulo}\n${tituloFijo ? 'El campo "titulo" del JSON debe ser EXACTAMENTE el título planificado, sin cambiar ni un carácter.\n' : ''}PALABRA CLAVE: ${plan.palabra_clave}\n\n## BORRADOR\n${borrador}`,
          16_000,
        ),
      log,
    );
  } catch (err) {
    log(`   El editor falló (${err instanceof Error ? err.message : err}): se guarda el borrador con aviso.`);
  }

  const titulo = tituloFijo || recortar(ed?.titulo || plan.titulo, 90);
  const cuerpoBase = limpiarMarkdown(ed?.cuerpo_markdown || borrador, titulo);
  const fuentes = Array.isArray(ed?.fuentes) ? ed!.fuentes.filter((f) => f?.url) : [];

  // 4) CONTROLES automáticos
  log('4/6 Controles automáticos…');
  const { md, avisos } = controlar(cuerpoBase, fuentes);
  if (!ed) avisos.unshift({ nivel: 'grave', texto: 'La revisión editorial falló: es el borrador sin editar.' });
  const palabras = contarPalabras(md);
  log(`   ${palabras} palabras · ${avisos.length} aviso(s)`);

  // 5) GUARDADO (siempre borrador)
  log('5/6 Guardando como borrador…');
  let slug = slugificar(ed?.slug || plan.slug || titulo);
  const ocupados = new Set((existentes ?? []).map((e) => String(e.slug)));
  let filaId = opts.actualizarId;
  if (filaId) {
    const actual = (existentes ?? []).find((e) => String(e.id) === filaId);
    if (!actual) throw new Error('No está el artículo que hay que reescribir.');
    slug = String(actual.slug);
  } else {
    for (let n = 2; ocupados.has(slug); n++) slug = `${slugificar(ed?.slug || plan.slug || titulo)}-${n}`;
  }

  const areaValida = AREAS.find((a) => a.slug === (plan.area || opts.area));
  const html = marked.parse(md, { async: false }) as string;
  const campos = {
    slug,
    title: titulo,
    seo_title: recortar(ed?.seo_title || titulo, 60),
    excerpt: recortar(ed?.extracto || '', 200),
    meta_description: recortar(ed?.meta_description || ed?.extracto || '', 160),
    focus_keyword: ed?.palabra_clave || plan.palabra_clave,
    area_slug: areaValida?.slug ?? null,
    category: areaValida?.nombre ?? '',
    body_md: md,
    body: html,
    faqs: Array.isArray(ed?.faqs) ? ed!.faqs.slice(0, 4) : [],
    fuentes,
    avisos,
    puntos_revision: Array.isArray(ed?.puntos_revision) ? ed!.puntos_revision : ['Revisar todo el artículo: la revisión editorial falló.'],
    cover_alt: recortar(ed?.portada_alt || titulo, 120),
    status: 'draft' as const,
    revisado_por: null,
    revisado_at: null,
    generado_con: `${MODELO_TEXTO} + web_search · ${new Date().toISOString()}`,
    actualizado_a: new Date().toISOString().slice(0, 10),
  };

  const { data: fila, error } = filaId
    ? await db.from('blog_articles').update(campos).eq('id', filaId).select('id').single()
    : await db.from('blog_articles').insert(campos).select('id').single();
  if (error || !fila) throw new Error(`No se pudo guardar el artículo: ${error?.message}`);
  filaId = String(fila.id);

  // 6) PORTADA (si falla, el artículo queda guardado igualmente)
  let portada = false;
  if (opts.sinPortada) {
    if (ed?.portada_brief) await db.from('blog_articles').update({ cover_prompt: ed.portada_brief }).eq('id', filaId);
    log('6/6 Portada pendiente (se genera aparte).');
  } else {
  log('6/6 Generando portada…');
  try {
    const brief = ed?.portada_brief || `Escena sobria que ilustre: ${titulo}`;
    const { url } = await conReintentos(() => generarPortada(db, slug, brief), log, 2);
    await db.from('blog_articles').update({ cover_url: url, cover_prompt: brief }).eq('id', filaId);
    portada = true;
  } catch (err) {
    const texto = `No se pudo generar la portada: ${err instanceof Error ? err.message : err}. Se puede regenerar desde el panel.`;
    await db.from('blog_articles').update({ avisos: [...avisos, { nivel: 'aviso', texto }] }).eq('id', filaId);
    log(`   ${texto}`);
  }
  }

  log(`Listo: /es/blog/${slug} (borrador).`);
  return { id: filaId, slug, titulo, palabras, avisos, portada };
}

/** Vuelve a convertir el Markdown a HTML y a pasar los controles (tras editar a mano en el panel). */
export function reprocesar(md: string, fuentes: { titulo: string; url: string }[]) {
  const { md: limpio, avisos } = controlar(md, fuentes);
  return { md: limpio, html: marked.parse(limpio, { async: false }) as string, avisos };
}
