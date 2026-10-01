# Mini-CRM de consultas (partida 06 «Formularios y leads»)

*24 sep 2026. Molde de gestión: Tricholand (`contacts` + estados + prioridad). Pedido de Narciso: «móntalo al completo».*

## Qué hace

1. **Formulario con cualificación** (`src/components/ContactForm.tsx`): tipo (particular / autónomo / empresa), tamaño y sector (solo negocio), ¿tiene asesoría?, urgencia, cómo nos conoció. **Todo opcional** salvo nombre, correo, mensaje y consentimiento (cada campo obligatorio de más resta envíos).
2. **Origen de la visita** (`src/components/CapturaVisita.tsx`): página de entrada, web de procedencia y campaña (`utm_*`). **Solo si el visitante aceptó las cookies analíticas** (se guarda en `sessionStorage`; si retira el permiso, se borra). Sin permiso, solo los `utm` de la página actual, sin guardar nada.
3. **Prioridad automática** (`calcularPrioridad` en `src/lib/crm.ts`):
   - **Alta:** tiene un plazo o requerimiento · o negocio que quiere cambiar de asesoría · o empresa de 50+ trabajadores.
   - **Baja:** particular con consulta puntual y sin prisa.
   - **Media:** el resto. Se puede cambiar a mano en el panel.
4. **Guardado** (`src/lib/contacto.ts`): valida cada respuesta contra su lista, guarda en `contact_submissions`, primera nota en `contact_notas`. **Nunca dice «enviado» si no se ha guardado.**
5. **Par de correos** (`src/lib/correo.ts`, SMTP + Nodemailer, HTML de tablas 600 px): aviso al despacho (con prioridad en el asunto si es alta, datos, cualificación y botón al panel; «responder» va al visitante) + confirmación al visitante en su idioma. Van **después** de responder (`after()`). Sin SMTP no se envían, pero la consulta ya está guardada. El resultado queda en el historial.
6. **Panel `/administrator/contactos`** (página de inicio del panel):
   - Embudo: **Nuevo → Contactado → Cita → Cliente / Descartado** (clic = filtro).
   - Aviso de **prioridad alta sin atender** y lista de **seguimientos para hoy o vencidos**.
   - Filtros por prioridad, área, despacho y búsqueda; tabla con responsable y fecha de seguimiento (en rojo si vence).
   - **Exportar a Excel** (CSV con «;» y BOM, mismos filtros).
   - **¿De dónde salen los clientes?**: consultas y clientes por «cómo nos conoció» y % de conversión.
7. **Ficha** `/administrator/contactos/[id]`: mensaje, datos, cualificación, origen, botones «Responder por correo» y «Llamar», gestión (estado, prioridad, responsable, «volver a contactar el») y **notas con historial** (cada cambio de estado, prioridad, responsable o fecha deja una nota automática con quién lo hizo). **Las consultas no se borran: se descartan.**

## Archivos

| Archivo | Qué |
|---|---|
| `supabase/migrations/0006_crm_contactos.sql` | Columnas de cualificación, origen y gestión; estados nuevos (los antiguos se traducen: leído/respondido → contactado, archivado → descartado); tabla `contact_notas`; seguridad solo `service_role` |
| `src/lib/crm.ts` | Opciones (ES/EN), estados, prioridades, `calcularPrioridad`, `etiqueta`, `valido`. Compartido por formulario, guardado, correos y panel |
| `src/lib/contacto.ts` | Server action del formulario (anti-spam en dos fases, guardado, nota, correos) |
| `src/lib/spam.ts` | Filtro anti-spam y textos de cada motivo |
| `src/lib/correo.ts` | Par de correos |
| `src/components/ContactForm.tsx` · `CapturaVisita.tsx` | Formulario y origen de la visita |
| `src/app/administrator/(panel)/contactos/` | Lista, ficha, acciones, `exportar/route.ts` |
| `src/app/es/privacidad/page.tsx` | Borrador de política de privacidad que cubre el formulario y su seguimiento |

## Variables

`SMTP_HOST`, `SMTP_PORT` (465 = SSL), `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` (varios con comas), `SMTP_FROM` (opcional). Molde del taller: SMTP OVH `ssl0.ovh.net` (si Serveco usa otro proveedor, sus datos).

## Para ponerlo en marcha

