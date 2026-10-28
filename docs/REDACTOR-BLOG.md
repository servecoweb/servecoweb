# Redactor del blog y portadas (partidas 04 y 07)

*24 sep 2026. Base: redactor de Neotérmica, rehecho para un despacho (rigor jurídico, fuentes oficiales, revisión obligatoria).*
Línea editorial y temas: `../EDITORIAL-BLOG.md` (en la W).

## Archivos

| Archivo | Qué hace |
|---|---|
| `src/lib/blog/editorial.ts` | **Todo el criterio**: modelos, prompts de las 3 fases, enlaces internos permitidos, dominios oficiales, frases prohibidas, patrones de riesgo jurídico, guía de estilo de portadas |
| `src/lib/blog/redactor.ts` | Pipeline de 6 fases + `reprocesar()` tras editar a mano |
| `src/lib/blog/openai.ts` | Llamadas a OpenAI: reintentos, respuesta vacía, búsqueda en background, imágenes |
| `src/lib/blog/controles.ts` | Controles automáticos (código): retira enlaces no permitidos, genera avisos |
| `src/lib/blog/portada.ts` | Portada `gpt-image-2` → Storage «blog» |
| `blog/acciones.ts` → `subirPortada` | Sustituye la portada por un JPG, PNG o WebP del despacho (hasta 4 MB), sin OpenAI |
| `src/lib/blog/publico.ts` | Lectura pública (solo publicado y con fecha pasada; reserva en `src/data/posts.ts`) |
| `src/app/administrator/(panel)/blog/` | Panel: lista, «Redactar con IA», ficha de edición, revisión y publicación |
| `src/app/es/blog/` | Blog público (dinámico) con portada, FAQs, fuentes, firma de revisión y schema `Article` + `FAQPage` |
| `scripts/redactar-articulo.ts` | `npm run blog:redactar -- "tema" --area fiscal --notas "…"`. Reescribir los que ya hay, título fijo y sin portada: `--reescribir`. Solo las portadas: `--portadas` |
| `supabase/migrations/0005_blog_redactor.sql` | Columnas nuevas + regla «publicar exige revisión» + bucket «blog» |

## Pipeline

| Fase | Qué | Modelo |
|---|---|---|
| 1 Plan | Título, slug, palabra clave, intención, público, esquema de apartados **descriptivos** (no preguntas), fuentes a verificar, **solapamiento** con artículos existentes | `gpt-6-sol`, JSON, razonamiento `medium` |
| 2 Redacción | Responses API + **`web_search` obligatoria** (`search_context_size: high`, ubicación España/Murcia), background con sondeo cada 8 s, hasta 10 min | `gpt-6-sol`, razonamiento `high` |
| 3 Editor jurídico | Quita consejo personalizado, cifras sin vigencia, relleno; devuelve cuerpo + SEO + FAQs + fuentes + **puntos de revisión** + brief de portada | `gpt-6-sol`, JSON, razonamiento `high` |
| 4 Controles | Enlaces (internos solo a páginas que existen; externos solo dominios oficiales), longitud 1.000-1.700, ≥ 4 apartados, **> 1 apartado en forma de pregunta** (24 sep), «En resumen», fuentes, frases prohibidas, patrones de riesgo, cifras sin fecha | Código |
| 5 Guardado | `blog_articles`, **siempre `draft`**, Markdown (`body_md`) + HTML (`body`) | — |
| 6 Portada | 1536×1024 WebP. La escena del artículo manda. El prompt recibe las escenas ya publicadas para no repetir el mismo plano (mesa, ventanal, persona de espaldas, mar) | **`gpt-image-2.5-sunburst`**, calidad `medium`. Si la cuenta no tiene acceso o rechaza un parámetro, reserva automática `gpt-image-2` (PNG) |

Modelos verificados en developers.openai.com el 24 sep 2026 (antes: `gpt-5.6-terra` + `gpt-image-2`). `gpt-6-sol`: razonamiento más alto, `web_search` en Responses, 2 $ / 10 $ por M tokens.
Sin `temperature` (GPT-5.x y 6 no la admiten). Cambiables con `BLOG_REDACTOR_MODEL`, `BLOG_PORTADA_MODEL` y `BLOG_PORTADA_CALIDAD` (`low` / `medium` / `high`).

