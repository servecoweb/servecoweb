# servecoweb — web de Serveco Asesores

Next.js 16.3.3 · React 19.2.8 · TypeScript · Tailwind 4.3 · Supabase · OpenAI (GPT-6).
Estado a **1 oct 2026**. Repositorio: `https://github.com/servecoweb/servecoweb`. Vercel, pendiente.

Documentación: `AGENTS.md` (reglas para agentes, **leer primero**) · `../PLAN-ARRANQUE-WEB.md` (decisiones, pendientes y **bitácora de sesiones**) · `../ESTRATEGIA-SEO.md` (URLs y landings) · `../PLAN-SEO-PAGINAS.md` (qué debe tener cada página) · `docs/CHATBOT.md` · `docs/REDACTOR-BLOG.md` · `docs/CRM-CONTACTOS.md` · `docs/PANEL-ADMIN.md` · `docs/ENCARGO-CURSOR-DISENO.md` (diseño y blog, para Cursor) · `../EDITORIAL-BLOG.md`.
Diseño de referencia: `plantillas html/serveco-00-base-corporativa.html`.

## Arrancar en local

```bash
npm install
npm run dev          # http://localhost:3000 → /es
```

| Comando | Para qué |
|---|---|
| `npm run chat:ingest` | Carga el conocimiento del chatbot, incluido el contenido SEO de la web en ES y EN (también: botón en el panel) |
| `npm run chat:probar` | 24 preguntas difíciles al chatbot (14 ES, 9 EN, 1 alemán), calificadas 10/5/0. No guarda en BD |
| `npm run blog:redactar -- "tema" --area fiscal` | Redacta un artículo nuevo (también: «Redactar con IA» en `/administrator/blog`). Queda en borrador |
| `npx tsx scripts/redactar-articulo.ts --reescribir` | Reescribe los artículos existentes con título fijo y sin portada. **No lanzar dos a la vez** |
| `npx tsx scripts/redactar-articulo.ts --portadas` | Genera las portadas que falten |
| `npx tsx scripts/generar-escenas.ts` | Genera las escenas que falten en `public/escenas/` (salta las que existen; `--forzar` las rehace). **Hay 5 de sectores sin generar** |
| `npm run seo:redirecciones` | Mapa de redirecciones del WordPress: lee el sitemap de serveco.es (y `--gsc archivo.csv`), separa el hackeo, escribe `src/data/redirecciones.json` + `docs/REDIRECCIONES.md`. **Revisar antes de publicar** |
| `npm run db:migrate` | Aplica `supabase/migrations/*.sql` (necesita `SUPABASE_DB_URL`). Alternativa: SQL Editor |

## Qué está hecho

| Partida PDF | Estado |
|---|---|
| 01 Web corporativa | Páginas, diseño, escenas, sitemap, robots, cookies, mapa web. **Al nivel SEO:** 8 áreas, internacional, 6 fichas, PAE, subvenciones, hub de servicios (todo `validado: false`). Metadatos de la home, marcado de la organización, `/llms.txt`, borradores legales ES/EN, script de redirecciones. Falta: revisión visual (Cursor), datos legales de Serveco, H1 de la home, ejecutar y revisar redirecciones, apuntar el dominio a esta web. La zona viva (1 oct, funciona) está en `../DNS-ZONA-OVH.md`: correo en Microsoft 365 y web actual en Arsys |
| 02 12 landings | **Las 12 redactadas** con el reparto propuesto (fiscal ×5, laboral ×5, jurídico ×2), `src/data/landings-*.ts`, aviso «pendiente de reparto». Falta que Rafael lo confirme |
| 03 Inglés | 22 páginas; 8 áreas EN, internacional EN y hub EN al nivel SEO (contenido propio); legales EN. Chat multilingüe |
| 04 Blog | Público desde Supabase + panel, probado en local. Falta el rediseño (Cursor, `docs/ENCARGO-CURSOR-DISENO.md` Tarea B) y la formación |
| 05 Chatbot | Widget, RAG con todo el contenido de la web en ES y EN, revisor, límites, panel. `chat:ingest` 25 sep: 81 fragmentos. Mejor `chat:probar`: 9,8 / 10 |
| 06 Formulario | **Mini-CRM** (cualificación, prioridad, panel con embudo, notas, seguimiento, CSV, conversión), validación por campo, antispam + bandeja, par de correos. Falta: SMTP de Serveco y migración 0007. Ver `docs/CRM-CONTACTOS.md` |
| 07 Redactor + portadas | Funciona (artículos OK en local). Faltan portadas y probar la subida al bucket |
| Panel | Inicio (dashboard), contactos, blog, chatbot. Ver `docs/PANEL-ADMIN.md` |

