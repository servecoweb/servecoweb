'use client';

import Link from 'next/link';
import { useState } from 'react';
import { comoLlegar, type Sede } from '@/data/offices';
import { telHref } from '@/data/site';
import { ES } from '@/lib/rutas';

const ZONAS_EN: Record<string, string> = {
  'Región de Murcia': 'Region of Murcia',
  'Costa de Alicante': 'Alicante coast',
};

const IconoPin = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const IconoTel = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);

/** Listado de sedes con filtro por zona. El filtro solo aparece si hay más de una zona. */
export default function OfficesList({ sedes, lang = 'es' }: { sedes: Sede[]; lang?: 'es' | 'en' }) {
  const en = lang === 'en';
  const zonas = [...new Set(sedes.map((s) => s.zona))];
  const [zona, setZona] = useState<string>('');
  const visibles = sedes.filter((s) => !zona || s.zona === zona);
  const nombreZona = (z: string) => (en ? ZONAS_EN[z] ?? z : z);
  const nLocales = sedes.reduce((n, s) => n + s.locales.length, 0);

  return (
    <>
      <div className="despachos-barra">
        {zonas.length > 1 && (
          <div className="filtro-zona" role="group" aria-label={en ? 'Filter by area' : 'Filtrar por zona'}>
            <button type="button" aria-pressed={zona === ''} onClick={() => setZona('')}>{en ? 'All' : 'Todas'}</button>
            {zonas.map((z) => (
              <button key={z} type="button" aria-pressed={zona === z} onClick={() => setZona(z)}>{nombreZona(z)}</button>
            ))}
          </div>
        )}
        <p className="despachos-cuenta">
          <strong>{nLocales}</strong> {en ? 'offices in' : 'despachos en'} <strong>{sedes.length}</strong> {en ? 'cities' : 'ciudades'}
        </p>
      </div>
      <div className="despachos">
        {visibles.map((s) => (
          <article className={s.central ? 'despacho es-central' : 'despacho'} key={s.slug}>
            <div className="despacho-cab">
              <span className="zona">{nombreZona(s.zona)}</span>
              {s.central && <span className="central">{en ? 'Head office' : 'Sede central'}</span>}
            </div>
            <h3>{en ? s.ciudad : <Link href={ES.sede(s.slug)}>{s.ciudad}</Link>}</h3>
            <ul className="despacho-locales">
              {s.locales.map((l) => (
                <li key={l.direccion}>
                  <address><IconoPin />{l.direccion}</address>
                  <a className="tel" href={telHref(l.tel)}><IconoTel />{en ? '+34 ' : ''}{l.tel}</a>
                  <a className="llegar" href={comoLlegar(l.direccion, s.ciudad)} target="_blank" rel="noopener noreferrer">
                    {en ? 'Directions' : 'Cómo llegar'} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            {!en && (
              <Link className="despacho-ver" href={ES.sede(s.slug)}>
                Ver el despacho de {s.ciudad} <span aria-hidden="true">→</span>
              </Link>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
