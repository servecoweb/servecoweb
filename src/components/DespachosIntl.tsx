import Link from 'next/link';
import { SEDES } from '@/data/offices';
import { ES, EN } from '@/lib/rutas';

/**
 * Caja lateral «Dónde le atendemos» del silo internacional (ES y EN).
 * Criterio de Narciso (25 sep): los servicios para extranjeros se prestan en LOS SEIS despachos;
 * Benidorm es el especializado en clientes internacionales, no el único. También a distancia.
 */
export default function DespachosIntl({ lang }: { lang: 'es' | 'en' }) {
  const en = lang === 'en';
  return (
    <div className="caja">
      <h3>{en ? 'Where we can see you' : 'Dónde le atendemos'}</h3>
      <p style={{ marginBottom: 12, color: 'var(--tinta-2)' }}>
        {en
          ? 'At any of our six offices, or remotely if you live abroad.'
          : 'En cualquiera de nuestros seis despachos, o a distancia si vive fuera.'}
      </p>
      <ul className="lista-simple">
        {SEDES.map((s) => (
          <li key={s.slug}>
            {en ? (
              s.slug === 'benidorm' ? (
                <Link href={EN.intl('benidorm')}>Benidorm · international clients</Link>
              ) : (
                <Link href={EN.offices}>{s.ciudad}</Link>
              )
            ) : (
              <Link href={ES.sede(s.slug)}>
                {s.ciudad}
                {s.slug === 'benidorm' ? ' · especializado en clientes internacionales' : ''}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
