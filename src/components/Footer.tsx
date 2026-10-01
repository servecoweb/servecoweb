import Link from 'next/link';
import Logo from './Logo';
import BotonCookies from './BotonCookies';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { EMPRESA } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/** Pie con columna «Legal» propia (molde Furgocasa) + crédito Eskala. */
export default function Footer({ lang }: { lang: 'es' | 'en' }) {
  const es = lang === 'es';
  const anio = new Date().getFullYear();

  return (
    <footer className="pie-web">
      <div className="wrap">
        <div className="pie">
          <div>
            <Logo href={es ? ES.home : EN.home} />
            <p>
              {EMPRESA.razonSocial}.{' '}
              {es ? 'Asesoría integral de empresas desde 1977.' : 'Business advisers since 1977.'}
            </p>
          </div>

          <div>
            <h4>{es ? 'Áreas' : 'Services'}</h4>
            <ul>
              {AREAS.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link href={es ? ES.area(a.slug) : EN.area(a.slugEn)}>{es ? a.nombre : a.nombreEn}</Link>
                </li>
              ))}
              <li><Link href={es ? ES.servicios : EN.services}>{es ? 'Todos los servicios' : 'All services'}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{es ? 'Firma' : 'Firm'}</h4>
            <ul>
              {es ? (
                <>
                  <li><Link href={ES.firma}>Quiénes somos</Link></li>
                  <li><Link href={ES.equipo}>Equipo</Link></li>
                  <li><Link href={ES.blog}>Blog</Link></li>
                  <li><Link href={ES.internacional}>Internacional</Link></li>
                  <li><Link href={ES.mapaWeb}>Mapa web</Link></li>
                  <li><Link href={EN.home} lang="en">English</Link></li>
                </>
              ) : (
                <>
                  <li><Link href={EN.about}>About us</Link></li>
                  <li><Link href={EN.team}>Our team</Link></li>
                  <li><Link href={EN.international}>International clients</Link></li>
                  <li><Link href={EN.contact}>Contact</Link></li>
                  <li><Link href={EN.sitemap}>Sitemap</Link></li>
                  <li><Link href={ES.home} lang="es">Español</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4>{es ? 'Despachos' : 'Offices'}</h4>
            <ul>
              {SEDES.map((s) => (
                <li key={s.slug}>
                  <Link href={es ? ES.sede(s.slug) : EN.offices}>{s.ciudad}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href={es ? ES.avisoLegal : EN.legalNotice}>{es ? 'Aviso legal' : 'Legal notice'}</Link></li>
              <li><Link href={es ? ES.privacidad : EN.privacy}>{es ? 'Política de privacidad' : 'Privacy policy'}</Link></li>
              <li><Link href={es ? ES.cookies : EN.cookies}>{es ? 'Política de cookies' : 'Cookie policy'}</Link></li>
              <li><BotonCookies texto={es ? 'Configurar cookies' : 'Cookie settings'} /></li>
            </ul>
          </div>
        </div>

        <div className="pie-base">
          <span>© {anio} {EMPRESA.razonSocial}</span>
          <span>
            Hecho con ❤️ en Murcia · Web desarrollada por{' '}
            <a href="https://www.eskaladigital.com" target="_blank" rel="noopener">
              ESKALA Agencia de Marketing Digital
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
