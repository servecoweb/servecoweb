import type { TipoCandidatura } from '@/lib/candidatos';
import { supabaseAdmin } from '@/lib/supabase/servidor';

/**
 * Escritura en `candidaturas`. No es una server action: solo la llaman el formulario de empleo
 * y el de contacto, cuando el mensaje pide trabajo. El navegador no importa este archivo.
 */
export type Candidatura = {
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: TipoCandidatura;
  area: string | null;
  mensaje: string;
  idioma: 'es' | 'en';
  origen: string | null;
};

/** False si la base no está o el insert falla. Un duplicado exacto cuenta como guardado. */
export async function guardarCandidatura(c: Candidatura): Promise<boolean> {
  const db = supabaseAdmin();
  if (!db) return false;
  const { data: repetida } = await db.from('candidaturas').select('id').eq('email', c.email).eq('mensaje', c.mensaje).limit(1);
  if (repetida && repetida.length > 0) return true;
  const { error } = await db.from('candidaturas').insert({
    nombre: c.nombre,
    email: c.email,
    telefono: c.telefono,
    tipo: c.tipo,
    area: c.area,
    mensaje: c.mensaje,
    idioma: c.idioma,
    origen: c.origen,
  });
  if (error) {
    console.error('[candidatura] no se pudo guardar:', error.message);
    return false;
  }
  return true;
}
