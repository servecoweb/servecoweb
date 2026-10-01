import Link from 'next/link';

export type Miga = { label: string; href?: string };

export type Cifra = { valor: string; etiqueta: string };

/** Cabecera de página interior: migas + H1 + entradilla. `cifras` pinta la tira de datos bajo el lead. */
export default function PageHead({
  migas,
  titulo,
  lead,
  cifras,
}: {
  migas?: Miga[];
  titulo: string;
  lead?: string;
  cifras?: Cifra[];
}) {
  return (
    <div className="page-head">
      <div className="wrap">
        {migas && migas.length > 0 && (
          <nav className="migas" aria-label="Estás en">
            <ol>
              {migas.map((m) => (
                <li key={m.label}>{m.href ? <Link href={m.href}>{m.label}</Link> : <span aria-current="page">{m.label}</span>}</li>
              ))}
            </ol>
          </nav>
        )}
        <h1>{titulo}</h1>
        {lead && <p className="lead">{lead}</p>}
        {cifras && cifras.length > 0 && (
          <div className="datos">
            {cifras.map((c) => (
              <div key={c.etiqueta}><b>{c.valor}</b>{c.etiqueta}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
