import Link from 'next/link';
import PageHead from './PageHead';
import type { Grupo } from '@/lib/mapa-web';
import { ES, EN } from '@/lib/rutas';

/** Mapa web visible (/es/sitemap, /en/sitemap). Sale de la misma lista que sitemap.xml. */
export default function MapaWeb({ grupos, lang }: { grupos: Grupo[]; lang: 'es' | 'en' }) {
  const en = lang === 'en';
  const total = grupos.reduce((n, g) => n + g.enlaces.length, 0);
  return (
    <>
      <PageHead
        migas={[{ label: en ? 'Home' : 'Inicio', href: en ? EN.home : ES.home }, { label: en ? 'Sitemap' : 'Mapa web' }]}
        titulo={en ? 'Sitemap' : 'Mapa web'}
        lead={en ? `All ${total} pages of the English site.` : `Las ${total} páginas de la web en español.`}
      />
      <section>
        <div className="wrap">
          <div className="mapa-web">
            {grupos.map((g) => (
              <div key={g.titulo}>
                <h2>{g.titulo}</h2>
                <ul className="lista-simple">
                  {g.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href}>{e.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40 }}>
            <Link className="enlace" href={en ? ES.mapaWeb : EN.sitemap} lang={en ? 'es' : 'en'}>
              {en ? 'Mapa web en español' : 'English sitemap'}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
