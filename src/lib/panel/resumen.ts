import { supabaseAdmin } from '@/lib/supabase/servidor';
import { emailsAdmin } from '@/lib/admin';

/**
 * Datos del panel de inicio (/administrator). Todo en servidor con la clave secreta.
 * Tolerante: si una tabla falta (migración sin aplicar), esa parte devuelve null y el resto sigue.
 * Ventanas: «30 días» frente a los 30 anteriores, para ver tendencia.
 */
const DIA = 24 * 60 * 60 * 1000;
const hace = (dias: number) => new Date(Date.now() - dias * DIA).toISOString();
const clave = (iso: string) => iso.slice(0, 10);

export type SerieDia = { dia: string; valor: number };

function serie(fechas: string[], dias: number): SerieDia[] {
  const cuenta = new Map<string, number>();
  for (const f of fechas) cuenta.set(clave(f), (cuenta.get(clave(f)) ?? 0) + 1);
  const out: SerieDia[] = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = clave(new Date(Date.now() - i * DIA).toISOString());
    out.push({ dia: d, valor: cuenta.get(d) ?? 0 });
  }
  return out;
}

const enVentana = (iso: string, desde: number, hasta = 0) => iso >= hace(desde) && iso < hace(hasta);

export async function obtenerResumen() {
  const db = supabaseAdmin();
  if (!db) return null;
  const hoy = clave(new Date().toISOString());

  const [contactosRes, abiertosRes, spamRes, hilosRes, preguntasRes, respuestasRes, notasRes, blogRes, kbRes] = await Promise.all([
    db
      .from('contact_submissions')
      .select('id, created_at, nombre, empresa, area, estado, prioridad, como_conocio, estado_desde')
      .gte('created_at', hace(60))
      .order('created_at', { ascending: false })
      .limit(3000),
    db
      .from('contact_submissions')
      .select('id, created_at, nombre, empresa, area, estado, prioridad, seguimiento_el')
      .in('estado', ['nuevo', 'contactado', 'cita'])
      .order('created_at', { ascending: false })
      .limit(2000),
    db.from('contact_spam').select('id', { count: 'exact', head: true }).gte('created_at', hace(7)),
    db.from('chat_threads').select('id, created_at').gte('created_at', hace(60)).limit(5000),
    db
      .from('chat_messages')
      .select('id, created_at, content, thread_id')
      .eq('role', 'user')
      .gte('created_at', hace(60))
      .order('created_at', { ascending: false })
      .limit(5000),
    db.from('chat_messages').select('id, created_at, content').eq('role', 'assistant').order('created_at', { ascending: false }).limit(5000),
    db.from('chat_reviews').select('message_id, score, notes, created_at').limit(5000),
    db.from('blog_articles').select('id, title, status, published_at, avisos, updated_at'),
    db.from('chatbot_kb').select('id', { count: 'exact', head: true }),
  ]);

  // ── Contactos
  const contactos = contactosRes.error ? null : contactosRes.data ?? [];
  const abiertos = abiertosRes.error ? null : abiertosRes.data ?? [];
  const cont =
    contactos && abiertos
      ? {
          nuevos: abiertos.filter((c) => c.estado === 'nuevo').length,
          altasSinAtender: abiertos.filter((c) => c.estado === 'nuevo' && c.prioridad === 'alta'),
          vencidos: abiertos.filter((c) => c.seguimiento_el && c.seguimiento_el <= hoy),
          ultimos30: contactos.filter((c) => enVentana(c.created_at, 30)).length,
          anteriores30: contactos.filter((c) => enVentana(c.created_at, 60, 30)).length,
          clientes30: contactos.filter((c) => c.estado === 'cliente' && c.estado_desde && c.estado_desde >= hace(30)).length,
          serie: serie(contactos.filter((c) => c.created_at >= hace(30)).map((c) => c.created_at), 30),
          recientes: contactos.slice(0, 6),
          origen: Object.entries(
            contactos
              .filter((c) => enVentana(c.created_at, 30))
              .reduce<Record<string, number>>((acc, c) => {
                const k = c.como_conocio ?? 'sin_dato';
                acc[k] = (acc[k] ?? 0) + 1;
                return acc;
              }, {}),
          ).sort((a, b) => b[1] - a[1]),
        }
      : null;
  const spam7 = spamRes.error ? null : spamRes.count ?? 0;

  // ── Chat
  const hilos = hilosRes.error ? null : hilosRes.data ?? [];
  const preguntas = preguntasRes.error ? null : preguntasRes.data ?? [];
  const respuestas = respuestasRes.error ? null : respuestasRes.data ?? [];
  const notas = notasRes.error ? null : notasRes.data ?? [];
  let chat = null;
  if (hilos && preguntas && respuestas && notas) {
    const calificadas = new Set(notas.map((n) => String(n.message_id)));
    const notas30 = notas.filter((n) => n.created_at >= hace(30));
    const incorrectas = notas
      .filter((n) => n.score === 0 && n.created_at >= hace(30))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 4)
      .map((n) => ({ ...n, respuesta: respuestas.find((r) => r.id === n.message_id)?.content ?? '' }));
    chat = {
      hilos30: hilos.filter((h) => enVentana(h.created_at, 30)).length,
      hilosAnteriores30: hilos.filter((h) => enVentana(h.created_at, 60, 30)).length,
      preguntas30: preguntas.filter((p) => enVentana(p.created_at, 30)).length,
      sinCalificar: respuestas.filter((r) => !calificadas.has(String(r.id))).length,
      media30: notas30.length ? notas30.reduce((s, n) => s + n.score, 0) / notas30.length : null,
      reparto30: {
        correcta: notas30.filter((n) => n.score === 10).length,
        mejorable: notas30.filter((n) => n.score === 5).length,
        incorrecta: notas30.filter((n) => n.score === 0).length,
      },
      serie: serie(hilos.filter((h) => h.created_at >= hace(30)).map((h) => h.created_at), 30),
      ultimasPreguntas: preguntas.slice(0, 6),
      incorrectas,
    };
  }

  // ── Blog
  const blog = blogRes.error
    ? null
    : (() => {
        const a = blogRes.data ?? [];
        const ahora = new Date().toISOString();
        const programados = a.filter((x) => x.status === 'scheduled' || (x.status === 'published' && x.published_at && x.published_at > ahora));
        return {
          borradores: a.filter((x) => x.status === 'draft'),
          conGraves: a.filter(
            (x) => x.status === 'draft' && Array.isArray(x.avisos) && x.avisos.some((v: { nivel?: string }) => v.nivel === 'grave'),
          ).length,
          publicados: a.filter((x) => x.status === 'published' && x.published_at && x.published_at <= ahora).length,
          publicados30: a.filter((x) => x.status === 'published' && x.published_at && x.published_at >= hace(30) && x.published_at <= ahora).length,
          proximo: programados.sort((p, q) => String(p.published_at).localeCompare(String(q.published_at)))[0] ?? null,
        };
      })();

  // ── Estado del sistema (sin mostrar valores, solo si está configurado)
  const smtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);
  const sistema = [
    { nombre: 'Base de datos (Supabase)', ok: true, detalle: 'Conectada' },
    { nombre: 'OpenAI (chat y redactor)', ok: Boolean(process.env.OPENAI_API_KEY), detalle: process.env.OPENAI_API_KEY ? 'Clave configurada' : 'Falta OPENAI_API_KEY' },
    {
      nombre: 'Conocimiento del chat',
      ok: !kbRes.error && (kbRes.count ?? 0) > 0,
      detalle: kbRes.error ? 'Falta la migración 0003' : `${kbRes.count ?? 0} fragmentos`,
    },
    {
      nombre: 'Correo del formulario (SMTP)',
      ok: smtp,
      detalle: smtp ? 'Configurado' : 'Sin configurar: las consultas se guardan, pero no llegan correos',
    },
    { nombre: 'Google Analytics', ok: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID), detalle: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID ? 'Activo (con consentimiento)' : 'Sin ID de medición' },
    { nombre: 'Bandeja de spam', ok: !spamRes.error, detalle: spamRes.error ? 'Falta la migración 0007' : 'Activa (30 días)' },
    { nombre: 'Administradores', ok: emailsAdmin().length > 0, detalle: `${emailsAdmin().length} con acceso` },
  ];

  return { contactos: cont, spam7, chat, blog, sistema };
}

export type Resumen = NonNullable<Awaited<ReturnType<typeof obtenerResumen>>>;