## Estructura

```
src/
  proxy.ts                sesión de Supabase en /administrator (Next 16: sustituye a middleware)
  app/
    layout.tsx            html raíz; fuente con <link> (next/font falla detrás del proxy); noindex hasta producción
    globals.css           PIEL: tokens + @theme de Tailwind 4 + capas
    es/  en/              web pública (layout con .web, chat, banner cookies, Analytics)
    administrator/        login + (panel)/ inicio (dashboard) · contactos · blog · chatbot
    api/chat/             endpoint del chatbot
    sitemap.ts robots.ts
  components/             Header, Footer, HeroFondo, HeroRouter, EscenaFoto, SectoresCarrusel, AccesosIntl, IntlPortada, IntlPage,
                          DespachosIntl, ServiciosHub, DatosOrganizacion (schema de la firma),
                          ContenidoSeo (pieza SEO común), BuscadorExterno (iframe solo bajo demanda), OfficesList, ContactForm, CapturaVisita,
                          ChatWidget, CookieBanner, Analitica, MapaWeb, PageHead, LegalPage, admin/
  data/
    areas.ts              datos base de las 8 áreas
    areas-seo.ts          CONTENIDO SEO de las 8 áreas (H1, H2, servicios, FAQs) · validado: false
    intl-seo.ts           CONTENIDO SEO del silo internacional (portada, NIE, IRNR, Benidorm) ES + EN · validado: false
    sedes-seo.ts          CONTENIDO SEO de las 6 fichas de despacho (texto local, FAQs, zona atendida) · validado: false
    areas-seo-en.ts       CONTENIDO SEO de las 8 áreas en inglés (propio, no traducción) · validado: false
    paginas-seo.ts        CONTENIDO SEO de Punto PAE y Subvenciones · validado: false
    hub-seo.ts            CONTENIDO SEO de la página de servicios ES/EN + guía «¿Qué necesita?» · validado: false
    landings.ts           reúne las 12 landings: landings-fiscal.ts · landings-laboral.ts · landings-juridico.ts (tipo en landings-tipos.ts)
    redirecciones.json    301 del WordPress (lo genera seo:redirecciones; lo lee next.config.mjs)
    escenas.ts            qué escena va en cada página (18: 13 generadas + 5 de sectores pendientes)
    sectores.ts           carrusel «Conocemos su sector» (8 sectores, mismos id que el formulario)
    offices.ts internacional.ts team.ts posts.ts site.ts
  lib/
    rutas.ts              TODAS las URLs
    mapa-web.ts           TODAS las páginas que existen (mapa web + sitemap.xml)
    consentimiento.ts     cookies (criterio AEPD)
    crm.ts                mini-CRM: opciones del formulario, estados, prioridades, calcularPrioridad
    spam.ts               anti-spam silencioso (molde del taller + SEO, alfabeto ajeno, duplicados)
    contacto.ts           formulario → Supabase (+ nota inicial + correos con after())
    correo.ts             par de correos (SMTP + Nodemailer)
    admin.ts              acceso al panel (ADMIN_EMAILS)
    panel/resumen.ts      datos del panel de inicio
    chatbot/              ver docs/CHATBOT.md (incluye conocimiento-web.ts: contenido SEO ES + EN al RAG)
    blog/                 ver docs/REDACTOR-BLOG.md (redactor, controles, portadas, lectura pública)
    supabase/             servidor.ts, sesion.ts, navegador.ts
public/escenas/           13 escenas ilustrativas (WebP, gpt-image-2.5-sunburst) + 5 de sectores por generar
supabase/migrations/      0001 tablas · 0002 ejemplo · 0003 chatbot · 0004 seguridad · 0005 blog · 0006 CRM contactos · 0007 bandeja de spam
scripts/                  ingesta y pruebas del chat, redactor, escenas, migraciones
```

