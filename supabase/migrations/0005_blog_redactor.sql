-- =====================================================================
-- SERVECO · 0005_blog_redactor
-- Partidas 04 (panel del blog) y 07 (redactor + portadas).
-- Campos nuevos en blog_articles + almacén público de portadas (Storage «blog»).
-- Pegar en Supabase → SQL Editor → Run. Idempotente.
-- =====================================================================

alter table public.blog_articles add column if not exists seo_title        text;
alter table public.blog_articles add column if not exists meta_description text not null default '';
alter table public.blog_articles add column if not exists focus_keyword    text;
alter table public.blog_articles add column if not exists area_slug        text references public.service_areas(slug) on update cascade on delete set null;
alter table public.blog_articles add column if not exists body_md          text;              -- fuente en Markdown (el redactor escribe aquí; body = HTML)
alter table public.blog_articles add column if not exists faqs             jsonb not null default '[]'::jsonb;
alter table public.blog_articles add column if not exists fuentes          jsonb not null default '[]'::jsonb;  -- [{titulo,url}]
alter table public.blog_articles add column if not exists cover_alt        text;
alter table public.blog_articles add column if not exists cover_prompt     text;
alter table public.blog_articles add column if not exists avisos           jsonb not null default '[]'::jsonb;  -- controles automáticos
alter table public.blog_articles add column if not exists puntos_revision  jsonb not null default '[]'::jsonb;  -- qué debe comprobar el abogado
alter table public.blog_articles add column if not exists revisado_por     text;              -- nombre del abogado que valida
alter table public.blog_articles add column if not exists revisado_at      timestamptz;
alter table public.blog_articles add column if not exists generado_con     text;              -- modelo + fecha, trazabilidad
alter table public.blog_articles add column if not exists actualizado_a    date;              -- «información a fecha de»

-- Publicar exige revisión jurídica (PDF: «Un abogado de Serveco valida lo jurídico antes de publicar»).
-- Los 3 artículos de ejemplo (0002) están publicados sin revisión: se marcan como tales para no romper la regla.
update public.blog_articles
   set revisado_por = 'EJEMPLO — sin revisar (borrar antes de publicar la web)'
 where status <> 'draft' and (revisado_por is null or length(trim(revisado_por)) = 0);

alter table public.blog_articles drop constraint if exists blog_publicar_requiere_revision;
alter table public.blog_articles add constraint blog_publicar_requiere_revision
  check (status = 'draft' or (revisado_por is not null and length(trim(revisado_por)) > 0));

-- Almacén de portadas: público para leer; solo el servidor (clave secreta) escribe.
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do update set public = true;