## Reglas que no se pueden saltar

- **Publicar o programar exige «Revisado por»** (nombre del abogado). Lo comprueba el panel **y** la base de datos (restricción `blog_publicar_requiere_revision`).
- Los enlaces no permitidos se **retiran en código**, diga lo que diga el modelo.
- Al guardar publicado: se actualiza el conocimiento del chatbot (H7.3). Lo despublicado sale del chatbot.
- Borrar: solo borradores. Lo publicado se retira pasándolo a borrador.

## Tiempos y límites

- Un artículo: 2-5 min. Las páginas del panel del blog llevan `maxDuration = 300`. **En Vercel Hobby hace falta Fluid Compute** para pasar de 60 s; si no, usar `npm run blog:redactar` en local.
- Coste orientativo por artículo: ~1 € (texto con búsqueda + portada). Comprobar con los primeros en el panel de OpenAI.

## Portada propia (28 oct 2026)

En la ficha del artículo hay dos caminos, los dos sustituyen `cover_url`:

- **Generar portada:** OpenAI, como hasta ahora (`regenerarPortada`).
- **Usar esta imagen:** archivo JPG, PNG o WebP de hasta 4 MB. Se guarda en el bucket `blog`, ruta `covers/{slug}-{marca}.{ext}`. No usa la clave de OpenAI. `cover_prompt` queda vacío para que esa imagen no entre en el muro de escenas de las portadas siguientes. El texto alternativo sigue en el formulario del artículo.

El tope de las acciones del servidor pasa de 1 MB a 4 MB (`next.config.mjs`), el mismo límite que la foto del equipo.

## Pendiente / conocido

- **24 sep, criterio de Narciso:** apartados en forma de pregunta + bloque de FAQs = texto de interrogatorio que suena a IA. Prompts cambiados (apartados descriptivos; FAQs distintas de los apartados) + control nuevo. **Los artículos generados antes del cambio (el de I+D+i) pueden traer apartados en pregunta:** revisarlos en el panel (al guardar, el control avisa) o reescribirlos.
- **Primer uso real (24 sep, Cursor, `--reescribir`):** «Cómo saber si su empresa puede aplicar la deducción por I+D+i» → borrador de búsqueda 1.973 palabras, **final 1.544 palabras, 0 avisos**, en borrador sin portada. Faltaban los otros dos de ejemplo y las portadas (`--portadas`).
- **`gpt-image-2.5-sunburst` confirmado** con la cuenta de Serveco: las 13 escenas de la web salieron en WebP (la reserva `gpt-image-2` da PNG). **Falta probar la subida al bucket `blog`** (primera portada).
- Mientras los 3 de ejemplo estén en borrador, **el blog público y el bloque de blog de la home están vacíos**: publicar al menos uno (con «Revisado por») antes de enseñar la web.
- Panel `/administrator/blog` sin probar (login, edición, publicar con firma).
- Editor del panel (28 oct): carga el HTML de `body`, el mismo que la web, con apartados, listas, negrita y enlaces. Al guardar sigue saliendo Markdown en `body_md` (lo leen los controles) y el HTML se regenera. No es TinyMCE.
- Formación de 1 h (H4.3) cuando esté en producción.
- **14 oct:** los artículos nuevos hablan de tú (criterio en `editorial.ts` y en `EDITORIAL-BLOG.md`). Los ya publicados en Supabase siguen en usted hasta que se reescriban. No lanzar `--reescribir` por este cambio si no lo pide Narciso.
- Programados: aparecen en la web al llegar su fecha, pero el chatbot los aprende en la siguiente ingesta («Actualizar conocimiento» o al guardar otro artículo).
- **28 oct, producción:** al generar una portada, OpenAI respondió `expired_secret_key` («Your API key has expired») con el modelo `gpt-image-2.5-sunburst`. La clave **está** en el servidor y ha caducado: hace falta una `OPENAI_API_KEY` nueva en Vercel y un redespliegue. Mientras tanto, el despacho puede subir su imagen. El panel ya no vuelca el JSON de OpenAI en la barra de dirección cuando la clave ha caducado.
