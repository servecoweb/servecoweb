import type { Metadata } from 'next';
import Link from 'next/link';
import HeroFondo from '@/components/HeroFondo';
import HeroRouter from '@/components/HeroRouter';
import OfficesList from '@/components/OfficesList';
import ContactForm from '@/components/ContactForm';
import SectoresCarrusel from '@/components/SectoresCarrusel';
import AccesosIntl from '@/components/AccesosIntl';
import EscenaFoto from '@/components/EscenaFoto';
import { AREAS } from '@/data/areas';
import { escena } from '@/data/escenas';
import { SECTORES_HOME } from '@/data/sectores';
import { SEDES, ciudadesEnLetra } from '@/data/offices';
import { EQUIPO } from '@/data/team';
import { articulosPublicados, fechaLarga } from '@/lib/blog/publico';
import { EMPRESA, telHref } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

// Metadatos: marca + búsqueda regional (la ficha de Murcia persigue «asesoría en Murcia»; las áreas, «… en Murcia»).
export const metadata: Metadata = {
  title: { absolute: 'Asesoría de empresas en la Región de Murcia | Serveco' },
  description:
    'Asesoría integral de empresas desde 1977: fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación. Seis despachos en Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm.',
  alternates: { canonical: '/es', languages: { es: '/es', en: '/en' } },
};

// Los últimos artículos salen de Supabase: la home se regenera cada 5 min.
export const revalidate = 300;

// Sectores del carrusel: src/data/sectores.ts (texto, no enlaces; pendiente de validar con Serveco).
const TARJETAS_SECTOR = SECTORES_HOME.map((s) => ({
  id: s.id,
  nombre: s.nombre,
  frase: s.frase,
  img: escena(s.escena).archivo,
  alt: escena(s.escena).alt,
}));

