-- =====================================================================
-- SERVECO · 0006_crm_contactos
-- Mini-CRM de consultas (partida 06 «Formularios y leads»).
--  · Preguntas de cualificación + origen del tráfico + prioridad calculada.
--  · Embudo: nuevo → contactado → cita → cliente / descartado.
--  · Responsable, fecha de seguimiento y notas con historial (tabla contact_notas).
-- Pegar en Supabase → SQL Editor → Run. Idempotente. Solo el servidor (clave secreta) lee y escribe.
-- =====================================================================

-- 1) Cualificación y origen
alter table public.contact_submissions add column if not exists tamano          text;  -- 1-9 · 10-49 · 50-249 · 250+
alter table public.contact_submissions add column if not exists sector          text;
alter table public.contact_submissions add column if not exists tiene_asesoria  text;  -- no · cambiar · puntual
alter table public.contact_submissions add column if not exists urgencia        text;  -- plazo · mes · sin_prisa
alter table public.contact_submissions add column if not exists como_conocio    text;  -- google · recomendacion · cliente · redes · otro
alter table public.contact_submissions add column if not exists referrer        text;  -- de qué web venía
alter table public.contact_submissions add column if not exists utm_source      text;
alter table public.contact_submissions add column if not exists utm_medium      text;
alter table public.contact_submissions add column if not exists utm_campaign    text;
alter table public.contact_submissions add column if not exists pagina_entrada  text;  -- primera página de la visita

-- 2) Gestión
alter table public.contact_submissions add column if not exists prioridad       text not null default 'media';
alter table public.contact_submissions add column if not exists responsable     text;
alter table public.contact_submissions add column if not exists seguimiento_el  date;
alter table public.contact_submissions add column if not exists estado_desde    timestamptz not null default now();
alter table public.contact_submissions add column if not exists updated_at      timestamptz not null default now();

-- 3) Estados nuevos del embudo (los antiguos se traducen, no se pierden)
alter table public.contact_submissions drop constraint if exists contact_submissions_estado_check;
update public.contact_submissions set estado = 'contactado' where estado in ('leido', 'respondido');
update public.contact_submissions set estado = 'descartado' where estado = 'archivado';
alter table public.contact_submissions add constraint contact_submissions_estado_check
  check (estado in ('nuevo', 'contactado', 'cita', 'cliente', 'descartado'));

alter table public.contact_submissions drop constraint if exists contact_submissions_prioridad_check;
alter table public.contact_submissions add constraint contact_submissions_prioridad_check
  check (prioridad in ('alta', 'media', 'baja'));

alter table public.contact_submissions drop constraint if exists contact_submissions_tipo_check;
alter table public.contact_submissions add constraint contact_submissions_tipo_check
  check (tipo in ('particular', 'autonomo', 'empresa'));

create index if not exists contact_submissions_estado_idx on public.contact_submissions(estado, prioridad);
create index if not exists contact_submissions_seguimiento_idx on public.contact_submissions(seguimiento_el) where seguimiento_el is not null;

drop trigger if exists contact_submissions_updated_at on public.contact_submissions;
create trigger contact_submissions_updated_at before update on public.contact_submissions
  for each row execute function public.set_updated_at();

-- 4) Notas e historial (cada cambio de estado deja una nota automática)
create table if not exists public.contact_notas (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references public.contact_submissions(id) on delete cascade,
  created_at  timestamptz not null default now(),
  autor       text not null,
  tipo        text not null default 'nota' check (tipo in ('nota', 'estado', 'sistema')),
  texto       text not null
);
create index if not exists contact_notas_contacto_idx on public.contact_notas(contact_id, created_at desc);

-- La nota libre antigua (columna `notas`) pasa al historial.
insert into public.contact_notas (contact_id, autor, tipo, texto)
select id, 'importado', 'nota', notas from public.contact_submissions
 where notas is not null and length(trim(notas)) > 0
   and not exists (select 1 from public.contact_notas n where n.contact_id = contact_submissions.id and n.autor = 'importado');

-- 5) Seguridad: nadie desde el navegador; solo service_role (panel en servidor).
alter table public.contact_notas enable row level security;
revoke all on public.contact_submissions from anon, authenticated;
revoke all on public.contact_notas from anon, authenticated;
grant all on public.contact_submissions, public.contact_notas to service_role;