1. ~~Supabase → SQL Editor → `0006_crm_contactos.sql`~~ **Aplicada y comprobada** (Cursor, 24 sep ~22:50). **Aplicar `0007_contact_spam.sql`** (bandeja de spam).
2. `npm install` (entra `nodemailer`).
3. Datos SMTP de Serveco en `.env.local` (y en Vercel al publicar).
4. Probar: enviar una consulta de prueba de cada tipo → comprobar fila, prioridad, nota inicial y los dos correos → gestionarla en el panel.

## Validación del formulario (25 sep)

| Campo | Regla |
|---|---|
| Nombre * | Mínimo 2 caracteres y al menos una letra |
| Correo * | Formato `algo@dominio.ext` |
| Teléfono | Opcional; si se escribe, entre 9 y 15 dígitos (admite `+`, espacios, guiones, paréntesis) |
| Mensaje * | Mínimo 15 caracteres |
| Privacidad * | Casilla marcada |

- **Doble comprobación:** el navegador avisa antes de enviar (`required`, `minLength`, `type=email`, `pattern`) y el servidor lo repite con **un error debajo de cada campo** (en rojo, `aria-invalid`).
- **No se pierde nada:** ante cualquier error (de validación o de guardado) el servidor devuelve lo escrito y el formulario lo vuelve a pintar, casilla de privacidad incluida. React 19 vacía el formulario tras cada envío: sin esto, un error borraba todo.
- **Marca de tiempo y origen se añaden al enviar** (función `enviar` de `ContactForm.tsx`), no en campos ocultos: el vaciado los borraba y el segundo intento se tomaba por bot («sin marca de tiempo») y **se perdía en silencio**. Corregido 25 sep.

## Anti-spam (24 sep, molde del taller + mejoras)

`src/lib/spam.ts`, basado en `webneotermica/src/lib/spam.ts` (oleada Savin Kumar / FactuON, 9 sep). **Silencioso:** sin captcha; el bot ve «enviado» y no hay consulta ni correo.

| Capa | Qué caza | Qué pasa |
|---|---|---|
| Campos trampa `website` y `fax` (invisibles) | Bots que rellenan todo | Descartado sin guardar |
| Sin marca de tiempo | Envíos directos sin pasar por el formulario (**agujero que tenía Serveco hasta hoy**) | Descartado sin guardar |
| Menos de 3 s / más de 24 h | Bots rápidos y reenvíos | Descartado sin guardar |
| Cadenas aleatorias, palabras sin vocales | `iNgXrKYUMiecBwtr` | Bandeja de spam |
| Gmail con 4+ puntos | Alias generados | Bandeja de spam |
| Venta comercial | Redactores, enlaces, demos, «desde X €/mes», Calendly | Bandeja de spam |
| **Ofertas de SEO / diseño web** (nuevo) | «primera página de Google», «posicionamiento web»… | Bandeja de spam |
| 2+ enlaces | Spam de enlaces | Bandeja de spam |
| **Alfabeto ajeno** (nuevo) | Mensajes en cirílico, chino, árabe… (Serveco atiende en ES/EN) | Bandeja de spam |
| **Duplicado** (nuevo) | Mismo correo y mensaje en 10 min | Bandeja de spam |

**Bandeja «Filtrado como spam»** (plegada al final de `/administrator/contactos`): lo filtrado por contenido se guarda **30 días** en `contact_spam` (migración `0007`) con su motivo, y se puede **recuperar con un clic** (pasa a contactos con una nota; el visitante no recibió confirmación, hay que contestarle). Se limpia sola. Los bots evidentes no se guardan (no hay riesgo de falso positivo y llenarían la tabla).

Si entra un spam nuevo que el filtro no caza: añadir el patrón en `src/lib/spam.ts` y avisar en `MAPA-PROYECTOS.md` § Inventario de contactos para llevarlo al resto del taller.

## Protección de datos

- El consentimiento del formulario dice ahora «atender mi consulta **y hacer su seguimiento**»; la política de privacidad (borrador) lo explica. **La versión definitiva la valida Serveco.**
- El origen de la visita solo con consentimiento analítico.
- **Pendiente de decidir:** plazo de conservación de las consultas no convertidas. Y la regla del taller «el chat de un visitante no se borra nunca» choca con el principio de limitación del plazo de conservación del RGPD: conviene fijar un plazo (p. ej. borrar o anonimizar a los X meses) y decirlo en la política.

## Fuera de alcance (si lo piden, se presupuesta)

Embudos de venta con importes, correos automáticos de seguimiento, integración con su programa de gestión o con un CRM externo (si ya usan uno, exportar allí), recordatorios por correo al responsable, asignación automática por área.