## Supabase

Proyecto `hmhqzyhxyojuyyozjwuv`, **org del cliente «Serveco» (Free)** → nunca MCP, solo `.env.local`.

| Migración | Estado |
|---|---|
| 0001 tablas + RLS | Aplicada (24 sep, recuento 6·8·8·2·3·4·3) |
| 0002 datos de ejemplo | Aplicada |
| 0003 chatbot | **Sin comprobar** |
| 0004 seguridad del panel | **Sin comprobar** |
| 0005 blog + redactor + bucket `blog` | Aplicada (24 sep, ~22:28). El bucket existe pero **aún no se ha subido nada** |
| 0006 CRM de contactos | Aplicada (24 sep, ~22:50). Columnas nuevas, `contact_notas`, checks de estado/prioridad/tipo y bloqueo de `anon` |
| 0007 bandeja de spam (`contact_spam`) | **Pendiente de aplicar** |

Tablas: `offices`, `office_locations`, `service_areas`, `seo_landings`, `intl_pages`, `team_members`, `blog_articles`, `contact_submissions`, `contact_notas`, `contact_spam`, `chat_threads`, `chat_messages`, `chatbot_kb`, `chat_reviews`.
**La web aún lee de `src/data/`** áreas, sedes, landings y equipo. El blog y el chat ya leen de Supabase. El contenido de `areas-seo.ts` todavía no está en el conocimiento del chatbot.

## Variables (`.env.local`, nunca al repo; nombres en `.env.example`)

`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SECRET_KEY` · `SUPABASE_SERVICE_ROLE_KEY` · `OPENAI_API_KEY` · `ADMIN_EMAILS` (rellenar) · `NEXT_PUBLIC_GA_ID` (`G-4KFYS5D4JF`, Consent Mode: sin cookies hasta aceptar) · **SMTP del formulario: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `SMTP_FROM`** (vacíos: la consulta se guarda pero no hay correos) · opcionales: `CHAT_MAX_DIARIO`, `CHAT_MODEL`, `CHAT_AUDITOR_MODEL`, `BLOG_REDACTOR_MODEL`, `BLOG_PORTADA_MODEL`, `BLOG_PORTADA_CALIDAD`, `SUPABASE_DB_URL`.
`NODE_TLS_REJECT_UNAUTHORIZED=0` **solo en este PC** (Norton / proxy). **Nunca en Vercel.**
Las claves de Supabase y OpenAI se pegaron en un chat el 24 sep: **rotarlas antes de producción.**

## Provisional (no olvidar)

- **Blog vacío en público:** los 3 artículos de ejemplo se están reescribiendo y quedan en borrador hasta que un abogado los firme.
- Textos de las 8 áreas: redacción de Eskala, `validado: false`. **Auditoría:** confirmar que Serveco está en el ROAC.
- Landings: 2 de ejemplo con relleno.
- Logo de cabecera: `public/images/logo-serveco-asesores.jpg`. El pie sigue con la marca dibujada (el JPG tiene fondo blanco).
- H1 de la home: pendiente de la línea del informe de Rafael.
- Sectores de la home y equipo: ejemplo / a validar. Sin retratos ni fachadas (no se generan con IA).
- Home `/en`: sin las tres escenas de sector.
- Teléfono de Balsicas (= central) y reparto de Yecla: verificar. Slug `juridico` vs `legal`: decidir.
- Chatbot: nombre y avatar provisionales.
- Política de privacidad: **borrador** (`/es/privacidad`) que cubre el formulario y su seguimiento; la valida Serveco. La inglesa sigue siendo plantilla.
- `public/hero-sala-src.mp4`: vídeo retirado del hero, se puede borrar.
- `robots.ts` bloquea todo (`EN_PRODUCCION = false`) y `layout.tsx` lleva `noindex`: quitar al publicar.