export default async function HomeEs() {
  const ultimos = await articulosPublicados(3);
  return (
    <>
      {/* HERO — PENDIENTE: H1 en la línea del informe de Rafael (firma regional, no «asesoría fiscal…») */}
      <section className="hero con-video" style={{ padding: 0 }}>
        <HeroFondo />
        <div className="hero-velo" aria-hidden="true" />
        <div className="wrap">
          <div>
            <h1>Su asesoría fiscal, laboral y jurídica, bajo un mismo techo</h1>
            <p className="entrada">
              Más de treinta profesionales llevan la fiscalidad, las nóminas, la contabilidad y los contratos de su
              empresa de forma coordinada. Un solo interlocutor, desde 1977.
            </p>
            <div className="acciones">
              <Link href={ES.contacto} className="btn btn-marca">Pedir cita</Link>
              <Link href={ES.despachos} className="btn btn-linea">Ver despachos</Link>
            </div>
            <div className="datos">
              <div><b>{EMPRESA.fundacion}</b>Año de fundación</div>
              <div><b>{EMPRESA.profesionales}</b>Profesionales</div>
              <div><b>{SEDES.length}</b>Ciudades con despacho</div>
            </div>
          </div>
          <HeroRouter />
        </div>
      </section>

      {/* ÁREAS */}
      <section id="areas">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Ocho áreas que trabajan juntas</h2>
              <p>
                Economistas, abogados, ingenieros y técnicos superiores comparten el expediente de su empresa. No hace
                falta repetir la historia en cada departamento.
              </p>
            </div>
          </div>
          <div className="areas">
            {AREAS.map((a) => (
              <Link className="area" href={ES.area(a.slug)} key={a.slug}>
                <h3>{a.nombre}</h3>
                <p>{a.resumen}</p>
                <span className="ir">Ver el área</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SISTEMAS A.D. */}
      <section className="ad" id="sistemas-ad">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Sistemas A.D.: su empresa en cifras, cada mes</h2>
              <p>Herramientas desarrolladas por Serveco para que las decisiones no esperen al cierre del año.</p>
            </div>
          </div>
          <div className="ad-lista">
            <div className="ad-item"><b>A.D.I</b><h3>Análisis Dinámico Intermensual</h3><p>Diagnóstico en tiempo real del estado de la empresa, mes a mes.</p></div>
            <div className="ad-item"><b>A.D.P</b><h3>Análisis Dinámico Presupuestario</h3><p>Proyecciones a uno o varios años para decidir inversiones y financiación.</p></div>
            <div className="ad-item"><b>A.D.A</b><h3>Análisis Dinámico Analítico</h3><p>Costes, precios de venta, existencias y presupuestos.</p></div>
          </div>
          <p style={{ marginTop: 36 }}>
            <Link href={ES.area('financiero')} className="btn btn-marca">Ver el área financiera</Link>
          </p>
        </div>
      </section>

      {/* SECTORES */}
      <section id="sectores">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Conocemos su sector</h2>
              <p>Cada actividad tributa, contrata y se financia de una forma distinta. Trabajamos con el criterio de cada una.</p>
            </div>
          </div>
          <div className="sectores">
            {/* Carrusel deslizable, sin autoplay. Tarjetas no clicables: no hay páginas por sector. */}
            <SectoresCarrusel sectores={TARJETAS_SECTOR} />
            <Link href={ES.contacto} className="btn btn-linea">Cuéntenos su actividad</Link>
          </div>
        </div>
      </section>

      {/* INTERNACIONAL */}
      <section className="intl" id="internacional">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Para quienes viven fuera o acaban de llegar</h2>
              <p>Atendemos a residentes extranjeros y no residentes con bienes en España, en español y en inglés.</p>
            </div>
            <div className="acciones-fila">
              <Link href={ES.internacional} className="btn btn-linea">Ver servicios internacionales</Link>
              <Link href={EN.international} className="btn btn-marca" lang="en">Read in English</Link>
            </div>
          </div>
          <div className="intl-cuerpo">
            <div className="intl-foto">
              <EscenaFoto id="llaves" />
            </div>
            {/* Cada tarjeta lleva a una página que existe (AccesosIntl). */}
            <AccesosIntl lang="es" />
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section id="equipo">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Las personas que llevarán su caso</h2>
              <p>Los socios fundadores. El resto del equipo, por departamentos.</p>
            </div>
            <Link href={ES.equipo} className="btn btn-linea">Ver todo el equipo</Link>
          </div>
          <div className="equipo">
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
        </div>
      </section>

      {/* DESPACHOS */}
      <section id="despachos" className="banda-niebla">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>{ciudadesEnLetra()}, un mismo equipo</h2>
              <p>Acuda al despacho que le quede más cerca. Su expediente es el mismo en todos.</p>
            </div>
          </div>
          <OfficesList sedes={SEDES} />
        </div>
      </section>

      {/* ACTUALIDAD */}
      <section id="blog">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Blog</h2>
              <p>Cambios normativos, plazos y ayudas explicados por el equipo.</p>
            </div>
            <Link href={ES.blog} className="btn btn-linea">Ver todos los artículos</Link>
          </div>
          <div className="posts">
            {ultimos.map((p) => (
              <Link className="post" href={ES.post(p.slug)} key={p.slug}>
                {p.portada ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.portada} alt={p.portadaAlt} className="portada" loading="lazy" />
                ) : (
                  <div className="portada">Serveco</div>
                )}
                <div className="cuerpo">
                  <p className="meta">
                    <span className="cat">{p.categoria}</span>
                    <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
                  </p>
                  <h3>{p.titulo}</h3>
                  <p className="extracto">{p.extracto}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto" id="contacto">
        <div className="wrap">
          <div>
            <h2>Cuéntenos qué necesita</h2>
            <p style={{ color: 'var(--tinta-2)', marginTop: 14 }}>
              Le responde el área que corresponde, desde el despacho que elija.
            </p>
            <div className="via">
              <a href={telHref(EMPRESA.tel)}>{EMPRESA.tel}</a>
              <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>
            </div>
          </div>
          <ContactForm lang="es" areas={AREAS.map((a) => a.nombre)} sedes={SEDES.map((s) => s.ciudad)} />
        </div>
      </section>
    </>
  );
}
