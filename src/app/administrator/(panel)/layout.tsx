import Link from 'next/link';
import { exigirSesion } from '@/lib/admin';
import BotonSalir from '@/components/admin/BotonSalir';

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

  return (
    <div className="min-h-screen bg-niebla text-tinta">
      <header className="bg-tinta text-white">
        <div className="mx-auto flex max-w-web flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <Link href="/administrator" className="font-extrabold tracking-wide">SERVECO · Panel</Link>
          <nav className="flex gap-5 text-sm">
            {/* Solo secciones que existen. */}
            <Link href="/administrator" className="hover:underline">Inicio</Link>
            <Link href="/administrator/contactos" className="hover:underline">Contactos</Link>
            <Link href="/administrator/blog" className="hover:underline">Blog</Link>
            <Link href="/administrator/chatbot" className="hover:underline">Chatbot</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="text-white/70">{usuario.email}</span>
            <Link href="/es" className="text-white/70 hover:text-white">Ver web</Link>
            <BotonSalir claro />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-web px-6 py-8">{children}</main>
    </div>
  );
}
