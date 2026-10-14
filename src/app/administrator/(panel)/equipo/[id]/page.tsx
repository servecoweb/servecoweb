import Link from 'next/link';
import { notFound } from 'next/navigation';
import { leerMiembro } from '@/lib/equipo';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { FormularioEquipo } from '../formulario';
import { borrarMiembro, guardarMiembro } from '../acciones';

/** Edición de una persona del equipo. */
export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;
type SP = Promise<{ ok?: string; error?: string }>;

export default async function EditarPersona({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { id } = await params;
  const sp = await searchParams;
  const miembro = await leerMiembro(id);
  if (!miembro) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/administrator/equipo" className="text-sm underline">← Volver al equipo</Link>
      <h1 className="text-2xl font-bold">{miembro.nombre}</h1>
      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}
      <FormularioEquipo miembro={miembro} action={guardarMiembro} />
      <form action={borrarMiembro}>
        <input type="hidden" name="id" value={miembro.id} />
        <BotonEnviar
          texto="Quitar del equipo"
          trabajando="Quitando…"
          confirmar="Esta persona dejará de salir en la web. ¿Seguro?"
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
        />
      </form>
    </div>
  );
}
