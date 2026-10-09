import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { EMPRESA, telHref } from '@/data/site';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Serveco. We reply in English.',
  alternates: { canonical: EN.contact, languages: idiomas(ES.contacto, EN.contact) },
};

export default function Contact() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: '/en' }, { label: 'Contact' }]}
        titulo="Tell us what you need"
        lead="The right team will reply, from the office you choose."
      />
      <section className="contacto">
        <div className="wrap">
          <div>
            <h2>Call or write to us</h2>
            <div className="via">
              <a href={telHref(EMPRESA.tel)}>+34 {EMPRESA.tel}</a>
              <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>
            </div>
          </div>
          <ContactForm
            lang="en"
            areas={AREAS.map((a) => a.nombreEn)}
            sedes={SEDES.map((s) => s.ciudad)}
            sedeInicial="Benidorm"
          />
        </div>
      </section>
    </>
  );
}
