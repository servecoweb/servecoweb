/**
 * Consentimiento de cookies (H1.4). Criterio AEPD del taller (MAPA-PROYECTOS.md § Banner de cookies):
 *  · Rechazar igual de fácil que Aceptar, en la primera capa.
 *  · Nada premarcado: sin elección previa, solo las necesarias.
 * Google Consent Mode v2: todo arranca «denied» (Analitica.tsx) y aquí se actualiza.
 */
export const CLAVE_CONSENTIMIENTO = 'serveco_cookie_consent_v1';
export const EVENTO_ABRIR = 'serveco:abrir-cookies';
/** Se lanza al guardar una elección (lo escucha CapturaVisita). */
export const EVENTO_CONSENTIMIENTO = 'serveco:consentimiento';

export type Consentimiento = {
  necesarias: true;
  analiticas: boolean;
  funcionales: boolean;
  marketing: boolean;
  fecha: string;
  version: 1;
};

export const SOLO_NECESARIAS = { analiticas: false, funcionales: false, marketing: false };
export const TODAS = { analiticas: true, funcionales: true, marketing: true };

type Gtag = (...args: unknown[]) => void;

export function leerConsentimiento(): Consentimiento | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consentimiento;
    return c?.version === 1 ? c : null;
  } catch {
    return null; // modo privado o almacenamiento bloqueado
  }
}

export function aplicarAGoogle(c: Pick<Consentimiento, 'analiticas' | 'marketing'>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  const ads = c.marketing ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: c.analiticas ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

function borrarCookie(nombre: string) {
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
}

export function guardarConsentimiento(eleccion: { analiticas: boolean; funcionales: boolean; marketing: boolean }) {
  if (typeof window === 'undefined') return;
  const c: Consentimiento = { necesarias: true, ...eleccion, fecha: new Date().toISOString(), version: 1 };
  try {
    window.localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(c));
  } catch {
    // sin almacenamiento: la elección vale para esta visita
  }
  aplicarAGoogle(c);
  // Si retira el consentimiento, se borran las cookies ya puestas.
  if (!c.analiticas) {
    borrarCookie('_ga');
    document.cookie.split(';').forEach((k) => {
      const nombre = k.split('=')[0]?.trim();
      if (nombre?.startsWith('_ga_')) borrarCookie(nombre);
    });
  }
  if (!c.marketing) borrarCookie('_gcl_au');
  // Sin analíticas, tampoco se guarda el origen de la visita (mini-CRM).
  if (!c.analiticas) {
    try {
      window.sessionStorage.removeItem('serveco_visita_v1');
    } catch {
      /* almacenamiento bloqueado */
    }
  }
  window.dispatchEvent(new Event(EVENTO_CONSENTIMIENTO));
}

/** Para el enlace «Configurar cookies» del pie. */
export function abrirConfiguracionCookies() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENTO_ABRIR));
}
