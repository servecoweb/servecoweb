'use server';

import { after } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/servidor';
import { ASESORIA, CONOCIO, SECTORES, TAMANOS, TIPOS, URGENCIAS, calcularPrioridad, valido } from '@/lib/crm';
import { enviarCorreosConsulta } from '@/lib/correo';
import { detectarSpam, type Motivo } from '@/lib/spam';

/**
 * Envío del formulario (partida 06 · mini-CRM, docs/CRM-CONTACTOS.md).
 *  1. Anti-spam SILENCIOSO (src/lib/spam.ts, molde del taller): el bot ve «enviado» y no hay consulta ni correo.
 *     · Bot evidente (campos trampa, sin marca de tiempo, demasiado rápido, caducado) → se descarta sin guardar.
 *     · Por contenido (venta, SEO, cadenas aleatorias, enlaces, alfabeto ajeno, duplicado) → a `contact_spam`
 *       30 días, para recuperar un falso positivo desde el panel.
 *  2. Valida y guarda en `contact_submissions` con cualificación, origen y prioridad calculada.
 *  3. Primera nota del historial (`contact_notas`).
 *  4. Par de correos (aviso + confirmación) DESPUÉS de responder, con after(): no retrasa al visitante.
 * Regla: nunca decir «enviado» a una persona si no se ha guardado. Y nunca perder lo que escribió: ante
 * cualquier error se devuelven sus `valores` para volver a rellenar el formulario (React 19 lo vacía al enviar).
 * Ojo: en un archivo 'use server' solo se exportan funciones async (los tipos sí se pueden exportar).
 */
export type CampoForm = 'nombre' | 'email' | 'telefono' | 'mensaje' | 'gdpr';
export type EstadoForm = {
  ok: boolean;
  error: string | null;
  campos?: Partial<Record<CampoForm, string>>;
  valores?: Record<string, string>;
};

const CAMPOS_VISIBLES = ['tipo', 'nombre', 'empresa', 'email', 'telefono', 'tamano', 'sector', 'area', 'sede', 'tiene_asesoria', 'urgencia', 'mensaje', 'como_conocio', 'gdpr'];

// Mínimos: nombre 2 caracteres, mensaje 15. Los mismos en ContactForm (minLength) para que el navegador avise antes.

