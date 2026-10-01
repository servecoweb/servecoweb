import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Clientes de Supabase para el SERVIDOR.
 * Proyecto hmhqzyhxyojuyyozjwuv · cuenta del cliente (org «Serveco»): nunca MCP, solo .env.local.
 *
 * - supabaseAdmin():   clave secreta. Salta RLS. Solo en server actions, rutas API y scripts.
 * - supabasePublico(): clave publicable. Respeta RLS: solo ve lo publicado.
 * Si faltan variables devuelven null, y quien llama usa los datos de ejemplo.
 */
let admin: SupabaseClient | null = null;
let publico: SupabaseClient | null = null;

const opciones = { auth: { persistSession: false, autoRefreshToken: false } };

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!admin) admin = createClient(url, key, opciones);
  return admin;
}

export function supabasePublico(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!publico) publico = createClient(url, key, opciones);
  return publico;
}
