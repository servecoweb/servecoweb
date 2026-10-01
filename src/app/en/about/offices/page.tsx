import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import OfficesList from '@/components/OfficesList';
import { SEDES } from '@/data/offices';
import { ES, EN } from '@/lib/rutas';

export const metadata: Metadata = {
  title: { absolute: 'Our offices in Murcia and Alicante | Serveco' },
  description:
    'Six Serveco offices in the Region of Murcia and on the Costa Blanca. Services for non-residents and expats (NIE, non-resident tax, wills, property) at all of them.',
  alternates: { canonical: EN.offices, languages: { es: ES.despachos, en: EN.offices } },
};

export default function Offices() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: EN.home }, { label: 'About us', href: EN.about }, { label: 'Offices' }]}
        titulo={`${SEDES.length} cities, one team`}
        lead="Visit the office nearest to you. Your file is the same in all of them, and all six can help international clients."
      />
      <section>
        <div className="wrap">
          <OfficesList sedes={SEDES} lang="en" />
          <div className="caja" style={{ marginTop: 40, maxWidth: 720 }}>
            <h3>Services for non-residents and expats, at every office</h3>
            <p style={{ margin: '8px 0 14px', color: 'var(--tinta-2)' }}>
              NIE numbers, non-resident tax, wills, inheritance and buying or selling property: you can arrange them at any of our offices, or
              remotely if you live abroad. Our Benidorm office, on the Costa Blanca, specialises in international clients.
            </p>
            <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-marca" href={EN.international}>Services for non-residents</Link>
              <Link className="btn btn-linea" href={EN.intl('benidorm')}>Our Benidorm office</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
