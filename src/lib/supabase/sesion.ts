import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente con la SESIÓN del usuario (cookies). Solo para saber quién ha iniciado sesión.
 * Los datos del panel se leen con supabaseAdmin() después de comprobar que es administrador.
 * Next 16: cookies() es asíncrono.
 */
export async function supabaseSesion() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(lista) {
        try {
          lista.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Desde un Server Component no se pueden escribir cookies: el proxy refresca la sesión.
        }
      },
    },
  });
}
