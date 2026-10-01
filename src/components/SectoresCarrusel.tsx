'use client';

import { useRef } from 'react';

/**
 * Carrusel «Conocemos su sector» (home). Criterios:
 *  · SIN movimiento automático (los carruseles que pasan solos ni se leen ni son accesibles).
 *  · Tira deslizable: dedo en móvil, flechas en escritorio. Todo el contenido está en el HTML (SEO).
 *  · Tarjetas NO clicables: no hay páginas por sector (regla de cero huérfanos). La acción es el botón de debajo.
 *  · Si una escena aún no se ha generado, la tarjeta se queda con fondo neutro (sin imagen rota).
 */
export type TarjetaSector = { id: string; nombre: string; frase: string; img: string; alt: string };

export default function SectoresCarrusel({ sectores, lang = 'es' }: { sectores: TarjetaSector[]; lang?: 'es' | 'en' }) {
  const pista = useRef<HTMLUListElement>(null);
  const en = lang === 'en';

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector('li');
    const paso = tarjeta ? tarjeta.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * paso, behavior: suave ? 'smooth' : 'auto' });
  };

  return (
    <div className="sectores-carrusel" role="region" aria-roledescription={en ? 'carousel' : 'carrusel'} aria-label={en ? 'Sectors' : 'Sectores'}>
      <div className="carrusel-flechas">
        <button type="button" onClick={() => mover(-1)} aria-label={en ? 'Previous' : 'Anterior'}>
          ←
        </button>
        <button type="button" onClick={() => mover(1)} aria-label={en ? 'Next' : 'Siguiente'}>
          →
        </button>
      </div>
      <ul ref={pista} className="carrusel-pista" tabIndex={0} aria-label={en ? 'Sector list, scroll sideways' : 'Lista de sectores, desplácese en horizontal'}>
        {sectores.map((s) => (
          <li key={s.id} className="sector-tarjeta">
            <figure className="sector-foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <figcaption>{en ? 'Illustrative image' : 'Imagen ilustrativa'}</figcaption>
            </figure>
            <h3>{s.nombre}</h3>
            <p>{s.frase}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
