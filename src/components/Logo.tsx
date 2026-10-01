import Link from 'next/link';

/**
 * Marca aproximada a partir del logo PNG (Serveco Abogados).
 * SUSTITUIR por el SVG oficial de Serveco Asesores cuando lo envíen.
 */
export default function Logo({ href = '/es' }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Serveco Asesores, inicio">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="6" fill="var(--gris-marca)" />
        <path d="M0 22h40v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z" fill="var(--naranja)" />
        <path d="M11 20.5 17.5 28 30 12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <b>SERVECO</b>
        <small>ASESORES</small>
      </span>
    </Link>
  );
}
