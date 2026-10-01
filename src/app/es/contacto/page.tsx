import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { EMPRESA, telHref } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escriba a Serveco Asesores: le responde el área que corresponde desde el despacho que elija.',
  alternates: { canonical: '/es/contacto', languages: { es: '/es/contacto', en: '/en/contact' } },
};

export default function Contacto() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'Contacto' }]}
        titulo="Cuéntenos qué necesita"
        lead="Le responde el área que corresponde, desde el despacho que elija."
      />
      <section className="contacto">
        <div className="wrap">
          <div>
            <h2>Llámenos o escríbanos</h2>
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
