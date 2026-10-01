import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { EQUIPO } from '@/data/team';
import { SEDES } from '@/data/offices';

export const metadata: Metadata = {
  title: 'Equipo',
  description: 'Las personas de Serveco Asesores: responsables de cada área y de cada despacho.',
  alternates: { canonical: '/es/la-firma/equipo' },
};

export default function Equipo() {
  return (
    <>
      <PageHead
        migas={[{ label: 'Inicio', href: '/es' }, { label: 'La firma', href: '/es/la-firma' }, { label: 'Equipo' }]}
        titulo="Las personas que llevarán su caso"
        lead="Economistas, abogados, ingenieros y técnicos superiores repartidos en nuestros despachos."
      />
      <section>
        <div className="wrap">
          <p className="aviso">Equipo de ejemplo. Faltan nombres, cargos y fotos reales.</p>
          <div className="equipo">
            {EQUIPO.map((p, i) => {
              const sede = SEDES.find((s) => s.slug === p.sedeSlug);
              return (
                <div className="persona" key={i}>
                  <div className="foto">Retrato</div>
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
