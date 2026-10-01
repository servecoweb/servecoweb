import PageHead from './PageHead';
import { EMPRESA } from '@/data/site';
import { ES, EN } from '@/lib/rutas';

/** Plantilla de página legal (ES y EN). El texto definitivo lo aporta Serveco (o su DPO). */
export default function LegalPage({
  titulo,
  lang = 'es',
  children,
}: {
  titulo: string;
  lang?: 'es' | 'en';
  children?: React.ReactNode;
}) {
  const en = lang === 'en';
  return (
    <>
      <PageHead migas={[{ label: en ? 'Home' : 'Inicio', href: en ? EN.home : ES.home }, { label: titulo }]} titulo={titulo} />
      <section>
        <div className="wrap texto">
          <p className="aviso">
            {en
              ? 'Legal text pending from Serveco: company name, tax ID, registered address and data controller.'
              : 'Texto legal pendiente de Serveco: razón social, CIF, domicilio, registro y datos del responsable.'}
          </p>
          <p>{en ? 'Owner' : 'Titular'}: {EMPRESA.razonSocial}. {en ? 'Contact' : 'Contacto'}: {EMPRESA.email}.</p>
          {children}
        </div>
      </section>
    </>
  );
}
