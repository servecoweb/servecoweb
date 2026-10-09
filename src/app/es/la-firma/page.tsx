import type { Metadata } from 'next';
import Link from 'next/link';
import EscenaFoto from '@/components/EscenaFoto';
import PageHead from '@/components/PageHead';
import { SEDES } from '@/data/offices';
import { EMPRESA, telHref } from '@/data/site';
import { EQUIPO } from '@/data/team';
import { ES } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'La firma desde 1977',
  description:
    'Serveco Asesores: firma de asesoramiento empresarial desde 1977, con más de 30 profesionales y despachos en seis ciudades de Murcia y Alicante.',
  alternates: { canonical: '/es/la-firma', languages: { es: '/es/la-firma', en: '/en/about' } },
};

export default function LaFirma() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'La firma' }]}
        titulo="Una firma regional de asesoramiento empresarial desde 1977"
        lead="Serveco acompaña a empresas, autónomos y empresas familiares en la Región de Murcia y en Benidorm. La fiscalidad, las nóminas, la contabilidad y los contratos los lleva el mismo equipo."
        cifras={[
          { valor: String(EMPRESA.fundacion), etiqueta: 'Año de fundación' },
          { valor: EMPRESA.profesionales, etiqueta: 'Profesionales' },
          { valor: String(SEDES.length), etiqueta: 'Ciudades con despacho' },
          { valor: 'PAE', etiqueta: 'Punto de atención al emprendedor' },
        ]}
      />

      <section>
        <div className="wrap dos">
          <div className="texto">
            <h2>Un solo interlocutor para toda la empresa</h2>
            <p>
              Cada área tiene economistas, abogados, ingenieros o técnicos superiores. Trabajan sobre el mismo
              expediente, así que no hace falta repetir la historia cada vez que cambia el asunto: una nómina, un
              contrato, el cierre o una ayuda.
            </p>
            <p>
              El cliente habla con una persona de la firma. Esa persona coordina al resto, con el criterio de una
              firma de tamaño regional.
            </p>
            <p>
              También atendemos a quien vive fuera de España o acaba de llegar, en español y en inglés.{' '}
              <Link className="enlace" href={ES.internacional}>Ver el área internacional</Link>
            </p>
          </div>
          <EscenaFoto id="hero" />
        </div>
      </section>

      <section className="banda-niebla">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Cómo se organiza el trabajo</h2>
              <p>Tres cosas que el cliente nota desde el primer expediente, con independencia del despacho al que acuda.</p>
            </div>
          </div>
          <div className="pilares">
            <article className="pilar">
              <h3>El expediente no se parte</h3>
              <p>
                Fiscal, laboral, contable y jurídico leen los mismos datos. Una decisión en un área no llega tarde a
                las demás.
              </p>
              <Link className="ir" href={ES.servicios}>Ver las áreas <span aria-hidden="true">→</span></Link>
            </article>
            <article className="pilar">
              <h3>Cerca de la empresa</h3>
              <p>
                Hay despacho en Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm. El estándar de servicio es el mismo
                en los seis.
              </p>
              <Link className="ir" href={ES.despachos}>Ver despachos <span aria-hidden="true">→</span></Link>
            </article>
            <article className="pilar">
              <h3>Cifras cada mes</h3>
              <p>
                Los sistemas A.D. siguen la salud financiera de la empresa mes a mes, sin esperar al cierre del año
                para ver si algo se tuerce.
              </p>
              <Link className="ir" href={ES.area('financiero')}>Ver el área financiera <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Seis despachos y el mismo expediente</h2>
              <p>
                La red no es una lista de oficinas sueltas. Quien entra por Yecla o por Benidorm tiene detrás al equipo
                de la firma. La sede central está en Murcia.
              </p>
            </div>
            <Link href={ES.despachos} className="btn btn-linea">Ver direcciones y teléfonos</Link>
          </div>
          <ul className="red-sedes">
            {SEDES.map((s) => (
              <li key={s.slug} className={s.central ? 'es-central' : undefined}>
                <Link href={ES.sede(s.slug)}>
                  <strong>{s.ciudad}</strong>
                  <span>{s.central ? 'Sede central' : s.zona}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ad">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Herramientas propias de la firma</h2>
              <p>Serveco desarrolló tres sistemas para decidir con números, no solo con el cierre anual.</p>
            </div>
          </div>
          <div className="ad-lista">
            <div className="ad-item">
              <b>A.D.I</b>
              <h3>Análisis Dinámico Intermensual</h3>
              <p>Diagnóstico del estado de la empresa, mes a mes.</p>
            </div>
            <div className="ad-item">
              <b>A.D.P</b>
              <h3>Análisis Dinámico Presupuestario</h3>
              <p>Proyecciones a uno o varios años para inversiones y financiación.</p>
            </div>
            <div className="ad-item">
              <b>A.D.A</b>
              <h3>Análisis Dinámico Analítico</h3>
              <p>Costes, precios de venta, existencias y presupuestos.</p>
            </div>
          </div>
          <p className="acciones-fila">
            <Link href={ES.area('financiero')} className="btn btn-marca">Ver el área financiera</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap dos">
          <div className="texto">
            <h2>A quién acompaña Serveco</h2>
            <p>
              Pymes, empresas familiares y autónomos de la Región de Murcia, y quienes compran, heredan o residen en la
              costa de Alicante. Quien va a constituir una sociedad puede empezar por el{' '}
              <Link className="enlace" href={ES.pae}>Punto PAE</Link>, del que Serveco es punto oficial.
            </p>
            <p>
              Las ocho áreas —fiscal, laboral, jurídica, contable, financiera, auditoría, I+D+i y formación— están en{' '}
              <Link className="enlace" href={ES.servicios}>servicios</Link>. Los nombres y las fotos son los que
              Serveco tiene hoy en su web; un cargo o una foto se corrigen en{' '}
              <Link className="enlace" href={ES.equipo}>equipo</Link>.
            </p>
            <p className="aviso">
              Texto de Eskala a partir de la web actual y del informe de la firma. Pendiente de que los socios cierren
              la propuesta de valor en una frase.
            </p>
            <div className="acciones-fila">
              <Link href={ES.contacto} className="btn btn-marca">Pedir cita</Link>
              <Link href={ES.equipo} className="btn btn-linea">Ver el equipo</Link>
            </div>
          </div>
          <aside>
            <div className="firma-socios">
              {EQUIPO.filter((p) => p.destacado).map((p) => (
                <Link className="persona" href={ES.equipo} key={p.nombre}>
                  <div className="foto">{p.foto ? <img src={p.foto} alt="" /> : null}</div>
                  <div>
                    <h3>{p.nombre}</h3>
                    <p>{p.cargo}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="caja">
              <h3>En la práctica</h3>
              <ul className="lista-simple">
                <li>Atención en español e inglés</li>
                <li>Punto PAE oficial</li>
                <li>{EMPRESA.razonSocial}</li>
                <li><Link href={ES.blog}>Blog de la firma</Link></li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="wrap">
          <div className="despachos-ayuda">
            <p>
              <strong>Hable con la firma</strong>
              <span>Le atiende el área que corresponde, desde el despacho que le quede más cerca.</span>
            </p>
            <div className="acciones-fila">
              <a className="btn btn-linea" href={telHref(EMPRESA.tel)}>{EMPRESA.tel}</a>
              <Link className="btn btn-marca" href={ES.contacto}>Pedir cita</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
