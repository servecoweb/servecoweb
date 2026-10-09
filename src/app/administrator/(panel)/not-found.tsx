import Link from 'next/link';

/** 404 del panel. Sin la web pública: el layout del panel ya pone la barra. */
export default function NoEncontradoPanel() {
  return (
    <div className="mx-auto max-w-web px-6 py-16">
      <h1 className="mb-2 text-xl font-bold">No encontramos esta ficha</h1>
      <p className="mb-6 text-tinta-2">Puede que se haya movido o que el enlace esté mal.</p>
      <Link href="/administrator" className="font-semibold underline">Volver al panel</Link>
    </div>
  );
}
