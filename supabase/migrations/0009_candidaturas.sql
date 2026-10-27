-- =====================================================================
-- SERVECO · 0009_candidaturas
-- Quien pide empleo o prácticas no entra en contact_submissions.
-- Lo escribe el servidor (service_role). El visitante no escribe por anon.
-- =====================================================================
create table if not exists public.candidaturas (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null,
  email       text not null,
  telefono    text,
  tipo        text not null default 'empleo' check (tipo in ('empleo', 'practicas')),
  area        text,
  mensaje     text not null,
  idioma      text not null default 'es',
  origen      text,
  estado      text not null default 'nuevo'
                check (estado in ('nuevo', 'contactado', 'entrevista', 'descartado'))
);

create index if not exists candidaturas_fecha_idx on public.candidaturas (created_at desc);
create index if not exists candidaturas_estado_idx on public.candidaturas (estado);

alter table public.candidaturas enable row level security;
revoke all on public.candidaturas from anon, authenticated;
grant all on public.candidaturas to service_role;

notify pgrst, 'reload schema';
