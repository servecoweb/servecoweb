import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { DEPARTAMENTOS, EQUIPO } from '@/data/team';

export const metadata: Metadata = {
  title: 'Equipo',
  description: 'Las personas de Serveco Asesores, por departamento: fiscal, financiero, jurídico, laboral y administración.',
  alternates: { canonical: '/es/la-firma/equipo' },
};

export default function Equipo() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'La firma', href: '/es/la-firma' }, { label: 'Equipo' }]}
        titulo="Las personas que llevarán su caso"
        lead="El equipo que Serveco publica hoy, agrupado como en su web: fiscal, financiero, jurídico, laboral y administración."
      />
      <section>
        <div className="wrap">
          {DEPARTAMENTOS.map((d) => {
            const gente = EQUIPO.filter((p) => p.departamento === d.id);
            return (
              <div className="equipo-bloque" key={d.id}>
                <h2>{d.es}</h2>
                <div className="equipo equipo-fichas">
                  {gente.map((p) => (
                    <div className="persona" key={p.nombre}>
                      <div className="foto">{p.foto ? <img src={p.foto} alt="" /> : null}</div>
                      <h3>{p.nombre}</h3>
                      <p>{p.cargo}</p>
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
