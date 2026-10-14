import Link from 'next/link';
import { FormularioEquipo } from '../formulario';
import { crearMiembro } from '../acciones';

/** Alta de una persona. Nace visible, salvo que se desmarque. */
export const dynamic = 'force-dynamic';

type SP = Promise<{ error?: string }>;

export default async function NuevaPersona({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/administrator/equipo" className="text-sm underline">← Volver al equipo</Link>
      <h1 className="text-2xl font-bold">Nueva persona</h1>
      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      <FormularioEquipo miembro={null} action={crearMiembro} />
    </div>
  );
}
