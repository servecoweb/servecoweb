import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { DEPARTAMENTOS, EQUIPO } from '@/data/team';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Our team',
  description: 'The people at Serveco, by department: tax, financial, legal, employment and administration.',
  alternates: { canonical: EN.team, languages: idiomas(ES.equipo, EN.team) },
};

export default function Team() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Home', href: EN.home }, { label: 'About us', href: EN.about }, { label: 'Our team' }]}
        titulo="The people who will handle your case"
        lead="The team Serveco publishes today, in the same departments as on its current website."
      />
      <section>
        <div className="wrap">
          {DEPARTAMENTOS.map((d) => {
            const gente = EQUIPO.filter((p) => p.departamento === d.id);
            return (
              <div className="equipo-bloque" key={d.id}>
                <h2>{d.en}</h2>
                <div className="equipo equipo-fichas">
                  {gente.map((p) => (
                    <div className="persona" key={p.nombre}>
                      <div className="foto">{p.foto ? <img src={p.foto} alt="" /> : null}</div>
                      <h3>{p.nombre}</h3>
                      <p>{p.cargoEn}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
