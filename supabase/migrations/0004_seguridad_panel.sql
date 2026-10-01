-- =====================================================================
-- SERVECO · 0004_seguridad_panel
-- El panel /administrator lee con la clave secreta DESPUÉS de comprobar
-- que el email está en ADMIN_EMAILS. Por tanto, ningún usuario con sesión
-- necesita leer el chat directamente: se quitan esas políticas.
-- (Supabase deja registrarse a cualquiera por defecto; con estas políticas,
--  cualquiera que se registrase podría leer las conversaciones.)
-- Pegar en Supabase → SQL Editor → Run, después de 0003. Idempotente.
-- =====================================================================

drop policy if exists "admin lee hilos"      on public.chat_threads;
drop policy if exists "admin lee mensajes"   on public.chat_messages;
drop policy if exists "admin lee kb"         on public.chatbot_kb;
drop policy if exists "admin gestiona notas" on public.chat_reviews;

revoke all on public.chat_threads, public.chat_messages, public.chatbot_kb, public.chat_reviews from authenticated, anon;
revoke all on public.contact_submissions from authenticated, anon;

-- Resultado: chat y contactos solo accesibles con la clave secreta (servidor).
