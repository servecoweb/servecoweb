'use server';

import { EMPRESA } from '@/data/site';
import { areaCandidatura, tipoCandidatura } from '@/lib/candidatos';
import { guardarCandidatura } from '@/lib/candidaturas-guardar';
import { detectarSpam } from '@/lib/spam';

/**
 * Formulario de «¿Quieres trabajar con nosotros?».
 * Misma regla que el de clientes: no decir «enviado» si no se guardó, y devolver lo escrito si hay un error.
 * El spam comercial se descarta en silencio. Pedir trabajo es, aquí, el caso normal.
 */
export type EstadoCandidatura = {
  ok: boolean;
  error: string | null;
  campos?: Partial<Record<'nombre' | 'email' | 'telefono' | 'mensaje' | 'gdpr', string>>;
  valores?: Record<string, string>;
};

const VISIBLES = ['tipo', 'nombre', 'email', 'telefono', 'area', 'mensaje', 'gdpr'];

export async function enviarCandidatura(_prev: EstadoCandidatura, formData: FormData): Promise<EstadoCandidatura> {
  const en = formData.get('lang') === 'en';
  const texto = (campo: string, max = 300) => String(formData.get(campo) ?? '').trim().slice(0, max);
  const valores = Object.fromEntries(VISIBLES.map((k) => [k, String(formData.get(k) ?? '').slice(0, 5000)]));
  const errorGuardado: EstadoCandidatura = {
    ok: false,
    error: en
      ? `We could not send your application. Please write to ${EMPRESA.email}.`
      : `No hemos podido enviar la candidatura. Escríbenos a ${EMPRESA.email}.`,
    valores,
  };

  const inicio = Number(formData.get('t') ?? 0);
  const nombre = texto('nombre', 200);
  const email = texto('email', 200);
  const mensaje = texto('mensaje', 5000);
  const veredicto = detectarSpam({
    nombre,
    email,
    mensaje,
    website: texto('website'),
    fax: texto('fax'),
    inicio,
  });
  if (veredicto.spam && veredicto.motivo !== 'busca_empleo') return { ok: true, error: null };

  const telefono = texto('telefono', 50);
  const campos: EstadoCandidatura['campos'] = {};
  if (nombre.length < 2 || !/\p{L}/u.test(nombre)) {
    campos.nombre = en ? 'Please tell us your name.' : 'Indícanos tu nombre.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    campos.email = en ? 'Please enter a valid email address.' : 'Escribe un correo válido (ejemplo: nombre@correo.es).';
  }
  if (telefono) {
    const digitos = telefono.replace(/\D/g, '').length;
    if (!/^[+\d\s().-]+$/.test(telefono) || digitos < 9 || digitos > 15) {
      campos.telefono = en ? 'Please check the phone number (or leave it blank).' : 'Revisa el teléfono (o déjalo en blanco).';
    }
  }
  if (mensaje.length < 15) {
    campos.mensaje = en
      ? 'Tell us a little about your experience (at least 15 characters).'
      : 'Cuéntanos algo de tu experiencia (mínimo 15 caracteres).';
  }
  if (formData.get('gdpr') !== 'on') {
    campos.gdpr = en ? 'Please accept the privacy policy.' : 'Falta aceptar la política de privacidad.';
  }
  if (Object.keys(campos).length > 0) {
    return { ok: false, error: en ? 'Please check the fields marked below.' : 'Revisa los campos marcados.', campos, valores };
  }

  const guardada = await guardarCandidatura({
    nombre,
    email,
    telefono: telefono || null,
    tipo: tipoCandidatura(texto('tipo')),
    area: areaCandidatura(texto('area')),
    mensaje,
    idioma: en ? 'en' : 'es',
    origen: 'formulario',
  });
  if (!guardada) return errorGuardado;
  return { ok: true, error: null };
}
