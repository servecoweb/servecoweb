import { REDES } from '@/data/site';

/** Iconos de redes. SVG propio: no se carga nada de otro servidor. */
function Icono({ id }: { id: (typeof REDES)[number]['id'] }) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.35 6.3a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05z" />
      </svg>
    );
  }
  if (id === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M6.2 9H3.4v11.2h2.8V9zM4.8 3.6A1.7 1.7 0 1 0 4.8 7a1.7 1.7 0 0 0 0-3.4zM20.6 13.4c0-3-1.6-4.6-3.8-4.6a3.3 3.3 0 0 0-2.9 1.6h-.1V9H11.1v11.2h2.8v-6.2c0-.4.1-.8.2-1.1.3-.8 1-1.5 2.1-1.5 1.5 0 2.1 1.1 2.1 2.8v6H21v-6.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M14.2 8.2H16.5V5h-2.3C11.8 5 9.7 7.1 9.7 9.5v1.7H7.2v3.1h2.5V21h3.2v-6.7h2.6l.7-3.1h-3.3V9.6c0-.7.5-1.4 1.3-1.4z" />
    </svg>
  );
}

export default function Redes() {
  return (
    <nav className="redes" aria-label="Redes sociales">
      {REDES.map((r) => (
        <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" aria-label={r.nombre}>
          <Icono id={r.id} />
        </a>
      ))}
    </nav>
  );
}
