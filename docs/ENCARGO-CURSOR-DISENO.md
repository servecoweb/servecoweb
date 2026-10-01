# Encargo para Cursor: revisión visual y diseño (25 sep 2026)

*Redactado por Claude. Claude no ve la web renderizada; Cursor sí. Reparto: **Claude define el criterio, Cursor mira y aplica.** Al terminar, entrada en la bitácora (`../PLAN-ARRANQUE-WEB.md` § 7) con lo hecho y lo que quede.*

**Antes de empezar:** leer `AGENTS.md` y la bitácora. Servidor: `npm run dev` → `http://localhost:3000`.

---

## Reglas que NO se pueden romper

1. **No tocar el contenido** de `src/data/*-seo.ts`, `sectores.ts`, `crm.ts` ni los prompts (`src/lib/chatbot/`, `src/lib/blog/editorial.ts`). Si un texto se ve mal (demasiado largo, un corte raro), anotarlo en la bitácora para Claude; no reescribirlo.
2. **Encabezados H2 afirmativos**, nunca en forma de pregunta (las preguntas solo en el bloque de FAQs). Decisión 27.
3. **Cero huérfanos:** lo que parece botón o tarjeta (borde, fondo, sombra, flecha) **tiene que llevar a algo**. Si no hay página, se pinta como texto. Nada de «Próximamente».
4. **Nada de terceros que carguen solos:** ni mapas incrustados, ni iframes, ni vídeos de YouTube, ni fuentes de otro servidor salvo el `<link>` de Google Fonts que ya existe. Si algo externo es necesario, se carga al pulsar (ver `src/components/BuscadorExterno.tsx`).
5. **Fuentes:** no volver a `next/font/google` (cuelga detrás del proxy de este PC).
6. **CSS:** Tailwind 4 con tokens en `@theme` de `globals.css`. Web pública dentro de `.web`; texto largo con `.texto` (no `.prose`). No duplicar colores sueltos: usar las variables (`--tinta`, `--naranja`, `--linea`, `--niebla`, `--papel`…).
7. **Accesibilidad:** contraste AA como mínimo (texto sobre naranja incluido), foco visible con teclado, `alt` en imágenes, objetivos táctiles de al menos 44 px en móvil, respetar `prefers-reduced-motion`.
8. **Imágenes:** nunca generar retratos del equipo ni fachadas con IA.

---

## Tarea A · Revisión visual de toda la web

**Anchos a revisar:** 375 px (móvil), 768 px (tableta), 1280 px y 1600 px (escritorio). Captura de cada página a 375 y 1280 **antes y después**.

**Qué buscar en cada página:**
- Ritmo vertical coherente entre secciones (mismos márgenes), nada pegado ni con huecos raros.
- Titulares largos que rompan feo (los H1 SEO son largos: «English-speaking accountants in Murcia and Alicante»). Ajustar tamaño o `text-wrap: balance`, **no** acortar el texto.
- Columnas `wrap dos` (texto + aside): que el aside no quede eterno en móvil ni desequilibrado en escritorio. Valorar aside `position: sticky` en escritorio.
- Listas de servicios (`.servicios-lista`) y FAQs (`.faq details`): que se lean bien, con estado abierto/cerrado claro.
- Escenas (`EscenaFoto`): proporción estable, sin saltos de maquetación al cargar (reservar alto con `aspect-ratio`), `loading="lazy"` salvo la primera visible.
- Avisos de «Texto pendiente de validar» (`.aviso`): visibles pero discretos.

**Páginas y puntos concretos:**

