# Encargo para Cursor: comprobaciones técnicas y puesta a punto (25 sep 2026)

*Redactado por Claude. Claude escribe el código sin poder compilarlo ni ejecutarlo; Cursor tiene terminal, red y navegador en el PC de Narciso. Este encargo es para **comprobar que todo funciona de verdad** y dejarlo listo para una URL de pruebas. Complementa a `ENCARGO-CURSOR-DISENO.md` (diseño y blog), que sigue en pie.*

**Antes de empezar:** leer `AGENTS.md` y la bitácora (`../PLAN-ARRANQUE-WEB.md` § 7). Al terminar cada bloque, entrada en la bitácora con lo hecho, lo que falló y lo que queda.

## Reglas

1. **No reescribir contenido** (`src/data/*-seo.ts`, `landings-*.ts`, legales, prompts). Si un texto provoca un error técnico, arreglar lo técnico y anotar el texto para Claude.
2. **Arreglar errores sin cambiar comportamiento.** Si para compilar hay que cambiar lógica, anotarlo y explicarlo en la bitácora.
3. **Secretos:** nada de `.env*` al repositorio ni claves en los `.md`. `NODE_TLS_REJECT_UNAUTHORIZED=0` solo en el `.env.local` de este PC.
4. **Base de datos:** no borrar nada salvo lo que se indica aquí. Las consultas de prueba se marcan como «Descartado», no se borran.

---

## Bloque 1 · Que compile (lo primero)

1. `npm install` (entra `nodemailer`).
2. `npm run lint` y `npm run build`. **Arreglar todos los errores de tipos y de lint.** Sospechosos por orden de probabilidad (código nuevo sin compilar):
   - `src/data/landings*.ts` y `src/app/es/servicios/[area]/[sede]/page.tsx` (tipo `Landing` nuevo = `PaginaSeo` + área/sede).
   - `src/components/ContenidoSeo.tsx` (`EsquemasSeo`: `proveedor` con campos `undefined`).
   - `src/components/ContactForm.tsx` y `src/lib/contacto.ts` (tipo `EstadoForm`, acción envuelta en `enviar`).
   - `src/lib/panel/resumen.ts` y `src/app/administrator/(panel)/page.tsx` (tipos de Supabase).
   - `src/app/administrator/(panel)/contactos/*` (acciones, exportación CSV, bandeja de spam).
   - `src/lib/chatbot/conocimiento-web.ts` (importa todos los `*-seo.ts` y `landings`).
   - `src/app/llms.txt/route.ts`, `next.config.mjs` (lee `src/data/redirecciones.json`).
   - Cualquier sitio que aún use campos antiguos de las landings (`paraQuien`, `cuandoH2`, `queHacemos`, `pasos`, `anguloLocal`): ya no existen.
3. Arrancar `npm run dev` y abrir sin errores en consola: `/es`, `/en`, `/es/servicios`, `/en/services`, una área ES y EN, `/es/internacional`, `/en/international`, una ficha de despacho, **tres landings** (`/es/servicios/fiscal/benidorm`, `/es/servicios/laboral/balsicas`, `/es/servicios/juridico/lorca`), `/es/punto-pae`, `/es/subvenciones`, las 6 legales (ES y EN), `/llms.txt`, `/sitemap.xml`, `/es/sitemap` y el panel (`/administrator`, contactos, blog, chatbot).

## Bloque 2 · Enlaces y datos estructurados (script)

4. Escribir `scripts/comprobar-web.ts` (`npm run web:comprobar`) que, con el servidor de desarrollo en marcha:
   - Lea todas las URLs de `/sitemap.xml` y las pida una a una: **todas deben dar 200**.
   - En cada página, extraiga los enlaces internos (`href` que empiezan por `/es`, `/en` o `/`) y compruebe que también dan 200. **Informe de enlaces rotos**, con la página donde aparecen.
   - Extraiga cada `<script type="application/ld+json">` y compruebe que es JSON válido y que tiene `@context` y `@type`.
   - Compruebe que cada página tiene **un solo H1**, `<title>` y `meta description`, y que ningún `<title>` se repite entre páginas.
   - Cuente los H2 que terminan en «?» fuera del bloque de FAQs (decisión 27: no debería haber ninguno).
   - Deje el informe en `docs/COMPROBACION-WEB.md`.
