import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { EMPRESA, telHref } from '@/data/site';
import Link from 'next/link';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escribe a Serveco Asesores: te responde el área que corresponde desde el despacho que elijas.',
  alternates: { canonical: ES.contacto, languages: idiomas(ES.contacto, EN.contact) },
};

export default function Contacto() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'Contacto' }]}
        titulo="Cuéntanos qué necesitas"
        lead="Te responde el área que corresponde, desde el despacho que elijas."
      />
      <section className="contacto">
        <div className="wrap">
          <aside className="aviso-empleo">
            <div>
              <p className="kicker">Empleo y prácticas</p>
              <h2>El formulario de empleo es otro</h2>
              <p>¿Quieres trabajar con nosotros? Este formulario es para clientes. Si buscas empleo o unas prácticas, usa el otro.</p>
            </div>
            <Link className="btn btn-marca" href={`${ES.trabaja}#formulario`}>
              Ir al formulario de empleo
            </Link>
          </aside>
          <div>
            <h2>Llámanos o escríbenos</h2>
            <div className="via">
              <a href={telHref(EMPRESA.tel)}>{EMPRESA.tel}</a>
              <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>
            </div>
          </div>
          <div id="formulario">
            <ContactForm lang="es" areas={AREAS.map((a) => a.nombre)} sedes={SEDES.map((s) => s.ciudad)} />
          </div>
        </div>
      </section>
    </>
  );
}
