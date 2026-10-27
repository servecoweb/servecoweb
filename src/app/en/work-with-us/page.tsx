import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import FormCandidatura from '@/components/FormCandidatura';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Want to work with us?',
  description: 'Jobs and internships at Serveco. Tell us about your experience and we will write if it fits. The contact form is for clients.',
  alternates: { canonical: EN.workWithUs, languages: idiomas(ES.trabaja, EN.workWithUs) },
};

export default function WorkWithUs() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: '/en' }, { label: 'Work with us' }]}
        titulo="Want to work with us?"
        lead="If you are looking for a job or an internship at the firm, write to us here. The contact form is for clients only."
      />
      <section className="contacto">
        <div className="wrap">
          <div className="texto">
            <h2>Jobs and internships</h2>
            <p>
              Tell us what you have studied or done, and which area you see yourself in: tax, employment, accounting, legal or
              administration. If your profile fits what the firm needs at the time, we will write to you.
            </p>
            <p>You do not need to attach a CV. If it fits, we will ask for it.</p>
          </div>
          <FormCandidatura lang="en" />
        </div>
      </section>
    </>
  );
}