5. Arreglar lo técnico que salga (enlaces mal construidos, rutas que no existen). Lo que sea de texto, anotarlo para Claude.

## Bloque 3 · Base de datos y chat

6. Supabase (SQL Editor o `npm run db:migrate`):
   - Aplicar **`0007_contact_spam.sql`**.
   - Comprobar que existen `chat_threads`, `chat_messages`, `chatbot_kb` y `chat_reviews` (migraciones 0003 y 0004).
   - **Borrar las 2 filas de ejemplo de `seo_landings`** (fiscal-yecla y laboral-benidorm con «Texto de ejemplo»): el chat las sigue leyendo.
7. `npm run chat:ingest` y `npm run chat:probar`. Anotar en la bitácora la media y **copiar literalmente las respuestas que saquen 5 o 0 con la nota del revisor**, para que Claude ajuste el prompt.

## Bloque 4 · Formulario, CRM y spam (prueba real en local)

8. Enviar desde `/es/contacto`:
   - Una consulta de **particular** con consulta puntual y sin prisa → debe salir con prioridad **baja**.
   - Una de **empresa** de 10-49 trabajadores que **quiere cambiar de asesoría** → prioridad **alta**.
   - Una de **autónomo** con **plazo o requerimiento** → prioridad **alta**.
   - El formulario **vacío** y con mensaje «hola» → errores por campo en rojo **sin perder lo escrito**; corregir y reenviar → debe guardarse.
   - Una con texto de spam («Get on the first page of Google, SEO audit free») → **no** aparece en contactos y **sí** en la bandeja «Filtrado como spam»; recuperarla con el botón → pasa a contactos con su nota.
9. En `/administrator/contactos`: cambiar estado, prioridad, responsable y fecha de seguimiento en una consulta y comprobar las notas automáticas; **exportar a CSV** y abrirlo en Excel (acentos bien, columnas separadas). Marcar todas las de prueba como «Descartado».
10. Comprobar que el inicio del panel (`/administrator`) refleja lo anterior (tarjetas de «Requiere atención», gráficas, estado del sistema).

## Bloque 5 · Imágenes, portadas y redirecciones

11. `npx tsx scripts/generar-escenas.ts` (solo genera las 5 de sectores que faltan) y revisar que se ven en el carrusel de la home.
12. Terminar el blog: si el `--reescribir` ya acabó, `npx tsx scripts/redactar-articulo.ts --portadas` y comprobar la primera subida al bucket `blog`.
13. `npm run seo:redirecciones` (lee el sitemap público de serveco.es). Revisar `docs/REDIRECCIONES.md`: **no decidir las dudosas**, solo dejarlas listadas para Narciso. Comprobar que `npm run build` sigue pasando con el JSON generado.

## Bloque 6 · Preparar la URL de pruebas (sin publicar en el dominio)

14. Revisar `.gitignore` (que excluya `.env*`, `.next`, `node_modules`, `*.local`) y que no haya claves en ningún archivo del proyecto (buscar `sk-`, `sb_secret`, `service_role`, `eyJ`).
15. **No crear el repositorio ni el proyecto de Vercel** hasta que Narciso decida las cuentas (pendiente en el plan § 5). Dejar anotado en la bitácora qué variables de entorno hacen falta en Vercel (lista en `README.md`) y que el redactor necesita **Fluid Compute** o una duración máxima alta.

---

## Al terminar

Entrada en la bitácora por bloque: qué pasó, qué se arregló (archivos), cifras (`chat:probar`, enlaces rotos, Lighthouse si da tiempo) y **lista de lo que queda para Claude** (textos, prompt del chat) **y para Narciso** (decisiones, cuentas, redirecciones dudosas).
