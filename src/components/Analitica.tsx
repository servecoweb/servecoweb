import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * Google Analytics 4 (molde del taller: ANALITICA_GOOGLE_NEXT.md).
 * Solo en la web pública (layouts /es y /en), nunca en /administrator.
 * El Consent Mode v2 va en el <head> del layout raíz, antes de este componente:
 * gtag.js llega después y procesa la cola (default denied, y update si ya había elección).
 * Acepta el nombre del taller (NEXT_PUBLIC_GA_MEASUREMENT_ID) o el que ya está en Vercel (NEXT_PUBLIC_GA_ID).
 */
export function idMedicion() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || '';
}

/** Primer HTML. Misma clave que consentimiento.ts. */
export const GA_CONSENT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('serveco_cookie_consent_v1')||'null');if(c&&c.version===1){var ads=c.marketing?'granted':'denied';gtag('consent','update',{analytics_storage:c.analiticas?'granted':'denied',ad_storage:ads,ad_user_data:ads,ad_personalization:ads});}}catch(e){}`;

export function ScriptConsentimiento() {
  if (!idMedicion()) return null;
  return <script id="ga-consent-default" dangerouslySetInnerHTML={{ __html: GA_CONSENT_SCRIPT }} />;
}

export default function Analitica() {
  const id = idMedicion();
  if (!id) return null;
  return <GoogleAnalytics gaId={id} />;
}
