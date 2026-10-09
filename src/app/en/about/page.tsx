import type { Metadata } from 'next';
import Link from 'next/link';
import EscenaFoto from '@/components/EscenaFoto';
import PageHead from '@/components/PageHead';
import { SEDES } from '@/data/offices';
import { EMPRESA } from '@/data/site';
import { EN } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Serveco: a regional business advisory firm since 1977, with 30+ professionals and offices in six cities across Murcia and Alicante.',
  alternates: { canonical: '/en/about', languages: { es: '/es/la-firma', en: '/en/about' } },
};

export default function About() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: EN.home }, { label: 'About us' }]}
        titulo="A regional business advisory firm since 1977"
        lead="Serveco advises companies, the self-employed and family businesses in the Region of Murcia and in Benidorm. Tax, payroll, accounts and contracts are handled by the same team."
        cifras={[
          { valor: String(EMPRESA.fundacion), etiqueta: 'Founded' },
          { valor: EMPRESA.profesionales, etiqueta: 'Professionals' },
          { valor: String(SEDES.length), etiqueta: 'Cities with an office' },
          { valor: 'EN', etiqueta: 'We work in English' },
        ]}
      />

      <section>
        <div className="wrap dos">
          <div className="texto">
            <h2>One contact for the whole business</h2>
            <p>
              Economists, lawyers, engineers and specialists share the same file. You do not retell the story each time
              the matter changes: a payroll, a contract, the year-end or a grant.
            </p>
            <p>
              You speak to one person at the firm. That person coordinates the rest. We also advise foreign residents
              and non-residents with assets in Spain.{' '}
              <Link className="enlace" href={EN.international}>International services</Link>
            </p>
          </div>
          <EscenaFoto id="hero" lang="en" />
        </div>
      </section>

      <section className="banda-niebla">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>How the work is organised</h2>
              <p>Three things clients notice from the first file, whichever office they walk into.</p>
            </div>
          </div>
          <div className="pilares">
            <article className="pilar">
              <h3>The file stays in one piece</h3>
              <p>Tax, employment, accounting and legal read the same facts. A decision in one area does not arrive late to the others.</p>
              <Link className="ir" href={EN.services}>See the practice areas <span aria-hidden="true">→</span></Link>
            </article>
            <article className="pilar">
              <h3>Close to the business</h3>
              <p>Offices in Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm. The standard of service is the same in all six.</p>
              <Link className="ir" href={EN.offices}>Offices <span aria-hidden="true">→</span></Link>
            </article>
            <article className="pilar">
              <h3>Figures every month</h3>
              <p>The firm’s own A.D. systems track financial health month by month, instead of waiting for the year-end.</p>
              <Link className="ir" href={EN.area('financial')}>Financial advice <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="ad">
        <div className="wrap">
          <div className="cabecera">
            <div>
              <h2>Tools built by the firm</h2>
              <p>Three systems so decisions rest on numbers, not only on the annual close.</p>
            </div>
          </div>
          <div className="ad-lista">
            <div className="ad-item">
              <b>A.D.I</b>
              <h3>Monthly dynamic analysis</h3>
              <p>A diagnosis of the company, month by month.</p>
            </div>
            <div className="ad-item">
              <b>A.D.P</b>
              <h3>Budget dynamic analysis</h3>
              <p>One-year and multi-year projections for investment and finance.</p>
            </div>
            <div className="ad-item">
              <b>A.D.A</b>
              <h3>Analytical dynamic analysis</h3>
              <p>Costs, selling prices, stock and budgets.</p>
            </div>
          </div>
          <p className="acciones-fila">
            <Link href={EN.area('financial')} className="btn btn-marca">Financial advice</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap texto">
          <h2>Offices and team</h2>
          <p>
            Murcia is the head office. Yecla, Jumilla, Lorca, Balsicas and Benidorm use the same file. Names and
            photographs are those Serveco publishes on its current website.
          </p>
          <p className="aviso">Draft by Eskala, from the current website and the firm’s own report. Pending Serveco’s review.</p>
          <div className="acciones-fila">
            <Link href={EN.contact} className="btn btn-marca">Contact us</Link>
            <Link href={EN.offices} className="btn btn-linea">Offices</Link>
            <Link href={EN.team} className="btn btn-linea">Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
