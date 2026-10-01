-- =====================================================================
-- SERVECO · 0003_chatbot
-- Chatbot IA (partida 05): hilos, mensajes, base de conocimiento (RAG),
-- notas del revisor 10/5/0 y la función de búsqueda vectorial.
-- Esquema copiado de Neotérmica (molde Laura / Nora) para reutilizar su código.
-- Pegar en Supabase → SQL Editor → Run. Idempotente.
-- =====================================================================

create extension if not exists vector;

-- Hilos y mensajes ----------------------------------------------------
create table if not exists public.chat_threads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  session_id    text not null,
  idioma        text not null default 'es',
  visitor_label text
);
create index if not exists chat_threads_session_idx on public.chat_threads (session_id);
create index if not exists chat_threads_created_at_idx on public.chat_threads (created_at desc);

create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references public.chat_threads (id) on delete cascade,
  created_at timestamptz not null default now(),
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  rag_gap    jsonb            -- qué buscó el RAG y qué encontró (para el revisor)
);
create index if not exists chat_messages_thread_idx on public.chat_messages (thread_id, created_at);

-- Base de conocimiento ------------------------------------------------
create table if not exists public.chatbot_kb (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source     text not null,   -- 'ficha' | 'area' | 'landing' | 'internacional' | 'blog'
  slug       text not null,
  content    text not null,
  embedding  vector(1536)     -- text-embedding-3-small
);
create unique index if not exists chatbot_kb_source_slug_idx on public.chatbot_kb (source, slug);
-- HNSW (no ivfflat): funciona bien con pocas filas y no hay que recrearlo tras la ingesta.
create index if not exists chatbot_kb_embedding_idx
  on public.chatbot_kb using hnsw (embedding vector_cosine_ops);

-- Notas del revisor (10 / 5 / 0) -------------------------------------
create table if not exists public.chat_reviews (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message_id uuid not null references public.chat_messages (id) on delete cascade,
  score      int not null check (score in (0, 5, 10)),
  notes      text
);
create unique index if not exists chat_reviews_message_idx on public.chat_reviews (message_id);

-- Búsqueda vectorial (la llama src/lib/chatbot/rag.ts) ----------------
create or replace function public.match_chatbot_kb (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (source text, slug text, content text, similarity float)
language sql stable
as $$
  select kb.source, kb.slug, kb.content, 1 - (kb.embedding <=> query_embedding) as similarity
  from public.chatbot_kb kb
  where kb.embedding is not null
    and 1 - (kb.embedding <=> query_embedding) > match_threshold
  order by kb.embedding <=> query_embedding
  limit match_count;
$$;

-- Seguridad -----------------------------------------------------------
-- El visitante NO lee nada: todo pasa por /api/chat con la clave secreta.
-- El administrador (login) lee hilos, mensajes y notas desde el panel.
-- NO hay política de borrado: el chat de un visitante no se borra nunca.
alter table public.chat_threads  enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chatbot_kb    enable row level security;
alter table public.chat_reviews  enable row level security;

drop policy if exists "admin lee hilos"      on public.chat_threads;
drop policy if exists "admin lee mensajes"   on public.chat_messages;
drop policy if exists "admin lee kb"         on public.chatbot_kb;
drop policy if exists "admin gestiona notas" on public.chat_reviews;

create policy "admin lee hilos"      on public.chat_threads  for select to authenticated using (true);
create policy "admin lee mensajes"   on public.chat_messages for select to authenticated using (true);
create policy "admin lee kb"         on public.chatbot_kb    for select to authenticated using (true);
create policy "admin gestiona notas" on public.chat_reviews  for all    to authenticated using (true) with check (true);

grant select on public.chat_threads, public.chat_messages, public.chatbot_kb to authenticated;
grant all on public.chat_reviews to authenticated;
grant all on public.chat_threads, public.chat_messages, public.chatbot_kb, public.chat_reviews to service_role;
grant execute on function public.match_chatbot_kb(vector, float, int) to service_role;
