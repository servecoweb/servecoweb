-- =====================================================================
-- SERVECO · 0007_contact_spam
-- Lo que el filtro anti-spam descarta (src/lib/spam.ts) se guarda aquí 30 días para poder
-- revisarlo y recuperar un falso positivo desde /administrator/contactos. Luego se borra solo.
-- Pegar en Supabase → SQL Editor → Run. Idempotente. Solo service_role.
-- =====================================================================
create table if not exists public.contact_spam (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  motivo      text not null,
  email       text,
  nombre      text,
  extracto    text,             -- primeros 300 caracteres del mensaje
  datos       jsonb not null    -- la fila completa, para poder recuperarla tal cual
);
create index if not exists contact_spam_fecha_idx on public.contact_spam(created_at desc);

alter table public.contact_spam enable row level security;
revoke all on public.contact_spam from anon, authenticated;
grant all on public.contact_spam to service_role;

-- La API de Supabase (PostgREST) guarda en caché qué tablas existen: sin esto, la tabla nueva no se ve
-- («Could not find the table») hasta que se refresca sola. Visto en local el 25 sep.
notify pgrst, 'reload schema';
