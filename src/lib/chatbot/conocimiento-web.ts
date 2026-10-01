/**
 * Conocimiento del chat sacado del CONTENIDO SEO de la web (src/data/*-seo.ts), en español E INGLÉS.
 * Motivo (25 sep): el chat solo conocía los textos cortos de Supabase y no sabía lo que dice la propia web;
 * en inglés, casi no tenía nada. Estos archivos son lo que se publica (las páginas se pintan desde ellos).
 * Cada página da 2 fragmentos (contenido + preguntas frecuentes), con su «Página:» e idioma.
 * Lo usa ingesta.ts. Cuando el contenido pase a Supabase, esta pieza lo leerá de allí.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';
import { AREAS } from '@/data/areas';
import { AREAS_SEO } from '@/data/areas-seo';
import { AREAS_SEO_EN } from '@/data/areas-seo-en';
import { INTL } from '@/data/internacional';
import { INTL_SEO } from '@/data/intl-seo';
import { SEDES_SEO } from '@/data/sedes-seo';
import { PAE_SEO, SUBVENCIONES_SEO } from '@/data/paginas-seo';
import { HUB_SEO } from '@/data/hub-seo';
import { LANDINGS } from '@/data/landings';
import { ES, EN } from '@/lib/rutas';

export type Chunk = { source: string; slug: string; content: string };

function cuerpo(p: Pick<PaginaSeo, 'h1' | 'lead' | 'secciones'>): string {
  return [
    `${p.h1}. ${p.lead}`,
    ...p.secciones.map((s) =>
      [s.h2, ...s.parrafos, ...(s.lista ?? []).map((i) => `- ${i.t}: ${i.d}`)].join('\n'),
    ),
  ].join('\n\n');
}

const faqs = (p: Pick<PaginaSeo, 'faqs'>, en: boolean) =>
  p.faqs.map((f) => `${en ? 'Q' : 'P'}: ${f.q}\n${en ? 'A' : 'R'}: ${f.a}`).join('\n\n');

/** Dos fragmentos por página: contenido y FAQs. `idioma` va en la cabecera para que el chat elija bien. */
function paginaAChunks(source: string, slug: string, p: Pick<PaginaSeo, 'h1' | 'lead' | 'secciones' | 'faqs'>, ruta: string, en: boolean): Chunk[] {
  const cab = en ? `[ENGLISH PAGE] Page: ${ruta}` : `[PÁGINA EN ESPAÑOL] Página: ${ruta}`;
  const out: Chunk[] = [{ source, slug, content: `${cab}\n${cuerpo(p).slice(0, 6500)}` }];
  if (p.faqs.length) out.push({ source, slug: `${slug}--faqs`, content: `${cab}\n${en ? 'Frequently asked questions' : 'Preguntas frecuentes'} · ${p.h1}\n${faqs(p, en)}` });
  return out;
}

export function chunksContenidoWeb(): Chunk[] {
  const out: Chunk[] = [];

  for (const a of AREAS) {
    const es = AREAS_SEO[a.slug];
    if (es) out.push(...paginaAChunks('web-area', a.slug, es, ES.area(a.slug), false));
    const en = AREAS_SEO_EN[a.slug];
    if (en) out.push(...paginaAChunks('web-area-en', a.slug, en, EN.area(a.slugEn), true));
  }

  const portada = INTL_SEO.portada;
  out.push(...paginaAChunks('web-intl', 'portada', portada.es, ES.internacional, false));
  out.push(...paginaAChunks('web-intl-en', 'portada', portada.en, EN.international, true));
  for (const p of INTL) {
    const seo = INTL_SEO[p.slug as keyof typeof INTL_SEO];
    if (!seo) continue;
    out.push(...paginaAChunks('web-intl', p.slug, seo.es, ES.intl(p.slug), false));
    out.push(...paginaAChunks('web-intl-en', p.slug, seo.en, EN.intl(p.slugEn), true));
  }

  for (const [slug, s] of Object.entries(SEDES_SEO)) {
    out.push(...paginaAChunks('web-sede', slug, s, ES.sede(slug), false));
  }

  out.push(...paginaAChunks('web-pagina', 'punto-pae', PAE_SEO, ES.pae, false));
  out.push(...paginaAChunks('web-pagina', 'subvenciones', SUBVENCIONES_SEO, ES.subvenciones, false));

  // Landings área × sede (las 12 propuestas; Supabase solo tiene los 2 ejemplos antiguos).
  for (const l of LANDINGS) {
    out.push(...paginaAChunks('web-landing', `${l.area}-${l.sede}`, l, ES.landing(l.area, l.sede), false));
  }

  // Página de servicios + guía «¿Qué necesita?» (situación → página): enseña al chat a dónde enviar cada caso.
  for (const [lang, h] of [['es', HUB_SEO.es], ['en', HUB_SEO.en]] as const) {
    const en = lang === 'en';
    out.push(...paginaAChunks(en ? 'web-hub-en' : 'web-hub', 'servicios', h, en ? EN.services : ES.servicios, en));
    out.push({
      source: en ? 'web-hub-en' : 'web-hub',
      slug: 'guia',
      content:
        `${en ? '[ENGLISH PAGE] Guide: which service do I need?' : '[PÁGINA EN ESPAÑOL] Guía: ¿qué servicio necesito?'}\n` +
        h.guia.map((g) => `- ${g.situacion} → ${g.destino}: ${g.href}`).join('\n'),
    });
  }

  return out;
}
