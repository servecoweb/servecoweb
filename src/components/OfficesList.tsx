'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Sede } from '@/data/offices';
import { telHref } from '@/data/site';
import { ES } from '@/lib/rutas';

const ZONAS_EN: Record<string, string> = {
  'Región de Murcia': 'Region of Murcia',
  'Costa de Alicante': 'Alicante coast',
};

/** Listado de sedes con filtro por zona. El filtro solo aparece si hay más de una zona. */
export default function OfficesList({ sedes, lang = 'es' }: { sedes: Sede[]; lang?: 'es' | 'en' }) {
  const en = lang === 'en';
  const zonas = [...new Set(sedes.map((s) => s.zona))];
  const [zona, setZona] = useState<string>('');
  const visibles = sedes.filter((s) => !zona || s.zona === zona);
  const nombreZona = (z: string) => (en ? ZONAS_EN[z] ?? z : z);

  return (
    <>
      {zonas.length > 1 && (
        <div className="filtro-zona" role="group" aria-label={en ? 'Filter by area' : 'Filtrar por zona'}>
          <button type="button" aria-pressed={zona === ''} onClick={() => setZona('')}>{en ? 'All' : 'Todas'}</button>
          {zonas.map((z) => (
            <button key={z} type="button" aria-pressed={zona === z} onClick={() => setZona(z)}>{nombreZona(z)}</button>
          ))}
        </div>
      )}
      <div className="despachos">
        {visibles.map((s) => (
          <article className="despacho" key={s.slug}>
            <span className="zona">{nombreZona(s.zona)}</span>
            <h3>
              {en ? s.ciudad : <Link href={ES.sede(s.slug)}>{s.ciudad}</Link>}
              {s.central && <span className="central">{en ? 'Head office' : 'Sede central'}</span>}
            </h3>
            {s.locales.map((l) => (
              <div key={l.direccion}>
                <address>{l.direccion}</address>
                <a className="tel" href={telHref(l.tel)}>{en ? '+34 ' : ''}{l.tel}</a>
              </div>
            ))}
          </article>
        ))}
      </div>
    </>
  );
}
