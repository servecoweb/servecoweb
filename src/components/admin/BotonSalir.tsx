'use client';

import { useRouter } from 'next/navigation';
import { supabaseNavegador } from '@/lib/supabase/navegador';

export default function BotonSalir({ claro = false }: { claro?: boolean }) {
  const router = useRouter();
  async function salir() {
    await supabaseNavegador()?.auth.signOut();
    router.replace('/administrator/login');
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={() => void salir()}
      className={claro ? 'rounded-md bg-white/10 px-3 py-1.5 hover:bg-white/20' : 'rounded-md border border-linea px-4 py-2 hover:bg-niebla'}
    >
      Cerrar sesión
    </button>
  );
}
