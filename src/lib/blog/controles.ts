/**
 * Controles AUTOMÁTICOS del redactor (código, no IA: el modelo no se los puede saltar).
 *  · Retira enlaces internos a páginas que no existen y externos a dominios no oficiales.
 *  · Avisa de: longitud, estructura, enlaces, fuentes, frases prohibidas y riesgos jurídicos.
 * Los avisos se guardan en blog_articles.avisos y se ven en el panel.
 */
import {
  DOMINIOS_OFICIALES,
  FRASES_PROHIBIDAS,
  PALABRAS_MAX,
  PALABRAS_MIN,
  PATRONES_RIESGO,
  enlacesInternos,
} from './editorial';

export type Aviso = { nivel: 'grave' | 'aviso'; texto: string };

export function contarPalabras(md: string): number {
  return md.replace(/[#*_`>|\-[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function dominioOficial(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return DOMINIOS_OFICIALES.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

/** Quita fences y un posible H1/título repetido al principio. */
export function limpiarMarkdown(raw: string, titulo: string): string {
  let t = raw.trim();
  const fence = /```(?:markdown|md)?\s*([\s\S]*?)```/i.exec(t);
  if (fence?.[1]?.trim()) t = fence[1].trim();
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
  const cabecera = /^(#{1,2})\s+(.+)\n+/.exec(t);
  if (cabecera && (cabecera[1] === '#' || norm(cabecera[2] ?? '') === norm(titulo))) t = t.slice(cabecera[0].length).trimStart();
  return t;
}

export function controlar(md: string, fuentes: { titulo: string; url: string }[]): { md: string; avisos: Aviso[] } {
  const avisos: Aviso[] = [];
  const permitidos = new Set(enlacesInternos().map((l) => l.href));
  let internos = 0;
  let externos = 0;

  // 1) Enlaces: se retiran los no permitidos (queda el texto).
  const limpio = md.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (todo, texto: string, href: string) => {
    const ruta = href.split('#')[0] ?? href;
    if (href.startsWith('/')) {
      if (permitidos.has(ruta)) {
        internos++;
        return todo;
      }
      avisos.push({ nivel: 'aviso', texto: `Enlace interno retirado (la página no existe): ${href}` });
      return texto;
    }
    if (/^https?:\/\//i.test(href)) {
      if (dominioOficial(href)) {
        externos++;
        return todo;
      }
      avisos.push({ nivel: 'aviso', texto: `Enlace externo retirado (no es fuente oficial): ${href}` });
      return texto;
    }
    return texto;
  });

  // 2) Longitud y estructura.
  const palabras = contarPalabras(limpio);
  if (palabras < PALABRAS_MIN || palabras > PALABRAS_MAX) {
    avisos.push({ nivel: 'aviso', texto: `Longitud ${palabras} palabras (objetivo ${PALABRAS_MIN}-${PALABRAS_MAX}).` });
  }
  const h2 = (limpio.match(/^##\s+/gm) ?? []).length;
  if (h2 < 4) avisos.push({ nivel: 'aviso', texto: `Solo ${h2} apartados ## (mínimo 4).` });
  // Apartados en forma de pregunta + bloque de FAQs = texto de interrogatorio (criterio de Narciso, 24 sep).
  const h2Pregunta = (limpio.match(/^##\s+¿[^\n]*\?\s*$/gm) ?? []).length;
  if (h2Pregunta > 1) {
    avisos.push({ nivel: 'aviso', texto: `${h2Pregunta} apartados ## en forma de pregunta: reformular en afirmativo (las preguntas van en las FAQs).` });
  }
  if (!/^##\s+En resumen/im.test(limpio)) avisos.push({ nivel: 'aviso', texto: 'Falta el apartado «En resumen».' });
  if (/^#\s+/m.test(limpio)) avisos.push({ nivel: 'aviso', texto: 'Hay un encabezado # (H1) en el cuerpo: la página ya tiene título.' });

  // 3) Enlaces y fuentes.
  if (internos < 2) avisos.push({ nivel: 'aviso', texto: `Solo ${internos} enlace(s) interno(s) (objetivo 3-5).` });
  const fuentesOficiales = fuentes.filter((f) => dominioOficial(f.url));
  if (externos === 0 && fuentesOficiales.length === 0) {
    avisos.push({ nivel: 'grave', texto: 'No cita ninguna fuente oficial. Un artículo jurídico sin fuente no se publica.' });
  }
  if (fuentes.length > fuentesOficiales.length) {
    avisos.push({ nivel: 'aviso', texto: 'Alguna fuente del listado no es de un dominio oficial: revisar.' });
  }

  // 4) Frases prohibidas.
  const bajo = limpio.toLowerCase();
  const halladas = FRASES_PROHIBIDAS.filter((f) => bajo.includes(f));
  if (halladas.length) avisos.push({ nivel: 'aviso', texto: `Frases de relleno: ${halladas.map((f) => `«${f}»`).join(', ')}.` });

  // 5) Riesgos jurídicos.
  for (const r of PATRONES_RIESGO) if (r.patron.test(limpio)) avisos.push({ nivel: 'grave', texto: r.motivo });

  // 6) Cifras sin vigencia (heurística): hay € o % pero no aparece «a fecha de» ni «ejercicio».
  if (/(\d[\d.,]*\s?(€|euros|%))/i.test(limpio) && !/(a fecha de|ejercicio \d{4}|en \d{4})/i.test(limpio)) {
    avisos.push({ nivel: 'grave', texto: 'Hay cifras (€ o %) sin indicar a qué fecha o ejercicio se refieren.' });
  }

  return { md: limpio, avisos };
}
