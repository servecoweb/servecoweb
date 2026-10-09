<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SERVECO · web — guía para agentes (Cursor, Claude…)

> El bloque de arriba lo regenera `next dev`: no tocarlo. Esto de abajo es del proyecto.
> Español de España. Si un dato no está en estos documentos: «pendiente de confirmar», no inventar.

## Leer antes de tocar nada

1. `README.md` (este proyecto): estado, estructura, comandos, qué es provisional.
2. `../PLAN-ARRANQUE-WEB.md`: plan, **registro de decisiones** y pendientes.
3. `../ESTRATEGIA-SEO.md`: URLs, landings, recuentos frente al presupuesto. **`../PLAN-SEO-PAGINAS.md`: qué debe tener cada página (búsqueda, H1, H2, FAQs, schema). Ninguna página indexable se da por terminada sin cumplir su plantilla.**
4. `docs/CHATBOT.md`: cómo funciona el asistente. `docs/REDACTOR-BLOG.md`: redactor del blog y portadas. `docs/CRM-CONTACTOS.md`: formulario, prioridad, correos y panel de contactos. `docs/PANEL-ADMIN.md`: panel de inicio y mapa de `/administrator`. `docs/ENCARGO-CURSOR-DISENO.md`: **encargo de diseño y rediseño del blog para Cursor**. `docs/ENCARGO-CURSOR-TECNICO.md`: **encargo técnico para Cursor** (compilar, comprobar enlaces y schema, BD, chat, formulario, imágenes, redirecciones). `../EDITORIAL-BLOG.md`: línea editorial y temas.
5. Contexto del cliente: `../_CONTEXTO-PROYECTO.md`, `../INFORME-RAFAEL.md`. Lo que manda: el PDF aceptado `../EK-SV-2026-Presupuesto-Serveco-BORRADOR.pdf` (2.600 € + IVA, 7 partidas).
6. Taller: `../../LEEME-PRIMERO.md`, `../../AGENTS.md`, ficha SERVECO en `../../MAPA-PROYECTOS.md`.

## Documentación viva (obligatorio)

Todo lo que se decida o cambie en una conversación se escribe **en el mismo turno** en el `.md` que toque (decisión → `PLAN-ARRANQUE-WEB.md`; URLs/SEO → `ESTRATEGIA-SEO.md` / `PLAN-SEO-PAGINAS.md`; chatbot → `docs/CHATBOT.md`; redactor → `docs/REDACTOR-BLOG.md`; estado técnico → `README.md`). El chat no es el archivo.
**Al terminar cada sesión: entrada en la bitácora** (`../PLAN-ARRANQUE-WEB.md` § 7) con quién, qué archivos y qué queda.

## Dos agentes en el mismo proyecto (Claude y Cursor)

Ya ha pasado que uno pise al otro (`layout.tsx`, `redactor.ts`). Reglas:
- **Antes de editar, leer la bitácora** y abrir el archivo actual (no fiarse de lo que se recuerda).
- Reparto propuesto: **Cursor** = maquetación, imágenes, ejecución de scripts en local; **Claude** = contenido SEO, chatbot, redactor, documentación. Si hay que tocar un archivo del otro bloque, avisarlo en la bitácora.
- **No lanzar dos procesos del redactor a la vez** (`blog:redactar`, `--reescribir`, `--portadas`).

## Reglas del proyecto

