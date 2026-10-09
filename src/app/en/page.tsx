import type { Metadata } from 'next';
import Link from 'next/link';
import HeroFondo from '@/components/HeroFondo';
import OfficesList from '@/components/OfficesList';
import AccesosIntl from '@/components/AccesosIntl';
import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { EMPRESA } from '@/data/site';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: { absolute: 'English-speaking business and tax advisers in Spain | Serveco' },
  description:
    'Tax, accounting, payroll and legal advice in Spain, in English, since 1977. NIE, non-resident tax and property for expats. Six offices in Murcia and Alicante.',
  alternates: { canonical: EN.home, languages: idiomas(ES.home, EN.home) },
};

export default function HomeEn() {
  return (
    <>
      <section className="hero con-video" style={{ padding: 0 }}>
        <HeroFondo />
        <div className="hero-velo" aria-hidden="true" />
        <div className="wrap">
          <div>
            <h1>Business and tax advisers in Spain since {EMPRESA.fundacion}</h1>
            <p className="entrada">
              Tax, employment, legal and accounting advice for companies, the self-employed and private clients, from
              offices across the Region of Murcia and the Alicante coast.
            </p>
            <div className="acciones">
              <Link href={EN.contact} className="btn btn-marca">Contact us</Link>
              <Link href={EN.international} className="btn btn-linea">Non-resident services</Link>
            </div>
          </div>
          <div className="router">
            <h2>For expats and non-residents</h2>
            <p>We help foreign residents and non-residents with property and assets in Spain.</p>
            {/* Each item links to an existing page (AccesosIntl). */}
            <AccesosIntl lang="en" variante="lista" />
            <p style={{ marginTop: 16 }}><Link className="enlace" href={EN.international}>See international services</Link></p>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Our services</h2>
              <p>Eight practice areas that work together on the same file.</p>
            </div>
          </div>
          <div className="areas">
            {AREAS.map((a) => (
              <Link className="area" href={EN.area(a.slugEn)} key={a.slug}>
                <h3>{a.nombreEn}</h3>
                <p>{a.resumenEn}</p>
                <span className="ir">See service</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="banda-niebla">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Our offices</h2>
              <p>International clients are welcome at all six offices. Our Benidorm office specialises in non-residents and expats.</p>
            </div>
            <Link href={EN.offices} className="btn btn-linea">See all offices</Link>
          </div>
          <OfficesList sedes={SEDES} lang="en" />
        </div>
      </section>
    </>
  );
}
