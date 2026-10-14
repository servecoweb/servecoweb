import Link from 'next/link';
import Redes from './Redes';
import { EMPRESA, telHref } from '@/data/site';

export default function UtilBar({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es';
  return (
    <div className="util">
      <div className="wrap">
        <Redes />
        <nav aria-label={es ? 'Accesos rápidos' : 'Quick links'}>
          {es && (
            <>
              <a href={EMPRESA.buscadorSubvenciones} target="_blank" rel="noopener">
                Buscador de subvenciones
              </a>
              <Link href="/es/punto-pae">Punto PAE</Link>
            </>
          )}
          <a href={telHref(EMPRESA.tel)}>{EMPRESA.tel}</a>
        </nav>
        <div className="idioma" aria-label={es ? 'Idioma' : 'Language'}>
          <Link href="/es" lang="es" aria-current={es ? 'true' : undefined}>ES</Link>
          <Link href="/en" lang="en" aria-current={!es ? 'true' : undefined}>EN</Link>
        </div>
      </div>
    </div>
  );
}
