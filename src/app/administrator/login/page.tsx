'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseNavegador } from '@/lib/supabase/navegador';

/** Login del panel. Solo staff: el visitante no se registra. Molde Neotérmica, sin Google. */
export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    const sb = supabaseNavegador();
    if (!sb) {
      setError('Falta configurar Supabase en .env.local.');
      setCargando(false);
      return;
    }
    const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password: clave });
    if (err) {
      const t = err.message.toLowerCase();
      setError(t.includes('invalid') ? 'Email o contraseña incorrectos.' : t.includes('confirm') ? 'Confirme el correo antes de entrar.' : err.message);
      setCargando(false);
      return;
    }
    router.replace('/administrator');
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-tinta px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-2xl font-extrabold tracking-wide text-white">
          SERVECO <span className="block text-sm font-medium tracking-normal text-white/60">Panel de administración</span>
        </p>
        <form onSubmit={(e) => void entrar(e)} className="space-y-4 rounded-2xl bg-papel p-8 shadow-2xl">
          <h1 className="text-xl font-bold">Iniciar sesión</h1>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca"
            />
          </div>
          <div>
            <label htmlFor="clave" className="mb-1 block text-sm font-semibold">Contraseña</label>
            <input
              id="clave"
              type="password"
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca"
            />
          </div>
          <button type="submit" disabled={cargando} className="w-full rounded-lg bg-marca py-3 font-semibold text-tinta hover:bg-marca-hover disabled:opacity-60">
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="text-center text-sm">
            <Link href="/es" className="text-tinta-2 hover:underline">← Volver a la web</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
