/**
 * Anti-spam SILENCIOSO del formulario (molde del taller: Eskala 31 ago · GVC/ACTTAX 2-3 sep ·
 * oleada Savin Kumar / FactuON 9 sep · Neotérmica `src/lib/spam.ts`). Adaptado a Serveco 24 sep.
 * Sin captcha: el visitante no ve nada; el bot recibe «enviado» y no se genera consulta ni correo.
 * Lo filtrado va a `contact_spam` (30 días) para poder recuperar un falso positivo desde el panel.
 * El honeypot solo caza bots tontos; los listos se pillan por el contenido.
 */
export type SpamInput = {
  nombre: string;
  email: string;
  mensaje: string;
  empresa?: string;
  website: string; // honeypot 1
  fax: string; // honeypot 2
  inicio: number; // marca de tiempo al pintar el formulario
};

export type Motivo =
  | 'honeypot'
  | 'sin_marca_tiempo'
  | 'demasiado_rapido'
  | 'formulario_caducado'
  | 'token_aleatorio'
  | 'gmail_puntos'
  | 'pitch_marketing'
  | 'oferta_seo_web'
  | 'exceso_enlaces'
  | 'alfabeto_ajeno'
  | 'duplicado';

export const MOTIVOS: Record<Motivo, string> = {
  honeypot: 'Rellenó un campo invisible (bot)',
  sin_marca_tiempo: 'Envío sin pasar por el formulario',
  demasiado_rapido: 'Enviado en menos de 3 segundos',
  formulario_caducado: 'Formulario abierto más de un día',
  token_aleatorio: 'Nombre o mensaje con cadenas aleatorias',
  gmail_puntos: 'Gmail con muchos puntos (alias generado)',
  pitch_marketing: 'Venta comercial (redactores, enlaces, demos, precios)',
  oferta_seo_web: 'Oferta de SEO / diseño web',
  exceso_enlaces: 'Dos o más enlaces en el mensaje',
  alfabeto_ajeno: 'Texto en alfabeto cirílico, chino, etc.',
  duplicado: 'Misma consulta repetida en pocos minutos',
};

const MIN_MS = 3000;
const MAX_MS = 24 * 60 * 60 * 1000;

/** Una sola palabra con mayúsculas en medio: iNgXrKYUMiecBwtr. */
function pareceTokenMezclado(v: string): boolean {
  const t = v.trim();
  if (t.length < 12 || /\s/.test(t) || !/^[A-Za-z0-9]+$/.test(t)) return false;
  const interiores = t.slice(1).replace(/[^A-Z]/g, '').length;
  return interiores >= 3 && (t.match(/[a-z]/g) ?? []).length >= 3;
}

/** Palabras largas casi sin vocales (xkqwprtzvbn…). */
function pareceTokenSinVocales(texto: string): boolean {
  return texto
    .split(/\s+/)
    .filter((w) => w.length >= 10)
    .some((w) => {
      const l = w.replace(/[^a-zA-Z]/g, '');
      if (l.length < 10) return false;
      return (l.match(/[aeiouAEIOU]/g) ?? []).length / l.length < 0.2;
    });
}

/** Gmail con 4 o más puntos en la parte local: alias generado. */
function gmailConPuntos(email: string): boolean {
  const [local = '', dominio = ''] = email.toLowerCase().split('@');
  if (!dominio.startsWith('gmail.') && dominio !== 'googlemail.com') return false;
  return (local.match(/\./g) ?? []).length >= 4;
}

/** Venta fría B2B (molde del taller). */
function parecePitchMarketing(m: string): boolean {
  if (m.includes('calendly.com')) return true;
  if (/freelance writer|writing projects|thought leadership|press releases/.test(m)) return true;
  if (/guest posts?|link building|backlinks?|dofollow|do-follow|write for (us|your website)|sponsored post/.test(m)) return true;
  if (/prueba gratuita|tarjeta bancaria|demo r[aá]pida|agend(ar|a) (una )?demo|free trial|book a (demo|call)/.test(m)) return true;
  if (/desde\s+\d+([.,]\d+)?\s*€\s*\/\s*(mes|factura|año|empleado|usuario)/.test(m)) return true;
  const enlaces = m.match(/https?:\/\/[^\s]+/g) ?? [];
  return enlaces.some((l) => /pricing|demo|youtube\.com|youtu\.be|bit\.ly|wa\.me/.test(l));
}

/** Ofertas de SEO y diseño web: a una asesoría le llegan a diario; ningún cliente escribe así. */
function pareceOfertaSeoWeb(m: string): boolean {
  return /primera p[aá]gina de google|posicionamiento (web|seo|en google)|mejorar (su|tu) posicionamiento|(auditor[ií]a|an[aá]lisis) seo (gratuit|gratis)|dise[nñ]o (de p[aá]ginas? )?web (profesional|a medida|econ[oó]mic)|redise[nñ]o de (su|tu) (web|p[aá]gina)|first page of google|seo (services|audit|agency)|web design services|increase (your )?(traffic|sales|ranking)/.test(
    m,
  );
}

/** Serveco atiende en español e inglés: texto mayoritariamente cirílico, CJK, árabe… = spam. */
function alfabetoAjeno(texto: string): boolean {
  const ajenos = (texto.match(/[\u0400-\u04FF\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/g) ?? []).length;
  const letras = (texto.match(/\p{L}/gu) ?? []).length;
  return letras > 0 && ajenos / letras > 0.3;
}

/** Filtros que no necesitan la base de datos. El duplicado se comprueba aparte (contacto.ts). */
export function detectarSpam(i: SpamInput): { spam: false } | { spam: true; motivo: Motivo } {
  if (i.website.trim() !== '' || i.fax.trim() !== '') return { spam: true, motivo: 'honeypot' };

  if (!i.inicio || !Number.isFinite(i.inicio)) return { spam: true, motivo: 'sin_marca_tiempo' };
  const transcurrido = Date.now() - i.inicio;
  if (transcurrido < MIN_MS) return { spam: true, motivo: 'demasiado_rapido' };
  if (transcurrido > MAX_MS) return { spam: true, motivo: 'formulario_caducado' };

  if (pareceTokenMezclado(i.nombre) || pareceTokenMezclado(i.mensaje) || pareceTokenSinVocales(`${i.nombre} ${i.mensaje}`)) {
    return { spam: true, motivo: 'token_aleatorio' };
  }
  if (gmailConPuntos(i.email)) return { spam: true, motivo: 'gmail_puntos' };
  if (alfabetoAjeno(`${i.nombre} ${i.mensaje}`)) return { spam: true, motivo: 'alfabeto_ajeno' };

  const m = i.mensaje.toLowerCase();
  if (parecePitchMarketing(m)) return { spam: true, motivo: 'pitch_marketing' };
  if (pareceOfertaSeoWeb(m)) return { spam: true, motivo: 'oferta_seo_web' };
  if ((m.match(/https?:\/\//g) ?? []).length >= 2) return { spam: true, motivo: 'exceso_enlaces' };

  return { spam: false };
}
