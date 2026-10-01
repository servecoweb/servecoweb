import { redirect } from 'next/navigation';
import { supabaseSesion } from '@/lib/supabase/sesion';

/**
 * Quién puede entrar al panel: SOLO los emails de ADMIN_EMAILS (.env.local y Vercel).
 * Supabase deja registrarse a cualquiera por defecto, así que «tener sesión» no basta.
 * Además: en Supabase → Authentication → Sign In / Providers, desactivar «Allow new users to sign up».
 */
export function emailsAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function usuarioActual() {
  const sb = await supabaseSesion();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

/** Sin sesión → al login. Con sesión: devuelve si es administrador. */
export async function exigirSesion() {
  const usuario = await usuarioActual();
  if (!usuario) redirect('/administrator/login');
  const autorizado = emailsAdmin().includes((usuario.email ?? '').toLowerCase());
  return { usuario, autorizado };
}

/** Para server actions: lanza si no es administrador. */
export async function exigirAdmin() {
  const { usuario, autorizado } = await exigirSesion();
  if (!autorizado) throw new Error('No autorizado');
  return usuario;
}
