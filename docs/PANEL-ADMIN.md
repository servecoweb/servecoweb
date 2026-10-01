# Panel de administración `/administrator`

*25 sep 2026. Acceso: login de Supabase + email en `ADMIN_EMAILS` (`src/lib/admin.ts`). Sin email autorizado no se ve nada.*

## Secciones

| Ruta | Qué es | Doc |
|---|---|---|
| `/administrator` | **Inicio (dashboard)**: lo primero al entrar | este archivo |
| `/administrator/contactos` | Mini-CRM de consultas: embudo, ficha, notas, seguimiento, exportación, bandeja de spam | `CRM-CONTACTOS.md` |
| `/administrator/blog` | Artículos: «Redactar con IA», edición, revisión jurídica y publicación | `REDACTOR-BLOG.md` |
| `/administrator/chatbot` | Respuestas y conversaciones del asistente con la nota del revisor | `CHATBOT.md` |

Tras el login se entra al **Inicio**. El nombre «SERVECO · Panel» también lleva al Inicio.

## Inicio (dashboard)

Archivos: `src/app/administrator/(panel)/page.tsx` (vista) y `src/lib/panel/resumen.ts` (datos). **Tolerante:** si falta una migración, esa parte no aparece y el resto sigue.

1. **Requiere atención** (tarjetas que enlazan a la lista filtrada; en rojo lo urgente):
   - Consultas de prioridad alta sin atender · consultas nuevas · seguimientos para hoy o vencidos.
   - Respuestas del chat sin calificar · respuestas incorrectas (30 días).
   - Artículos en borrador (y cuántos con avisos graves).
   - Mensajes filtrados como spam (7 días), para revisar que no haya un cliente real.
   Si todo está a cero, el título pasa a «Todo al día».
2. **Últimos 30 días** frente a los 30 anteriores: consultas, clientes ganados, conversaciones del chat, preguntas al chat, nota media del chat (con reparto bien / mejorable / mal) y artículos publicados.
3. **Gráficas** de consultas y conversaciones por día (30 días).
4. **Últimas consultas** (con prioridad y estado) y **últimas preguntas al chat**.
5. **Respuestas incorrectas del chat** con la nota del revisor (regla del taller: se arreglan antes de que se repitan).
6. **Cómo nos conocen** (consultas de 30 días) y próximo artículo programado.
7. **Estado del sistema**: base de datos, OpenAI, conocimiento del chat, SMTP, Google Analytics, bandeja de spam y número de administradores. Muestra si está configurado, **nunca los valores**.

## Pendiente / ideas

- Cuando haya volumen: filtros por despacho en el Inicio (cada sede ve lo suyo) y usuarios por área.
- Resumen semanal por correo a Rafael (fuera del PDF: se presupuesta si lo quieren).