export async function enviarConsulta(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const en = formData.get('lang') === 'en';
  const texto = (campo: string, max = 300) => String(formData.get(campo) ?? '').trim().slice(0, max);
  const valores = Object.fromEntries(CAMPOS_VISIBLES.map((k) => [k, String(formData.get(k) ?? '').slice(0, 5000)]));
  const errorGuardado: EstadoForm = {
    ok: false,
    error: en
      ? 'We could not send your message. Please call us on +34 968 90 90 20.'
      : 'No hemos podido enviar la consulta. Llámenos al 968 90 90 20.',
    valores,
  };

  // 1a) Bot evidente: se descarta en silencio, sin guardar (aquí no hay riesgo de falso positivo).
  const inicio = Number(formData.get('t') ?? 0);
  const OK_SILENCIOSO: EstadoForm = { ok: true, error: null };
  const previo = detectarSpam({
    nombre: 'x',
    email: 'x@x.x',
    mensaje: '',
    website: texto('website'),
    fax: texto('fax'),
    inicio,
  });
  if (previo.spam) return OK_SILENCIOSO;

  // 2) Validación: mínimos razonables y un mensaje por campo.
  const nombre = texto('nombre', 200);
  const email = texto('email', 200);
  const telefono = texto('telefono', 50);
  const mensaje = texto('mensaje', 5000);
  const campos: Partial<Record<CampoForm, string>> = {};
  if (nombre.length < 2 || !/\p{L}/u.test(nombre)) {
    campos.nombre = en ? 'Please tell us your name.' : 'Indíquenos su nombre.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    campos.email = en ? 'Please enter a valid email address.' : 'Escriba un correo válido (ejemplo: nombre@empresa.es).';
  }
  if (telefono) {
    const digitos = telefono.replace(/\D/g, '').length;
    if (!/^[+\d\s().-]+$/.test(telefono) || digitos < 9 || digitos > 15) {
      campos.telefono = en ? 'Please check the phone number (or leave it blank).' : 'Revise el teléfono (o déjelo en blanco).';
    }
  }
  if (mensaje.length < 15) {
    campos.mensaje = en
      ? 'Please tell us a little more about what you need (at least 15 characters).'
      : 'Cuéntenos algo más sobre lo que necesita (mínimo 15 caracteres).';
  }
  if (formData.get('gdpr') !== 'on') {
    campos.gdpr = en ? 'Please accept the privacy policy.' : 'Falta aceptar la política de privacidad.';
  }
  if (Object.keys(campos).length > 0) {
    return {
      ok: false,
      error: en ? 'Please check the fields marked below.' : 'Revise los campos marcados.',
      campos,
      valores,
    };
  }

  const tipo = valido(TIPOS, texto('tipo')) ?? 'particular';
  const esEmpresa = tipo === 'empresa';
  const cualificacion = {
    tamano: esEmpresa ? valido(TAMANOS, texto('tamano')) : null,
    sector: tipo !== 'particular' ? valido(SECTORES, texto('sector')) : null,
    tiene_asesoria: valido(ASESORIA, texto('tiene_asesoria')),
    urgencia: valido(URGENCIAS, texto('urgencia')),
    como_conocio: valido(CONOCIO, texto('como_conocio')),
  };

  const fila = {
    tipo,
    nombre,
    empresa: tipo !== 'particular' ? texto('empresa', 200) || null : null,
    email,
    telefono: telefono || null,
    area: texto('area', 100) || null,
    sede: texto('sede', 100) || null,
    mensaje,
    idioma: en ? 'en' : 'es',
    origen: texto('origen') || null,
    pagina_entrada: texto('pagina_entrada') || null,
    referrer: texto('referrer') || null,
    utm_source: texto('utm_source', 100) || null,
    utm_medium: texto('utm_medium', 100) || null,
    utm_campaign: texto('utm_campaign', 150) || null,
    ...cualificacion,
    prioridad: calcularPrioridad({ tipo, ...cualificacion }),
  };

  // 3) Guardado
  const db = supabaseAdmin();
  if (!db) {
    console.error('[contacto] Sin Supabase configurado: la consulta NO se ha guardado.', { email, area: fila.area });
    return errorGuardado;
  }
  // 1b) Por contenido o duplicado → bandeja de spam 30 días (se puede recuperar desde el panel).
  let motivo: Motivo | null = null;
  const veredicto = detectarSpam({ nombre, email, mensaje, empresa: fila.empresa ?? '', website: '', fax: '', inicio });
  if (veredicto.spam) motivo = veredicto.motivo;
  if (!motivo) {
    const haceDiez = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: repetido } = await db
      .from('contact_submissions')
      .select('id')
      .eq('email', email)
      .eq('mensaje', mensaje)
      .gte('created_at', haceDiez)
      .limit(1);
    if (repetido && repetido.length > 0) motivo = 'duplicado';
  }
  if (motivo) {
    const hace30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.from('contact_spam').delete().lt('created_at', hace30); // limpieza: solo se guarda 30 días
    const { error: eSpam } = await db
      .from('contact_spam')
      .insert({ motivo, email, nombre, extracto: mensaje.slice(0, 300), datos: fila });
    if (eSpam) console.error('[contacto] no se pudo guardar en contact_spam:', eSpam.message);
    return OK_SILENCIOSO;
  }

  const { data, error } = await db.from('contact_submissions').insert(fila).select('id').single();
  if (error || !data) {
    console.error('[contacto] Error al guardar en Supabase:', error?.message);
    return errorGuardado;
  }
  const id = String(data.id);

  // 4) Historial + correos, después de responder al visitante.
  after(async () => {
    const { error: eNota } = await db
      .from('contact_notas')
      .insert({ contact_id: id, autor: 'sistema', tipo: 'sistema', texto: `Consulta recibida desde ${fila.origen ?? 'la web'} · prioridad ${fila.prioridad}.` });
    if (eNota) console.error('[contacto] nota inicial:', eNota.message);

    const r = await enviarCorreosConsulta({ id, ...fila, idioma: en ? 'en' : 'es' });
    if (r.aviso || r.confirmacion) {
      await db.from('contact_notas').insert({
        contact_id: id,
        autor: 'sistema',
        tipo: 'sistema',
        texto: `Correos: aviso al despacho ${r.aviso ? 'enviado' : 'NO enviado'} · confirmación al visitante ${r.confirmacion ? 'enviada' : 'NO enviada'}.`,
      });
    }
  });

  return { ok: true, error: null };
}
