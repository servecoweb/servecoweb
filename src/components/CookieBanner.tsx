'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  EVENTO_ABRIR,
  SOLO_NECESARIAS,
  TODAS,
  aplicarAGoogle,
  guardarConsentimiento,
  leerConsentimiento,
} from '@/lib/consentimiento';
import { ES, EN } from '@/lib/rutas';

/**
 * Banner de cookies (H1.4). Molde Furgocasa + criterio AEPD del taller:
 *  · Barra: Configurar · Rechazar todas · Aceptar todas (Rechazar = mismo peso que Aceptar).
 *  · Modal: 4 categorías; analíticas/funcionales/marketing APAGADAS por defecto.
 */
type Vista = 'oculto' | 'barra' | 'ajustes';
type Eleccion = { analiticas: boolean; funcionales: boolean; marketing: boolean };

const T = {
  es: {
    region: 'Aviso de cookies',
    titulo: 'Utilizamos cookies',
    texto: 'Usamos cookies propias y de terceros para que la web funcione, medir las visitas y, si nos lo permite, personalizar contenidos. Puede aceptarlas, rechazarlas o configurar sus preferencias.',
    politica: 'Política de cookies',
    configurar: 'Configurar',
    rechazar: 'Rechazar todas',
    aceptar: 'Aceptar todas',
    guardar: 'Guardar preferencias',
    ajustesTitulo: 'Configuración de cookies',
    ajustesIntro: 'Elija qué cookies acepta. Las necesarias no se pueden desactivar porque sin ellas la web no funciona.',
    cerrar: 'Cerrar',
    siempre: 'Siempre activas',
    mas: 'Más información en la',
    cats: [
      { id: 'necesarias', nombre: 'Cookies necesarias', desc: 'Imprescindibles para que la web funcione (por ejemplo, recordar esta elección).' },
      { id: 'analiticas', nombre: 'Cookies analíticas', desc: 'Nos permiten contar las visitas y ver cómo se usa la web para mejorarla (Google Analytics).' },
      { id: 'funcionales', nombre: 'Cookies funcionales', desc: 'Recuerdan sus preferencias para una experiencia más cómoda.' },
      { id: 'marketing', nombre: 'Cookies de marketing', desc: 'Sirven para mostrar anuncios relevantes y medir campañas publicitarias.' },
    ],
  },
  en: {
    region: 'Cookie notice',
    titulo: 'We use cookies',
    texto: 'We use our own and third-party cookies to make the site work, measure visits and, with your permission, personalise content. You can accept them, reject them or set your preferences.',
    politica: 'Cookie policy',
    configurar: 'Settings',
    rechazar: 'Reject all',
    aceptar: 'Accept all',
    guardar: 'Save preferences',
    ajustesTitulo: 'Cookie settings',
    ajustesIntro: 'Choose which cookies you accept. Necessary cookies cannot be turned off because the site does not work without them.',
    cerrar: 'Close',
    siempre: 'Always on',
    mas: 'More information in our',
    cats: [
      { id: 'necesarias', nombre: 'Necessary cookies', desc: 'Essential for the site to work (for example, to remember this choice).' },
      { id: 'analiticas', nombre: 'Analytics cookies', desc: 'Let us count visits and see how the site is used in order to improve it (Google Analytics).' },
      { id: 'funcionales', nombre: 'Functional cookies', desc: 'Remember your preferences for a smoother experience.' },
      { id: 'marketing', nombre: 'Marketing cookies', desc: 'Used to show relevant ads and measure advertising campaigns.' },
    ],
  },
} as const;

