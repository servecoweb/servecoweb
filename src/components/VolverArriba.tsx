'use client';

import { useEffect, useState } from 'react';

const UMBRAL = 480;

/** Botón fijo, abajo a la izquierda. El chat ocupa la derecha. */
export default function VolverArriba({ lang }: { lang: 'es' | 'en' }) {
  const [visible, setVisible] = useState(false);
  const [subida, setSubida] = useState(0);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > UMBRAL);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  useEffect(() => {
    let observadorTamano: ResizeObserver | undefined;
    const medir = () => {
      const barra = document.querySelector<HTMLElement>('[data-cookies-barra]');
      if (!barra) {
        setSubida(0);
        observadorTamano?.disconnect();
        observadorTamano = undefined;
        return;
      }
      setSubida(Math.ceil(barra.getBoundingClientRect().height) + 12);
      if (!observadorTamano) {
        observadorTamano = new ResizeObserver(medir);
        observadorTamano.observe(barra);
      }
    };
    medir();
    const observador = new MutationObserver(medir);
    observador.observe(document.body, { childList: true, subtree: true });
    return () => {
      observador.disconnect();
      observadorTamano?.disconnect();
    };
  }, []);

  if (!visible) return null;

  const subir = () => {
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={subir}
      className="volver-arriba"
      style={{ bottom: `calc(1.25rem + ${subida}px + env(safe-area-inset-bottom, 0px))` }}
      aria-label={lang === 'en' ? 'Back to top' : 'Volver arriba'}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M6 14.5 12 8.5l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