| Página | Revisar |
|---|---|
| `/es` y `/en` | Hero (contraste del texto sobre la foto), carrusel «Conocemos su sector» (3 tarjetas + la 4.ª asomando en escritorio, 1,5 en móvil, flechas, las 5 escenas nuevas si ya se generaron), tarjetas internacionales (`AccesosIntl`: que se vean clicables), bloque de blog (si está vacío, que no quede un hueco: ocultar o mensaje) |
| `/es/servicios/[area]` (8) | Plantilla larga: H1, lista de servicios, FAQs, aside de áreas relacionadas |
| `/en/services/[area]` (8) | Igual que la española |
| `/es/internacional` y `/en/international` | Tarjetas arriba + escena + contenido; aside de Benidorm |
| `/es/internacional/[slug]` y `/en/international/[slug]` (3 + 3) | Tres cajas en el aside: que no se amontonen |
| `/es/la-firma/despachos/[sede]` (6) | Caja por local (Murcia y Yecla tienen 2), botón «Cómo llegar», lista de áreas. Valorar si las cajas de dirección van mejor **arriba en móvil** (lo primero que busca quien entra en una ficha es la dirección y el teléfono) |
| `/es/punto-pae`, `/es/subvenciones` | En subvenciones, la caja del buscador **antes** de pulsar (que invite a abrirlo) y después |
| `/es/contacto` y el formulario en cualquier página | Estado normal, **estado con errores** (enviar vacío: campos en rojo con su mensaje) y estado enviado. Las preguntas opcionales no deben hacer el formulario abrumador: valorar agruparlas bajo un rótulo «Ayúdenos a atenderle mejor (opcional)» |
| Banner de cookies | Rechazar / Configurar / Aceptar con el mismo peso visual (criterio AEPD). No tapar el chat en móvil. **El interruptor «Funcionales» no lo usa nada** (la política de cookies ya no lo menciona, 25 sep): quitarlo del panel de configuración |
| Chat (widget) | En móvil: no tapa el botón de enviar del formulario ni el banner; se cierra bien |
| `/es/sitemap` | Que se lea como índice, no como lista infinita |
| **Panel** `/administrator` (inicio), `/contactos`, `/contactos/[id]`, `/blog`, `/chatbot` | Coherencia visual entre secciones, tablas legibles en portátil de 13", etiquetas de estado y prioridad claras, gráficas de barras del inicio legibles, estados vacíos dignos («Todavía no hay consultas») |

**Rendimiento (medir con Lighthouse en móvil):** LCP del hero, CLS cerca de 0, peso de las escenas (WebP ≤ ~200 KB a 1280 px; si pesan más, generar tamaños con `srcset` o recomprimir). Anotar las cifras antes/después.

---

## Tarea B · Rediseño del blog (`/es/blog` y `/es/blog/[slug]`)

Criterio de Claude (partida 04). La lógica de datos existe en `src/lib/blog/publico.ts`; los artículos tienen `category` = área.

**Listado `/es/blog`:**
1. **H1 con búsqueda:** «Actualidad fiscal, laboral y jurídica para empresas» + entradilla (quién escribe y para quién). `title` y `description` acordes.
2. **Filtro por área** con botones arriba (`?area=fiscal`…): solo las áreas que tengan artículos publicados (cero huérfanos). Es la misma página filtrada, no páginas nuevas.
3. **Último artículo destacado** (tarjeta grande) + rejilla para el resto.
4. **Imagen de reserva:** si un artículo no tiene portada, usar la escena de su área (`ESCENA_AREA` en `src/data/escenas.ts`), nunca el recuadro con «Serveco».
5. En cada tarjeta: área, fecha, **tiempo de lectura** (palabras / 200, redondeado) y el sello **«Revisado por un abogado»** cuando el artículo tenga rellenado el campo de «Revisado por» (ver `0005_blog_redactor.sql` y `publico.ts` para el nombre exacto de la columna).
6. **Paginación** a partir de 12 artículos (`?pagina=2`), con `rel="prev/next"` o enlaces normales.
7. Estado vacío digno (hoy los 3 de ejemplo están en borrador).

**Artículo `/es/blog/[slug]`:**
8. Debajo del título: área · fecha de publicación · **«Actualizado»** si cambió · tiempo de lectura · **«Revisado por [nombre], abogado de Serveco»**.
9. **Índice de contenidos** generado de los H2: lateral y fijo en escritorio; desplegable al principio en móvil. Enlaces a anclas (dar `id` a los H2).
10. **Llamada a la acción del área del artículo** (no genérica): «¿Le afecta? Consulte con el área laboral» → enlace a `/es/servicios/[area]` + botón de consulta. A mitad de artículo (discreta) y al final (clara).
11. **Relacionados de la misma área** al final (hasta 3; si no hay, los últimos publicados).
12. **Fuentes oficiales** en un recuadro destacado; FAQs con el mismo estilo que las áreas (`.faq`).
13. Migas: el área enlaza al listado filtrado (`/es/blog?area=…`).
14. Datos estructurados: `BlogPosting` (autor = organización, `dateModified`, imagen) + `BreadcrumbList` + `FAQPage` si hay FAQs.
15. Medida de lectura cómoda (≈ 68-72 caracteres por línea), tipografía de artículo con buen interlineado, tablas con desplazamiento horizontal en móvil.

---

## Al terminar

- Entrada en la bitácora con: páginas revisadas, qué se cambió (archivos), cifras de Lighthouse antes/después y **lista de lo que no se ha tocado y por qué** (sobre todo, textos a revisar por Claude).
- Si alguna regla de arriba choca con algo que se ve mal, **no la rompas**: anótalo y lo decidimos.
