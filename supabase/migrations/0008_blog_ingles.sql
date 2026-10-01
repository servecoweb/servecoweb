-- =====================================================================
-- SERVECO · 0008_blog_ingles
-- Blog bilingüe: cada artículo en español tiene su versión inglesa, que es OTRA fila de blog_articles
-- (su estado, su firma de revisión, su slug y su URL /en/blog/…), enlazada con translation_of.
-- Pegar en Supabase → SQL Editor → Run. Idempotente.
-- =====================================================================

alter table public.blog_articles add column if not exists lang text not null default 'es';
alter table public.blog_articles drop constraint if exists blog_articles_lang_check;
alter table public.blog_articles add constraint blog_articles_lang_check check (lang in ('es', 'en'));

-- Enlace EN → ES. «set null» y no «cascade»: descartar un borrador español nunca borra un inglés publicado.
alter table public.blog_articles add column if not exists translation_of uuid references public.blog_articles(id) on delete set null;

-- Fecha de la versión española que se tradujo: si el español cambia después, el panel avisa de que el inglés
-- está desactualizado y permite retraducirlo.
alter table public.blog_articles add column if not exists origen_actualizado_at timestamptz;

-- Una sola versión inglesa por artículo español; una traducción es siempre inglesa y nunca apunta a sí misma.
create unique index if not exists blog_articles_una_traduccion on public.blog_articles(translation_of) where translation_of is not null;
alter table public.blog_articles drop constraint if exists blog_traduccion_coherente;
alter table public.blog_articles add constraint blog_traduccion_coherente
  check (translation_of is null or (lang = 'en' and translation_of <> id));

create index if not exists blog_articles_lang_estado_idx on public.blog_articles(lang, status, published_at desc);

-- La regla de publicación (blog_publicar_requiere_revision, 0005) vale igual para el inglés:
-- ninguna versión se publica sin «Revisado por».
