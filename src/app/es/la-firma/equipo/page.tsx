import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { DEPARTAMENTOS, leerEquipo, partesCargo } from '@/lib/equipo';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Equipo',
  description: 'Las personas de Serveco Asesores, por departamento: fiscal, financiero, jurídico, laboral y administración.',
  alternates: { canonical: ES.equipo, languages: idiomas(ES.equipo, EN.team) },
};

export default async function Equipo() {
  const equipo = await leerEquipo();
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'La firma', href: '/es/la-firma' }, { label: 'Equipo' }]}
        titulo="Las personas que llevarán tu caso"
        lead="El equipo que Serveco publica hoy, agrupado como en su web: fiscal, financiero, jurídico, laboral y administración."
      />
      <section>
        <div className="wrap">
          {DEPARTAMENTOS.map((d) => {
            const gente = equipo.filter((p) => p.departamento === d.id);
            return (
              <div className="equipo-bloque" key={d.id}>
                <h2>{d.es}</h2>
                <div className="equipo equipo-fichas">
                  {gente.map((p) => {
                    const { puesto, titulos } = partesCargo(p.cargo);
                    return (
                      <div className="persona" key={p.nombre}>
                        <div className="foto">{p.foto ? <img src={p.foto} alt="" /> : null}</div>
                        <h3>{p.nombre}</h3>
                        {puesto && <p className="persona-puesto">{puesto}</p>}
                        <p className="persona-titulos">{titulos.map((t) => <span key={t}>{t}</span>)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
