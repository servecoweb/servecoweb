import { exigirSesion } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ASESORIA, CONOCIO, SECTORES, TAMANOS, TIPOS, URGENCIAS, etiqueta } from '@/lib/crm';

/**
 * Exporta los contactos a CSV (Excel en español: separador «;» y BOM UTF-8).
 * Mismos filtros que la lista. Una ruta de descarga NO pasa por el layout del panel: el acceso se comprueba aquí.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { autorizado } = await exigirSesion();
  if (!autorizado) return new Response('No autorizado', { status: 403 });
  const db = supabaseAdmin();
  if (!db) return new Response('Falta configurar Supabase', { status: 500 });

  const p = new URL(request.url).searchParams;
  let q = db.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5000);
  for (const k of ['estado', 'prioridad', 'area', 'sede'] as const) {
    const v = p.get(k);
    if (v) q = q.eq(k, v);
  }
  const { data, error } = await q;
  if (error) return new Response(error.message, { status: 500 });

  const buscar = (p.get('q') ?? '').toLowerCase();
  const filas = (data ?? []).filter(
    (c) => !buscar || [c.nombre, c.empresa, c.email].some((v: string | null) => (v ?? '').toLowerCase().includes(buscar)),
  );

  const columnas: [string, (c: Record<string, unknown>) => unknown][] = [
    ['Fecha', (c) => new Date(String(c.created_at)).toLocaleString('es-ES')],
    ['Estado', (c) => c.estado],
    ['Prioridad', (c) => c.prioridad],
    ['Responsable', (c) => c.responsable],
    ['Seguimiento', (c) => c.seguimiento_el],
    ['Nombre', (c) => c.nombre],
    ['Empresa', (c) => c.empresa],
    ['Correo', (c) => c.email],
    ['Teléfono', (c) => c.telefono],
    ['Tipo', (c) => etiqueta(TIPOS, c.tipo as string)],
    ['Tamaño', (c) => etiqueta(TAMANOS, c.tamano as string)],
    ['Sector', (c) => etiqueta(SECTORES, c.sector as string)],
    ['Tiene asesoría', (c) => etiqueta(ASESORIA, c.tiene_asesoria as string)],
    ['Urgencia', (c) => etiqueta(URGENCIAS, c.urgencia as string)],
    ['Área', (c) => c.area],
    ['Despacho', (c) => c.sede],
    ['Nos conoció por', (c) => etiqueta(CONOCIO, c.como_conocio as string)],
    ['Escribió desde', (c) => c.origen],
    ['Página de entrada', (c) => c.pagina_entrada],
    ['Venía de', (c) => c.referrer],
    ['utm_source', (c) => c.utm_source],
    ['utm_medium', (c) => c.utm_medium],
    ['utm_campaign', (c) => c.utm_campaign],
    ['Idioma', (c) => c.idioma],
    ['Mensaje', (c) => c.mensaje],
  ];

  const celda = (v: unknown) => {
    const s = v === null || v === undefined || v === '—' ? '' : String(v);
    return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv =
    '\uFEFF' +
    [columnas.map(([t]) => t).join(';'), ...filas.map((c) => columnas.map(([, f]) => celda(f(c))).join(';'))].join('\r\n');

  const fecha = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="serveco-contactos-${fecha}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
