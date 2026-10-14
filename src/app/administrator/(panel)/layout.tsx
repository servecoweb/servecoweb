import { exigirSesion } from '@/lib/admin';
import BotonSalir from '@/components/admin/BotonSalir';
import MarcoPanel from '@/components/admin/MarcoPanel';

// El panel nunca se cachea: cada visita comprueba la sesión.
export const dynamic = 'force-dynamic';

/** Panel /administrator/* (sin la clase .web: no hereda estilos de la web pública). */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { usuario, autorizado } = await exigirSesion();

  if (!autorizado) {
    return (
      <div className="grid min-h-screen place-items-center bg-niebla p-6">
        <div className="max-w-md rounded-xl border border-linea bg-papel p-8 text-center">
          <h1 className="mb-2 text-xl font-bold">Sin acceso al panel</h1>
          <p className="mb-6 text-tinta-2">
            La cuenta <strong>{usuario.email}</strong> no es administradora. Hay que añadirla a <code>ADMIN_EMAILS</code>.
          </p>
          <BotonSalir />
        </div>
      </div>
    );
  }

  return <MarcoPanel email={usuario.email ?? ''}>{children}</MarcoPanel>;
}
