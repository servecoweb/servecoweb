import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import FormCandidatura from '@/components/FormCandidatura';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: '¿Quieres trabajar con nosotros?',
  description: 'Empleo y prácticas en Serveco Asesores. Cuéntanos tu experiencia: si encaja, te escribimos. El formulario de contacto es para clientes.',
  alternates: { canonical: ES.trabaja, languages: idiomas(ES.trabaja, EN.workWithUs) },
};

export default function TrabajaConNosotros() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'Trabaja con nosotros' }]}
        titulo="¿Quieres trabajar con nosotros?"
        lead="Si buscas empleo o unas prácticas en la asesoría, escríbenos aquí. El formulario de contacto es solo para clientes."
      />
      <section className="contacto">
        <div className="wrap">
          <div className="texto">
            <h2>Empleo y prácticas</h2>
            <p>
              Cuéntanos qué has estudiado o a qué te has dedicado, y en qué área te ves: fiscal, laboral, contable, jurídica o
              administración. Si tu perfil encaja con lo que el despacho necesita en ese momento, te escribimos.
            </p>
            <p>No hace falta adjuntar el currículum. Si encaja, te lo pedimos.</p>
          </div>
          <FormCandidatura lang="es" />
        </div>
      </section>
    </>
  );
}