function IconoGalleta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
      <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
      <circle cx="16" cy="15.5" r="0.8" fill="currentColor" />
      <circle cx="11" cy="17" r="0.8" fill="currentColor" />
      <circle cx="7" cy="13" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function CookieBanner({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const t = T[lang];
  const rutaPolitica = lang === 'en' ? EN.cookies : ES.cookies;
  const [vista, setVista] = useState<Vista>('oculto');
  // AEPD: nada premarcado.
  const [eleccion, setEleccion] = useState<Eleccion>(SOLO_NECESARIAS);

  useEffect(() => {
    const previo = leerConsentimiento();
    if (previo) {
      aplicarAGoogle(previo);
      // Lee la cookie ya guardada; el primer render sigue en «oculto» hasta saberlo.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEleccion({ analiticas: previo.analiticas, funcionales: previo.funcionales, marketing: previo.marketing });
    } else {
      setVista('barra');
    }
    const abrir = () => {
      const actual = leerConsentimiento();
      if (actual) setEleccion({ analiticas: actual.analiticas, funcionales: actual.funcionales, marketing: actual.marketing });
      setVista('ajustes');
    };
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  const decidir = useCallback((e: Eleccion) => {
    guardarConsentimiento(e);
    setEleccion(e);
    setVista('oculto');
  }, []);

  if (vista === 'oculto') return null;

  const btnMarca = 'rounded-lg bg-marca px-4 py-2.5 text-sm font-semibold text-tinta hover:bg-marca-hover';
  const btnSuave = 'rounded-lg bg-niebla px-4 py-2.5 text-sm font-semibold text-tinta hover:bg-linea';

  if (vista === 'ajustes') {
    return (
      <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="cookies-titulo">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-papel shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-linea p-5">
            <div className="flex items-center gap-3">
              <IconoGalleta className="h-7 w-7 text-marca-texto" />
              <p id="cookies-titulo" className="text-lg font-bold">{t.ajustesTitulo}</p>
            </div>
            <button
              type="button"
              onClick={() => setVista(leerConsentimiento() ? 'oculto' : 'barra')}
              className="rounded-lg px-3 py-1.5 text-tinta-2 hover:bg-niebla"
              aria-label={t.cerrar}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            <p className="text-sm text-tinta-2">{t.ajustesIntro}</p>
            {t.cats.map((c) => {
              const fija = c.id === 'necesarias';
              const activa = fija || eleccion[c.id as keyof Eleccion];
              return (
                <div key={c.id} className={`rounded-xl border-2 p-4 ${activa ? 'border-marca bg-marca-suave' : 'border-linea bg-niebla'}`}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="font-semibold" id={`ck-${c.id}`}>{c.nombre}</p>
                    {fija ? (
                      <span className="whitespace-nowrap rounded-full bg-linea px-2.5 py-1 text-xs">{t.siempre}</span>
                    ) : (
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={Boolean(activa)}
                          onChange={(e) => setEleccion((p) => ({ ...p, [c.id]: e.target.checked }))}
                          aria-labelledby={`ck-${c.id}`}
                        />
                        <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-marca peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-marca" />
                        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-tinta-2">{c.desc}</p>
                </div>
              );
            })}
            <p className="pt-2 text-sm text-tinta-2">
              {t.mas}{' '}
              <Link href={rutaPolitica} className="font-semibold text-marca-texto underline" onClick={() => setVista('oculto')}>
                {t.politica}
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-linea bg-niebla p-5 sm:flex-row">
            <button type="button" onClick={() => decidir(SOLO_NECESARIAS)} className={`flex-1 ${btnMarca}`}>{t.rechazar}</button>
            <button type="button" onClick={() => decidir(eleccion)} className={`flex-1 border border-linea bg-papel ${btnSuave}`}>{t.guardar}</button>
            <button type="button" onClick={() => decidir(TODAS)} className={`flex-1 ${btnMarca}`}>{t.aceptar}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[130] border-t border-linea bg-papel p-4 shadow-2xl md:p-5" role="region" aria-label={t.region}>
      <div className="mx-auto flex max-w-web flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex flex-1 items-start gap-3">
          <IconoGalleta className="mt-0.5 h-8 w-8 shrink-0 text-marca-texto" />
          <div>
            <p className="mb-1 text-base font-bold">{t.titulo}</p>
            <p className="text-sm text-tinta-2">
              {t.texto}{' '}
              <Link href={rutaPolitica} className="font-semibold text-marca-texto underline">{t.politica}</Link>
            </p>
          </div>
        </div>
        {/* AEPD: Rechazar en la primera capa, con el mismo peso visual que Aceptar. */}
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setVista('ajustes')} className={btnSuave}>{t.configurar}</button>
          <button type="button" onClick={() => decidir(SOLO_NECESARIAS)} className={btnMarca}>{t.rechazar}</button>
          <button type="button" onClick={() => decidir(TODAS)} className={btnMarca}>{t.aceptar}</button>
        </div>
      </div>
    </div>
  );
}