- **Stack:** Next 16.3.3 · React 19.2.8 · TypeScript · **Tailwind 4.3** (sin `tailwind.config.js`; tokens en `@theme` de `src/app/globals.css`). Supabase (org del cliente «Serveco», ref `hmhqzyhxyojuyyozjwuv`): **nunca MCP**, solo `.env.local`.
- **URLs:** todas en `src/lib/rutas.ts`. **Páginas que existen:** `src/lib/mapa-web.ts` (de ahí salen `/es/sitemap`, `/en/sitemap` y `sitemap.xml`).
- **Cero huérfanos:** ningún enlace, botón ni menú que no lleve a una página existente. Si se crea una página, se añade a `mapa-web.ts`; si se quita, se quitan sus enlaces.
- **Alcance:** no crear páginas fuera del PDF (landings por trámite o por perfil = ampliación de pago) sin que Narciso lo pida.
- **CSS:** la web pública va dentro de `<div className="web">`; los paneles de `/administrator` no. Clase de texto largo: `.texto` (**no** `.prose`). Tailwind 4 = capas nativas: las utilidades ganan siempre.
- **Cookies (criterio AEPD del taller):** barra con Configurar · Rechazar todas · Aceptar todas (Rechazar con el mismo peso que Aceptar); interruptores **apagados** por defecto. No volver al molde Furgocasa antiguo.
- **Chat:** el chat de un visitante **no se borra nunca**. Prompt en Git (`src/lib/chatbot/prompt.ts`), nunca en el navegador. Tras cambiar el prompt: `npm run chat:probar`.
- **Blog:** el criterio del redactor vive en `src/lib/blog/editorial.ts` (prompts, enlaces permitidos, dominios oficiales, frases prohibidas, riesgos jurídicos, estilo de portadas). **Todo artículo nace en borrador; publicar exige «Revisado por»** (abogado de Serveco) y lo comprueba también la BD. No saltarse esta regla nunca.
- **SEO:** cada página indexable cumple su plantilla de `../PLAN-SEO-PAGINAS.md` (búsqueda principal única, H1, **H2 afirmativos, no en pregunta**, FAQs distintas de los H2, schema). El contenido vive en `src/data/*-seo.ts` (áreas ES y EN, internacional, fichas, PAE/subvenciones) y se pinta con `src/components/ContenidoSeo.tsx`. Todo `validado: false` hasta que lo revise Serveco.
- **Imágenes:** escenas ilustrativas en `public/escenas/` (pie «Imagen ilustrativa»). **Nunca** generar retratos del equipo ni fachadas de despachos con IA.
- **Formulario / CRM:** las opciones de cada pregunta, los estados, las prioridades y la regla de prioridad viven **solo** en `src/lib/crm.ts` (los usan formulario, guardado, correos, panel y exportación). El formulario **nunca** dice «enviado» si no se guardó, y **nunca pierde lo escrito** ante un error (el servidor devuelve los valores). Los datos que no escribe la persona (marca de tiempo antispam, origen) se añaden **al enviar**, nunca en campos ocultos (React 19 los vacía y el reintento se descartaría como bot). El origen de la visita solo con consentimiento analítico. Las consultas no se borran: se descartan.
- **Reparto (decisión 37, 25 sep):** **Cursor = todo lo visual** (maquetación, CSS, imágenes, blog, revisión con navegador); **Claude = contenido, SEO, chatbot, redactor y lógica.** Cursor no reescribe textos de `src/data/*-seo.ts` ni prompts: los anota en la bitácora. Claude no toca la maquetación de la home ni el blog.
- **Terceros:** nada que cargue solo (mapas incrustados, iframes, vídeos, fuentes de otros servidores salvo el `<link>` de Google Fonts). Si hace falta, se carga al pulsar (`BuscadorExterno`).
- **Redirecciones del WordPress:** solo desde datos reales (`npm run seo:redirecciones`, sitemap o export de GSC). Nunca inventarlas, nunca mandar a la portada lo que no tiene equivalente (soft 404) y nunca redirigir las URLs del hackeo.
- **DNS (9 oct 2026, corte hecho):** el dominio está en OVH (`ns111.ovh.net`, `dns111.ovh.net`). El correo es Microsoft 365, no el MX Plan de OVH. La web (`@` A `216.198.79.1`, `www` CNAME de Vercel) es el proyecto `servecoweb`. No reponer `mx*.mail.ovh.net`, `213.186.33.5` ni la A de Arsys `217.76.132.177`. Ficha: `../DNS-ZONA-OVH.md`.
- **Panel `/administrator`:** acceso solo para emails de `ADMIN_EMAILS`; los datos se leen con la clave secreta en el servidor. Las rutas de descarga (`route.ts`) no pasan por el layout: comprueban el acceso ellas mismas.
- **Secretos:** nunca `.env*` al repo ni claves en los `.md`. `NODE_TLS_REJECT_UNAUTHORIZED=0` va **solo** en el `.env.local` del PC de Narciso (Norton); **nunca en Vercel**.

## Trampas conocidas de este PC

- **Norton** intercepta HTTPS → `fetch failed` hacia OpenAI y Supabase. Arreglado con `NODE_TLS_REJECT_UNAUTHORIZED=0` en `.env.local` (solo local).
- **`next/font/google` cuelga la compilación** detrás del proxy (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`): la fuente va por `<link>` en `src/app/layout.tsx`. No volver a `next/font/google`.
- **Dropbox** sincroniza `.next` y crea «Copia en conflicto» → Turbopack no arranca. `.next` y `node_modules` deben estar ignorados por Dropbox (`Set-Content -Path .next -Stream com.dropbox.ignored -Value 1`). Si vuelve a pasar: parar el servidor y borrar `.next`.
- **Con `npm run dev` en marcha**, Windows no deja mover ni renombrar carpetas de `src` (EPERM).
- **Dos agentes a la vez** en este proyecto se pisan (ya pasó con `layout.tsx`). Antes de editar, revisar cambios recientes.

## Antes de un push

Repositorio: `https://github.com/servecoweb/servecoweb` (cuenta **servecoweb**). Vercel sigue pendiente. Antes de un push, avisar: si pide permiso, es esa cuenta.
