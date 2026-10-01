import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import OfficesList from '@/components/OfficesList';
import { SEDES, ciudadesEnLetra } from '@/data/offices';
import { ES } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Despachos',
  description: 'Direcciones y teléfonos de los despachos de Serveco Asesores.',
  alternates: { canonical: ES.despachos },
};

export default function Despachos() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: ES.home }, { label: 'La firma', href: ES.firma }, { label: 'Despachos' }]}
        titulo={`${ciudadesEnLetra()}, un mismo equipo`}
        lead="Acuda al despacho que le quede más cerca. Su expediente es el mismo en todos."
      />
      <section>
        <div className="wrap">
          <OfficesList sedes={SEDES} />
        </div>
      </section>
    </>
  );
}
