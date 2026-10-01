import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { EQUIPO } from '@/data/team';
import { SEDES } from '@/data/offices';
import { ES, EN } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Our team',
  description: 'The people at Serveco: heads of each practice area and office.',
  alternates: { canonical: EN.team, languages: { es: ES.equipo, en: EN.team } },
};

export default function Team() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: EN.home }, { label: 'About us', href: EN.about }, { label: 'Our team' }]}
        titulo="The people who will handle your case"
        lead="Economists, lawyers, engineers and specialists across our offices."
      />
      <section>
        <div className="wrap">
          <p className="aviso">Sample team. Names, roles and photos pending.</p>
          <div className="equipo">
            {EQUIPO.map((p, i) => {
              const sede = SEDES.find((s) => s.slug === p.sedeSlug);
              return (
                <div className="persona" key={i}>
                  <div className="foto">Portrait</div>
                  <h3>{p.nombre}</h3>
                  <p>{p.cargo}{sede ? ` · ${sede.ciudad}` : ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
