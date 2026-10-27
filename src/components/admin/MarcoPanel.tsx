'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotonSalir from '@/components/admin/BotonSalir';

/**
 * Barra izquierda del panel. Mismo esquema que Furgocasa y Neotérmica:
 * fija en escritorio, y en móvil se abre con el botón de menú.
 */

type Item = { href: string; label: string; exact?: boolean; icono: 'inicio' | 'contactos' | 'candidatos' | 'equipo' | 'blog' | 'chat' };

const ITEMS: Item[] = [
  { href: '/administrator', label: 'Inicio', exact: true, icono: 'inicio' },
  { href: '/administrator/contactos', label: 'Contactos', icono: 'contactos' },
  { href: '/administrator/candidatos', label: 'Candidatos', icono: 'candidatos' },
  { href: '/administrator/equipo', label: 'Equipo', icono: 'equipo' },
  { href: '/administrator/blog', label: 'Blog', icono: 'blog' },
  { href: '/administrator/chatbot', label: 'Chatbot', icono: 'chat' },
];

function Icono({ nombre }: { nombre: Item['icono'] | 'web' | 'cerrar' | 'menu' }) {
  const comun = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (nombre === 'inicio') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (nombre === 'contactos') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3 3 0 0 1 0 5.74" />
      </svg>
    );
  }
  if (nombre === 'candidatos') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }
  if (nombre === 'equipo') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 19v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
      </svg>
    );
  }
  if (nombre === 'blog') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    );
  }
  if (nombre === 'chat') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0z" />
      </svg>
    );
  }
  if (nombre === 'web') {
    return (
      <svg {...comun} className="h-5 w-5 shrink-0">
        <path d="M14 5h5v5" />
        <path d="M19 5l-8 8" />
        <path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />
      </svg>
    );
  }
  if (nombre === 'menu') {
    return (
      <svg {...comun} className="h-6 w-6">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }
  return (
    <svg {...comun} className="h-5 w-5">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function MarcoPanel({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-niebla text-tinta lg:pl-64">
      {abierto && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-tinta/40 lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setAbierto(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-tinta text-white transition-transform lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/administrator" className="flex min-w-0 items-center gap-3" onClick={() => setAbierto(false)}>
            <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
              <rect width="40" height="40" rx="6" fill="#7f7f7f" />
              <path d="M0 22h40v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z" fill="#ee7d22" />
              <path d="M11 20.5 17.5 28 30 12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold tracking-[0.14em]">SERVECO</span>
              <span className="mt-0.5 block text-xs text-white/55">Panel</span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
          >
            <Icono nombre="cerrar" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {ITEMS.map((item) => {
            const activo = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                aria-current={activo ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  activo ? 'bg-marca text-tinta' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icono nombre={item.icono} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <p className="truncate px-3 pb-1 text-xs text-white/50" title={email}>{email}</p>
          <Link
            href="/es"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white"
          >
            <Icono nombre="web" />
            Ver la web
          </Link>
          <div className="px-1 pt-1">
            <BotonSalir claro />
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-linea bg-papel px-4 py-3 lg:hidden">
        <button
          type="button"
          className="rounded-lg p-1.5 text-tinta hover:bg-niebla"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(true)}
        >
          <Icono nombre="menu" />
        </button>
        <span className="text-sm font-extrabold tracking-[0.12em]">SERVECO</span>
      </div>

      <main className="mx-auto max-w-web px-6 py-8">{children}</main>
    </div>
  );
}
