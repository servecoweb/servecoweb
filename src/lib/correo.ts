import nodemailer from 'nodemailer';
import { ASESORIA, CONOCIO, SECTORES, TAMANOS, TIPOS, URGENCIAS, etiqueta } from '@/lib/crm';
import { EMPRESA, SITE_URL } from '@/data/site';

/**
 * Par de correos del formulario (partida 06), molde del taller (SMTP + Nodemailer, HTML de tablas 600 px):
 *  1. Aviso al despacho (CONTACT_TO) con la consulta, la cualificación, la prioridad y el enlace al panel.
 *  2. Confirmación al visitante, en su idioma.
 * Sin SMTP configurado no se envía nada, pero la consulta YA está guardada en Supabase: nunca se pierde.
 * Variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO (varios separados por comas), SMTP_FROM (opcional).
 */
export type DatosConsulta = {
  id: string;
  tipo: string;
  nombre: string;
  empresa: string | null;
  email: string;
  telefono: string | null;
  area: string | null;
  sede: string | null;
  mensaje: string;
  idioma: 'es' | 'en';
  origen: string | null;
  tamano: string | null;
  sector: string | null;
  tiene_asesoria: string | null;
  urgencia: string | null;
  como_conocio: string | null;
  prioridad: string;
};

const NARANJA = '#ee7d22';
const TINTA = '#1f1f1f';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function transporte() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

function marco(titulo: string, cuerpo: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:${TINTA}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;padding:24px 0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:6px;overflow:hidden">
<tr><td style="background:${TINTA};padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold">SERVECO <span style="color:${NARANJA}">ASESORES</span></td></tr>
<tr><td style="padding:28px"><h1 style="font-size:20px;margin:0 0 16px">${titulo}</h1>${cuerpo}</td></tr>
<tr><td style="padding:16px 28px;background:#f4f4f2;font-size:12px;color:#666">${esc(EMPRESA.razonSocial)} · ${esc(EMPRESA.tel)} · ${esc(EMPRESA.email)}</td></tr>
</table></td></tr></table></body></html>`;
}

function fila(etq: string, valor: string | null | undefined): string {
  if (!valor || valor === '—') return '';
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:14px;vertical-align:top;white-space:nowrap">${esc(etq)}</td><td style="padding:6px 0;font-size:14px">${esc(valor)}</td></tr>`;
}

export async function enviarCorreosConsulta(c: DatosConsulta): Promise<{ aviso: boolean; confirmacion: boolean }> {
  const t = transporte();
  const destino = process.env.CONTACT_TO?.trim();
  if (!t || !destino) {
    console.warn('[correo] SMTP o CONTACT_TO sin configurar: la consulta se ha guardado, pero no se env\u00edan correos.');
    return { aviso: false, confirmacion: false };
  }
  const desde = process.env.SMTP_FROM?.trim() || `Serveco Asesores <${process.env.SMTP_USER}>`;
  const resultado = { aviso: false, confirmacion: false };

  // 1) Aviso al despacho
  const prioridadTxt = c.prioridad === 'alta' ? '🔴 ALTA' : c.prioridad === 'baja' ? 'Baja' : 'Media';
  const tabla = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:18px">
${fila('Prioridad', prioridadTxt)}
${fila('Nombre', c.nombre)}
${fila('Tipo', etiqueta(TIPOS, c.tipo))}
${fila('Empresa', c.empresa)}
${fila('Tamaño', etiqueta(TAMANOS, c.tamano))}
${fila('Sector', etiqueta(SECTORES, c.sector))}
${fila('¿Tiene asesoría?', etiqueta(ASESORIA, c.tiene_asesoria))}
${fila('Urgencia', etiqueta(URGENCIAS, c.urgencia))}
${fila('Área', c.area)}
${fila('Despacho', c.sede)}
${fila('Correo', c.email)}
${fila('Teléfono', c.telefono)}
${fila('Nos conoció por', etiqueta(CONOCIO, c.como_conocio))}
${fila('Escribió desde', c.origen)}
${fila('Idioma', c.idioma === 'en' ? 'Inglés' : 'Español')}
</table>`;
  try {
    await t.sendMail({
      from: desde,
      to: destino,
      replyTo: c.email,
      subject: `${c.prioridad === 'alta' ? '[PRIORIDAD ALTA] ' : ''}Nueva consulta web · ${c.area ?? 'sin área'} · ${c.nombre}`,
      html: marco(
        'Nueva consulta desde la web',
        `${tabla}<p style="font-size:14px;margin:0 0 6px;color:#666">Mensaje:</p>
<p style="font-size:15px;line-height:1.5;white-space:pre-wrap;margin:0 0 22px;padding:14px;background:#f4f4f2;border-radius:6px">${esc(c.mensaje)}</p>
<a href="${SITE_URL}/administrator/contactos/${c.id}" style="display:inline-block;background:${NARANJA};color:${TINTA};padding:12px 20px;border-radius:6px;font-weight:bold;text-decoration:none">Abrir en el panel</a>`,
      ),
    });
    resultado.aviso = true;
  } catch (err) {
    console.error('[correo] aviso al despacho:', err);
  }

  // 2) Confirmación al visitante
  const en = c.idioma === 'en';
  try {
    await t.sendMail({
      from: desde,
      to: c.email,
      subject: en ? 'We have received your enquiry · Serveco Asesores' : 'Hemos recibido su consulta · Serveco Asesores',
      html: marco(
        en ? 'Thank you for contacting us' : 'Gracias por escribirnos',
        en
          ? `<p style="font-size:15px;line-height:1.6">Dear ${esc(c.nombre)},</p>
<p style="font-size:15px;line-height:1.6">We have received your enquiry${c.area ? ` about <strong>${esc(c.area)}</strong>` : ''}. The right team will review it and reply to this email address.</p>
<p style="font-size:15px;line-height:1.6">If it is urgent, you can call us on <strong>+34 ${esc(EMPRESA.tel)}</strong>.</p>`
          : `<p style="font-size:15px;line-height:1.6">Estimado/a ${esc(c.nombre)}:</p>
<p style="font-size:15px;line-height:1.6">Hemos recibido su consulta${c.area ? ` sobre <strong>${esc(c.area)}</strong>` : ''}. El área que corresponde la revisará y le responderá a este correo.</p>
<p style="font-size:15px;line-height:1.6">Si es urgente, puede llamarnos al <strong>${esc(EMPRESA.tel)}</strong>.</p>`,
      ),
    });
    resultado.confirmacion = true;
  } catch (err) {
    console.error('[correo] confirmación al visitante:', err);
  }

  return resultado;
}
