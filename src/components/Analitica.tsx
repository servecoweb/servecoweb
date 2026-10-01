import Script from 'next/script';

/**
 * Google Analytics 4 con Consent Mode v2 (H1.5 + H1.4). Solo en la web pública (layouts /es y /en),
 * nunca en /administrator.
 *  · Solo se carga si existe NEXT_PUBLIC_GA_ID (local: G-4KFYS5D4JF). En Vercel hay que poner la misma variable y volver a desplegar.
 *  · En la cola de dataLayer va PRIMERO «consent default = denied», luego la elección guardada
 *    y DESPUÉS el config: gtag.js procesa la cola en orden, llegue cuando llegue.
 *  · Sin consentimiento, GA no instala cookies.
 * Receta del taller: ANALITICA_GOOGLE_NEXT.md.
 */
export default function Analitica() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script id="ga4-consent-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
try {
  var c = JSON.parse(localStorage.getItem('serveco_cookie_consent_v1') || 'null');
  if (c && c.version === 1) {
    var ads = c.marketing ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: c.analiticas ? 'granted' : 'denied',
      ad_storage: ads, ad_user_data: ads, ad_personalization: ads
    });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
