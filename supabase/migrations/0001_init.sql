-- =====================================================================
-- SERVECO · 0001_init
-- Tablas de contenido de la web + blog + formulario de contacto.
-- Se aplica con `npm run db:migrate` (o pegándolo en el SQL Editor de Supabase).
-- Es idempotente: se puede ejecutar dos veces sin romper nada.
--
-- NO incluye todavía el chatbot (chat_threads, chat_messages, chatbot_kb):
-- llegará en su propia migración copiando el esquema exacto de Neotérmica.
-- =====================================================================

create extension if not exists pgcrypto;

-- updated_at automático --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- SEDES
-- =====================================================================
create table if not exists public.offices (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  ciudad      text not null,
  zona        text not null,
  central     boolean not null default false,
  orden       int not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.office_locations (
  id           uuid primary key default gen_random_uuid(),
  office_slug  text not null references public.offices(slug) on update cascade on delete cascade,
  direccion    text not null,
  tel          text not null,
  lat          double precision,
  lng          double precision,
  orden        int not null default 0
);
create index if not exists office_locations_office_idx on public.office_locations(office_slug);

-- =====================================================================
-- ÁREAS
-- =====================================================================
create table if not exists public.service_areas (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  slug_en     text not null unique,
  nombre      text not null,
  nombre_en   text not null,
  grupo       text not null check (grupo in ('empresa', 'personas', 'crecimiento')),
  resumen     text not null,
  resumen_en  text not null,
  intro       text not null default '',
  intro_en    text not null default '',
  incluye     text[] not null default '{}',
  incluye_en  text[] not null default '{}',
  orden       int not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- LANDINGS SEO (una fila = una URL /servicios/[area]/[sede])
-- =====================================================================
create table if not exists public.seo_landings (
  id                uuid primary key default gen_random_uuid(),
  area_slug         text not null references public.service_areas(slug) on update cascade,
  office_slug       text not null references public.offices(slug) on update cascade,
  title             text not null,
  meta_description  text not null default '',
  h1                text not null,
  lead              text not null default '',
  para_quien        text[] not null default '{}',
  cuando_h2         text not null default '',
  cuando_texto      text not null default '',
  que_hacemos       text[] not null default '{}',
  pasos             text[] not null default '{}',
  angulo_local      text not null default '',
  faqs              jsonb not null default '[]'::jsonb,
  cta               text not null default '',
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (area_slug, office_slug)
);

-- =====================================================================
-- SILO INTERNACIONAL (NIE, IRNR, Benidorm… · ES + EN)
-- =====================================================================
create table if not exists public.intl_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  slug_en     text not null unique,
  titulo      text not null,
  titulo_en   text not null,
  lead        text not null default '',
  lead_en     text not null default '',
  puntos      text[] not null default '{}',
  puntos_en   text[] not null default '{}',
  orden       int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =====================================================================
-- EQUIPO
-- =====================================================================
create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  cargo        text not null default '',
  cargo_en     text not null default '',
  area_slug    text references public.service_areas(slug) on update cascade on delete set null,
  office_slug  text references public.offices(slug) on update cascade on delete set null,
  foto_url     text,
  bio          text not null default '',
  bio_en       text not null default '',
  orden        int not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- =====================================================================
-- BLOG (H4.1: slug, title, excerpt, body, cover, status, published_at)
-- =====================================================================
create table if not exists public.blog_articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null default '',
  body          text not null default '',
  cover_url     text,
  category      text not null default '',
  tags          text[] not null default '{}',
  author        text not null default 'Serveco Asesores',
  status        text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists blog_articles_pub_idx on public.blog_articles(status, published_at desc);

-- =====================================================================
-- FORMULARIO DE CONTACTO (H6.2)
-- Sin lectura pública: solo el servidor (clave secreta) escribe y lee.
-- =====================================================================
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  tipo        text not null default 'particular',
  nombre      text not null,
  empresa     text,
  email       text not null,
  telefono    text,
  area        text,
  sede        text,
  mensaje     text not null,
  idioma      text not null default 'es',
  origen      text,
  estado      text not null default 'nuevo' check (estado in ('nuevo', 'leido', 'respondido', 'archivado')),
  notas       text
);
create index if not exists contact_submissions_fecha_idx on public.contact_submissions(created_at desc);

-- =====================================================================
-- TRIGGERS updated_at
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['offices','service_areas','seo_landings','intl_pages','team_members','blog_articles'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
end $$;

-- =====================================================================
-- SEGURIDAD (RLS): la web solo LEE lo publicado. Nadie escribe desde el navegador.
-- =====================================================================
alter table public.offices              enable row level security;
alter table public.office_locations     enable row level security;
alter table public.service_areas        enable row level security;
alter table public.seo_landings         enable row level security;
alter table public.intl_pages           enable row level security;
alter table public.team_members         enable row level security;
alter table public.blog_articles        enable row level security;
alter table public.contact_submissions  enable row level security;

drop policy if exists "lectura publica" on public.offices;
create policy "lectura publica" on public.offices for select to anon, authenticated using (activo);

drop policy if exists "lectura publica" on public.office_locations;
create policy "lectura publica" on public.office_locations for select to anon, authenticated using (true);

drop policy if exists "lectura publica" on public.service_areas;
create policy "lectura publica" on public.service_areas for select to anon, authenticated using (activo);

drop policy if exists "lectura publica" on public.seo_landings;
create policy "lectura publica" on public.seo_landings for select to anon, authenticated using (published);

drop policy if exists "lectura publica" on public.intl_pages;
create policy "lectura publica" on public.intl_pages for select to anon, authenticated using (published);

drop policy if exists "lectura publica" on public.team_members;
create policy "lectura publica" on public.team_members for select to anon, authenticated using (published);

drop policy if exists "lectura publica" on public.blog_articles;
create policy "lectura publica" on public.blog_articles for select to anon, authenticated
  using (status = 'published' and published_at <= now());

-- contact_submissions: sin políticas → anon/authenticated no ven ni escriben nada.

-- Permisos explícitos (proyectos nuevos de Supabase ya no los dan por defecto)
grant usage on schema public to anon, authenticated, service_role;
grant select on public.offices, public.office_locations, public.service_areas, public.seo_landings,
  public.intl_pages, public.team_members, public.blog_articles to anon, authenticated;
grant all on all tables in schema public to service_role;
