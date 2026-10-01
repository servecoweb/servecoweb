import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-head" style={{ minHeight: '70vh' }}>
      <div className="wrap">
        <h1>No encontramos esta página</h1>
        <p className="lead">Puede que la dirección haya cambiado con la web nueva. Empiece desde el inicio o escríbanos.</p>
        <p style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/es" className="btn btn-marca">Ir al inicio</Link>
          <Link href="/es/contacto" className="btn btn-linea">Contactar</Link>
        </p>
      </div>
    </main>
  );
}
