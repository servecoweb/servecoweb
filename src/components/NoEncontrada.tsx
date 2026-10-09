import Link from 'next/link';
import { ES, EN } from '@/lib/rutas';

/**
 * Cuerpo del 404. Sin cabecera: /es y /en ya la ponen en su layout.
 * La página raíz (URL que no existe) la envuelve ella.
 */
export default function NoEncontrada({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const en = lang === 'en';
  const vias = en
    ? [
        { href: EN.services, titulo: 'Services', texto: 'Tax, employment, legal and the rest of the practice' },
        { href: EN.offices, titulo: 'Offices', texto: 'Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm' },
        { href: EN.about, titulo: 'About us', texto: 'Who we are, since 1977' },
        { href: EN.contact, titulo: 'Contact', texto: 'We reply in English' },
      ]
    : [
        { href: ES.servicios, titulo: 'Servicios', texto: 'Fiscal, laboral, jurídico y el resto de áreas' },
        { href: ES.despachos, titulo: 'Despachos', texto: 'Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm' },
        { href: ES.firma, titulo: 'La firma', texto: 'Quiénes somos, desde 1977' },
        { href: ES.blog, titulo: 'Blog', texto: 'Plazos, ayudas y cambios normativos' },
      ];

  return (
    <section className="no-encontrada">
      <div className="wrap">
        <p className="no-encontrada-codigo">404</p>
        <h1>{en ? 'We can’t find this page' : 'No encontramos esta página'}</h1>
        <p className="lead">
          {en
            ? 'The address may have changed with the new website. Start from the home page or write to us.'
            : 'Puede que la dirección haya cambiado con la web nueva. Empiece desde el inicio o escríbanos.'}
        </p>
        <div className="acciones-fila">
          <Link href={en ? EN.home : ES.home} className="btn btn-marca">{en ? 'Go to the home page' : 'Ir al inicio'}</Link>
          <Link href={en ? EN.contact : ES.contacto} className="btn btn-linea">{en ? 'Contact us' : 'Contactar'}</Link>
        </div>
        <ul className="no-encontrada-vias">
          {vias.map((v) => (
            <li key={v.href}>
              <Link href={v.href}>
                {v.titulo}
                <span>{v.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
