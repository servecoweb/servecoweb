import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import BotonEnviar from '@/components/admin/BotonEnviar';
import { descartarBorrador, guardarArticulo, nuevaPortada } from '../acciones';

/** /administrator/blog/[id]: revisar, editar, regenerar portada, firmar revisión y publicar. */
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type Params = Promise<{ id: string }>;
type SP = Promise<{ error?: string; ok?: string }>;

const campo = 'w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca';
const etiqueta = 'mb-1 block text-sm font-semibold';

function aLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function EditarArticulo({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { id } = await params;
  const sp = await searchParams;
  const db = supabaseAdmin();
  if (!db) return <p>Falta configurar Supabase.</p>;

  const { data: a } = await db.from('blog_articles').select('*').eq('id', id).maybeSingle();
  if (!a) notFound();

  const avisos = (a.avisos as { nivel: 'grave' | 'aviso'; texto: string }[]) ?? [];
  const puntos = (a.puntos_revision as string[]) ?? [];
  const fuentes = (a.fuentes as { titulo: string; url: string }[]) ?? [];
  const faqs = (a.faqs as { q: string; a: string }[]) ?? [];

  return (
    <div className="space-y-6">
      <Link href="/administrator/blog" className="text-sm underline">← Volver al blog</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{a.title}</h1>
          <p className="text-sm text-tinta-2">
            {a.generado_con ? `Generado con ${a.generado_con}` : 'Artículo manual'} · información a fecha de {a.actualizado_a ?? '—'}
          </p>
        </div>
        {a.status !== 'draft' && (
          <Link href={`/es/blog/${a.slug}`} target="_blank" className="rounded-lg border border-linea bg-papel px-4 py-2 text-sm font-semibold">
            Ver en la web ↗
          </Link>
        )}
      </div>

      {sp.error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{sp.error}</p>}
      {sp.ok && <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{sp.ok}</p>}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Columna izquierda: portada + texto ── */}
        <div className="space-y-6">
          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-3 font-bold">Portada</h2>
            {a.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={String(a.cover_url)} alt={String(a.cover_alt ?? '')} className="mb-3 w-full rounded-lg" />
            ) : (
              <p className="mb-3 rounded-lg bg-niebla p-6 text-center text-sm text-tinta-2">Sin portada</p>
            )}
            <form action={nuevaPortada} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="id" value={a.id} />
              <input name="brief" placeholder="Opcional: describa la escena que quiere" className={campo} />
              <BotonEnviar
                texto="Nueva portada"
                trabajando="Generando…"
                className="whitespace-nowrap rounded-lg border border-linea bg-papel px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              />
            </form>
          </div>

          <form id="editar" action={guardarArticulo} className="space-y-4 rounded-xl border border-linea bg-papel p-5">
            <input type="hidden" name="id" value={a.id} />
            <div>
              <label className={etiqueta} htmlFor="title">Título (H1)</label>
              <input id="title" name="title" defaultValue={a.title} required className={campo} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={etiqueta} htmlFor="seo_title">Título para Google (≤ 60)</label>
                <input id="seo_title" name="seo_title" defaultValue={a.seo_title ?? ''} maxLength={70} className={campo} />
              </div>
              <div>
                <label className={etiqueta} htmlFor="slug">URL (/es/blog/…)</label>
                <input id="slug" name="slug" defaultValue={a.slug} className={campo} />
              </div>
            </div>
            <div>
              <label className={etiqueta} htmlFor="excerpt">Extracto (≤ 200)</label>
              <textarea id="excerpt" name="excerpt" defaultValue={a.excerpt ?? ''} maxLength={220} rows={2} className={campo} />
            </div>
            <div>
              <label className={etiqueta} htmlFor="meta_description">Meta description (140-160)</label>
              <textarea id="meta_description" name="meta_description" defaultValue={a.meta_description ?? ''} maxLength={170} rows={2} className={campo} />
            </div>
            <div>
              <label className={etiqueta} htmlFor="cover_alt">Texto alternativo de la portada</label>
              <input id="cover_alt" name="cover_alt" defaultValue={a.cover_alt ?? ''} className={campo} />
            </div>
            <div>
              <label className={etiqueta} htmlFor="body_md">Cuerpo (Markdown: ## apartado, - lista, [texto](/ruta))</label>
              <textarea id="body_md" name="body_md" defaultValue={a.body_md ?? ''} rows={28} className={`${campo} font-mono text-sm`} />
              <p className="mt-1 text-xs text-tinta-2">Al guardar se vuelven a pasar los controles automáticos (enlaces, longitud, riesgos).</p>
            </div>

            <div className="space-y-4 rounded-lg border-2 border-marca bg-marca-suave p-4">
              <h2 className="font-bold">Revisión jurídica y publicación</h2>
              <div>
                <label className={etiqueta} htmlFor="revisado_por">Revisado por (abogado de Serveco)</label>
                <input
                  id="revisado_por"
                  name="revisado_por"
                  defaultValue={a.revisado_por ?? ''}
                  placeholder="Nombre y apellidos"
                  className={campo}
                />
                <p className="mt-1 text-xs text-tinta-2">Obligatorio para publicar o programar. Al firmar, confirma que ha comprobado los puntos de la derecha.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={etiqueta} htmlFor="status">Estado</label>
                  <select id="status" name="status" defaultValue={a.status} className={campo}>
                    <option value="draft">Borrador (no visible)</option>
                    <option value="scheduled">Programado</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
                <div>
                  <label className={etiqueta} htmlFor="published_at">Fecha (si es programado)</label>
                  <input id="published_at" name="published_at" type="datetime-local" defaultValue={aLocal(a.published_at as string | null)} className={campo} />
                </div>
              </div>
              <BotonEnviar texto="Guardar" trabajando="Guardando…" />
            </div>
          </form>

          {a.status === 'draft' && (
            <form action={descartarBorrador}>
              <input type="hidden" name="id" value={a.id} />
              <BotonEnviar
                texto="Descartar este borrador"
                trabajando="Descartando…"
                confirmar="¿Descartar este borrador? No se puede deshacer."
                className="text-sm text-red-700 underline"
              />
            </form>
          )}
        </div>

        {/* ── Columna derecha: lo que hay que revisar ── */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-3 font-bold">Controles automáticos</h2>
            {avisos.length === 0 ? (
              <p className="text-sm text-green-700">Sin avisos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {avisos.map((x, i) => (
                  <li key={i} className={x.nivel === 'grave' ? 'text-red-700' : 'text-amber-800'}>
                    {x.nivel === 'grave' ? '✗ ' : '~ '}
                    {x.texto}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border-2 border-marca bg-papel p-5">
            <h2 className="mb-1 font-bold">Qué debe comprobar el abogado</h2>
            <p className="mb-3 text-xs text-tinta-2">Lista preparada por el editor jurídico (IA). No sustituye a la lectura completa.</p>
            {puntos.length === 0 ? (
              <p className="text-sm text-tinta-2">—</p>
            ) : (
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                {puntos.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            )}
          </div>

          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-3 font-bold">Fuentes oficiales</h2>
            {fuentes.length === 0 ? (
              <p className="text-sm text-red-700">Ninguna. No publicar sin fuentes.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {fuentes.map((f, i) => (
                  <li key={i}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline">{f.titulo}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-linea bg-papel p-5">
            <h2 className="mb-3 font-bold">Preguntas frecuentes</h2>
            {faqs.length === 0 ? (
              <p className="text-sm text-tinta-2">—</p>
            ) : (
              <dl className="space-y-3 text-sm">
                {faqs.map((f, i) => (
                  <div key={i}>
                    <dt className="font-semibold">{f.q}</dt>
                    <dd className="text-tinta-2">{f.a}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
