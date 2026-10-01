'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { AREAS } from '@/data/areas';
import { ES, EN } from '@/lib/rutas';

type Mega = 'areas' | 'clientes' | null;

const GRUPOS: { id: 'empresa' | 'personas' | 'crecimiento'; titulo: string }[] = [
  { id: 'empresa', titulo: 'Empresa y fiscalidad' },
  { id: 'personas', titulo: 'Personas y contratos' },
  { id: 'crecimiento', titulo: 'Crecimiento' },
];

export default function Header({ lang }: { lang: 'es' | 'en' }) {
  const [mega, setMega] = useState<Mega>(null);
  const [movil, setMovil] = useState(false);
  // En escritorio el CSS abre el mega con :hover. Tras un clic el ratón sigue encima
  // y el panel no se iría. Se suprime el hover hasta que el cursor salga del menú.
  const [sinHover, setSinHover] = useState(false);
  const pathname = usePathname();
  const primera = useRef(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMega(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    setMega(null);
    setMovil(false);
    setSinHover(true);
  }, [pathname]);

  function cerrar() {
    setMega(null);
    setMovil(false);
    setSinHover(true);
  }

  function cerrarSiEnlace(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('a')) cerrar();
  }

  function toggle(m: Exclude<Mega, null>) {
    setMega((actual) => (actual === m ? null : m));
  }

  if (lang === 'en') {
    return (
      <header className="cab">
        <div className="wrap">
          <Logo href={EN.home} />
          <ul className={`menu${movil ? ' abierto' : ''}${sinHover ? ' sin-hover' : ''}`} id="menu" onClick={cerrarSiEnlace} onMouseLeave={() => setSinHover(false)}>
            <li><Link href={EN.services}>Services</Link></li>
            <li><Link href={EN.international}>International clients</Link></li>
            <li><Link href={EN.about}>About us</Link></li>
            <li><Link href={EN.offices}>Offices</Link></li>
          </ul>
          <div className="cab-acciones">
            <Link href={EN.contact} className="btn btn-marca">Contact us</Link>
            <button type="button" className="hamb" aria-expanded={movil} aria-controls="menu" onClick={() => setMovil(!movil)}>
              {movil ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="cab">
      <div className="wrap">
        <Logo href={ES.home} />

        <ul className={`menu${movil ? ' abierto' : ''}${sinHover ? ' sin-hover' : ''}`} id="menu" onClick={cerrarSiEnlace} onMouseLeave={() => setSinHover(false)}>
          <li>
            <button type="button" aria-expanded={mega === 'areas'} aria-controls="mega-areas" onClick={() => toggle('areas')}>
              Áreas
            </button>
            <div className={`mega${mega === 'areas' ? ' abierto' : ''}`} id="mega-areas">
              <div className="wrap">
                {GRUPOS.map((g) => (
                  <div key={g.id}>
                    <h4>{g.titulo}</h4>
                    <ul>
                      {AREAS.filter((a) => a.grupo === g.id).map((a) => (
                        <li key={a.slug}><Link href={ES.area(a.slug)}>{a.nombre}</Link></li>
                      ))}
                      {g.id === 'crecimiento' && (
                        <>
                          <li><Link href={ES.subvenciones}>Subvenciones y ayudas</Link></li>
                          <li><Link href={ES.pae}>Punto PAE · crear empresa</Link></li>
                        </>
                      )}
                    </ul>
                  </div>
                ))}
                <div className="destacado">
                  <h4>Sistemas A.D.</h4>
                  <p>Nuestras herramientas propias para seguir la salud financiera de su empresa mes a mes.</p>
                  <Link className="enlace" href={ES.area('financiero')}>Conocer los sistemas</Link>
                  <p style={{ marginTop: 16, marginBottom: 0 }}>
                    <Link className="enlace" href={ES.servicios}>Ver todos los servicios</Link>
                  </p>
                </div>
              </div>
            </div>
          </li>
          <li>
            <button type="button" aria-expanded={mega === 'clientes'} aria-controls="mega-clientes" onClick={() => toggle('clientes')}>
              Para quién
            </button>
            <div className={`mega${mega === 'clientes' ? ' abierto' : ''}`} id="mega-clientes">
              <div className="wrap">
                <div>
                  <h4>Trabajamos con</h4>
                  {/* Sin páginas por perfil (corte B, fuera del PDF): cada perfil lleva a la página existente que más le sirve. */}
                  <ul>
                    <li><Link href={ES.servicios}>Pymes</Link></li>
                    <li><Link href={ES.area('fiscal')}>Empresa familiar</Link></li>
                    <li><Link href={ES.pae}>Autónomos</Link></li>
                    <li><Link href={ES.internacional}>No residentes</Link></li>
                  </ul>
                </div>
                <div>
                  <h4>Para empezar</h4>
                  <ul>
                    <li><Link href={ES.pae}>Crear una empresa</Link></li>
                    <li><Link href={ES.subvenciones}>Buscar ayudas</Link></li>
                    <li><Link href={ES.despachos}>Encontrar un despacho</Link></li>
                  </ul>
                </div>
                <div />
                <div className="destacado">
                  <h4 lang="en">International clients</h4>
                  <p lang="en">NIE, non-resident tax, wills and property purchases. We work in English.</p>
                  <Link className="enlace" href={EN.international} lang="en">Go to the English site</Link>
                </div>
              </div>
            </div>
          </li>
          <li><Link href={ES.firma}>La firma</Link></li>
          <li><Link href={ES.despachos}>Despachos</Link></li>
          <li><Link href={ES.blog}>Blog</Link></li>
        </ul>

        <div className="cab-acciones">
          <Link href={ES.contacto} className="btn btn-marca">Pedir cita</Link>
          <button type="button" className="hamb" aria-expanded={movil} aria-controls="menu" onClick={() => setMovil(!movil)}>
            {movil ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>
    </header>
  );
}
