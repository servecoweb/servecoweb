import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { AREAS } from '@/data/areas';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { redactarConIA } from './acciones';

/**
 * /administrator/blog (H4.3 + H7.1). Lista de artículos + «Redactar con IA».
 * La redacción tarda 2-5 min: maxDuration alto (en Vercel Hobby, activar Fluid Compute).
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type SP = Promise<{ error?: string; ok?: string }>;

const ESTADOS: Record<string, { texto: string; clase: string }> = {
  draft: { texto: 'Borrador', clase: 'bg-gray-100 text-gray-700' },
  scheduled: { texto: 'Programado', clase: 'bg-amber-100 text-amber-800' },
  published: { texto: 'Publicado', clase: 'bg-green-100 text-green-800' },
};

export default async function BlogAdmin({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  const { data, error } = await db
    .from('blog_articles')
    .select('id, slug, title, status, published_at, updated_at, category, avisos, revisado_por, cover_url')
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-semibold">No se puede leer el blog.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <p className="mt-3 text-sm">Si falta una columna: ejecutar <code>supabase/migrations/0005_blog_redactor.sql</code> en el SQL Editor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="text-sm text-tinta-2">Todo artículo nace como borrador. Para publicarlo, un abogado de Serveco debe revisarlo y firmar la revisión.</p>
      </div>

      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}

      <form action={redactarConIA} className="space-y-4 rounded-xl border border-linea bg-papel p-6">
        <div>
          <h2 className="text-lg font-bold">Redactar con IA</h2>
          <p className="text-sm text-tinta-2">
            El redactor planifica, investiga en fuentes oficiales (BOE, Agencia Tributaria, Seguridad Social…), escribe, lo revisa como editor jurídico,
            pasa los controles automáticos y genera la portada. Tarda entre 2 y 5 minutos. No cierre la página.
          </p>
        </div>
        <div>
          <label htmlFor="tema" className="mb-1 block text-sm font-semibold">Tema del artículo</label>
          <input
            id="tema"
            name="tema"
            required
            minLength={8}
            placeholder="Ej.: Cuándo compensa pasar de autónomo a sociedad limitada"
            className="w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="area" className="mb-1 block text-sm font-semibold">Área</label>
            <select id="area" name="area" className="w-full rounded-lg border border-linea px-3 py-2.5 text-base">
              <option value="">Que la elija el redactor</option>
              {AREAS.map((a) => (
                <option key={a.slug} value={a.slug}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notas" className="mb-1 block text-sm font-semibold">Notas del despacho (opcional)</label>
            <input
              id="notas"
              name="notas"
              placeholder="Enfoque, caso típico de nuestros clientes, qué evitar…"
              className="w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca"
            />
          </div>
        </div>
        <BotonEnviar texto="Redactar con IA" trabajando="Redactando… (2-5 min, no cierre la página)" />
      </form>

      <div className="overflow-x-auto rounded-xl border border-linea bg-papel">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-linea bg-niebla text-xs text-tinta-2">
            <tr>
              <th className="px-4 py-3">Artículo</th>
              <th className="px-4 py-3">Área</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Revisión</th>
              <th className="px-4 py-3">Avisos</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((a) => {
              const est = ESTADOS[String(a.status)] ?? ESTADOS.draft;
              const avisos = (a.avisos as { nivel: string }[] | null) ?? [];
              const graves = avisos.filter((x) => x.nivel === 'grave').length;
              return (
                <tr key={a.id} className="border-b border-niebla last:border-0 hover:bg-niebla">
                  <td className="px-4 py-3">
                    <Link href={`/administrator/blog/${a.id}`} className="font-semibold underline">{a.title}</Link>
                    <p className="text-xs text-tinta-2">/es/blog/{a.slug}{a.cover_url ? '' : ' · sin portada'}</p>
                  </td>
                  <td className="px-4 py-3">{a.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${est.clase}`}>{est.texto}</span>
                    {a.published_at && a.status !== 'draft' && (
                      <p className="mt-1 text-xs text-tinta-2">{new Date(String(a.published_at)).toLocaleDateString('es-ES')}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">{a.revisado_por || <span className="text-tinta-2">Pendiente</span>}</td>
                  <td className="px-4 py-3 text-xs">
                    {graves > 0 ? <span className="font-semibold text-red-700">{graves} grave(s)</span> : null}
                    {avisos.length - graves > 0 ? <span className="ml-2 text-amber-700">{avisos.length - graves} aviso(s)</span> : null}
                    {avisos.length === 0 ? <span className="text-green-700">Ninguno</span> : null}
                  </td>
                </tr>
              );
            })}
            {(data ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-tinta-2">Todavía no hay artículos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
