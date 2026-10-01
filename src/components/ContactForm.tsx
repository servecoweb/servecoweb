'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { enviarConsulta, type EstadoForm } from '@/lib/contacto';
import { ASESORIA, CONOCIO, SECTORES, TAMANOS, TIPOS, URGENCIAS } from '@/lib/crm';
import { leerVisita } from '@/components/CapturaVisita';
import { ES, EN } from '@/lib/rutas';

/**
 * Formulario de contacto + cualificación (partida 06 · mini-CRM, docs/CRM-CONTACTOS.md).
 *  · Obligatorios: nombre (≥ 2), correo válido, mensaje (≥ 15) y privacidad. El navegador avisa ANTES de enviar
 *    (required / minLength / type=email) y el servidor lo vuelve a comprobar con un error por campo.
 *  · Si hay error, NADA de lo escrito se pierde: el servidor devuelve los valores y se vuelven a pintar
 *    (React 19 vacía el formulario al terminar cada envío).
 *  · La marca de tiempo antispam y el origen de la visita se añaden AL ENVIAR (no en campos ocultos que el
 *    vaciado borraría: un segundo intento sin marca se tomaría por bot y se perdería en silencio).
 *  · Cualificación opcional; tamaño y sector solo para empresa / autónomo.
 */
type Props = {
  lang: 'es' | 'en';
  areas: string[];
  sedes: string[];
  areaInicial?: string;
  sedeInicial?: string;
};

const INICIAL: EstadoForm = { ok: false, error: null };
const NOMBRE_MIN = 2;
const MENSAJE_MIN = 15;

export default function ContactForm({ lang, areas, sedes, areaInicial, sedeInicial }: Props) {
  const en = lang === 'en';
  const l = en ? 'en' : 'es';
  const [estado, accion, enviando] = useActionState(enviarConsulta, INICIAL);
  const [tipo, setTipo] = useState('particular');
  const inicioRef = useRef(0);
  const origen = usePathname();

  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  // Datos que no escribe la persona: se añaden en el momento de enviar.
  const enviar = (fd: FormData) => {
    fd.set('lang', lang);
    fd.set('origen', origen ?? '');
    fd.set('t', String(inicioRef.current || 0));
    const v = leerVisita();
    const q = new URLSearchParams(window.location.search);
    fd.set('utm_source', v?.utm_source ?? q.get('utm_source') ?? '');
    fd.set('utm_medium', v?.utm_medium ?? q.get('utm_medium') ?? '');
    fd.set('utm_campaign', v?.utm_campaign ?? q.get('utm_campaign') ?? '');
    fd.set('pagina_entrada', v?.entrada ?? '');
    fd.set('referrer', v?.referrer ?? '');
    accion(fd);
  };

  if (estado.ok) {
    return (
      <div className="lead" style={{ display: 'block' }}>
        <p className="form-aviso ok" role="status">
          {en
            ? 'Message sent. We have emailed you a confirmation; the right team will reply once it has reviewed your enquiry.'
            : 'Consulta enviada. Le hemos enviado una confirmación por correo; el área que corresponde le responderá en cuanto la revise.'}
        </p>
      </div>
    );
  }

  const val = (k: string, porDefecto = '') => estado.valores?.[k] ?? porDefecto;
  const err = estado.campos ?? {};
  const negocio = tipo === 'empresa' || tipo === 'autonomo';
  const elegir = en ? 'Choose…' : 'Seleccione…';
  const aviso = (campo: keyof typeof err) =>
    err[campo] ? (
      <p id={`f-${campo}-error`} className="campo-error" role="alert">
        {err[campo]}
      </p>
    ) : null;
  const invalido = (campo: keyof typeof err) =>
    err[campo] ? { 'aria-invalid': true as const, 'aria-describedby': `f-${campo}-error` } : {};

  return (
    <form className="lead" action={enviar}>
      <div className="campo ancho">
        <fieldset>
          <legend>{en ? 'You are' : 'Escribe como'}</legend>
          <div className="chips" style={{ marginTop: 6 }}>
            {TIPOS.map((o) => (
              <label key={o.valor}>
                <input type="radio" name="tipo" value={o.valor} checked={tipo === o.valor} onChange={() => setTipo(o.valor)} />
                <span>{o[l]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="campo">
        <label htmlFor="f-nombre">{en ? 'Name' : 'Nombre'} *</label>
        <input
          id="f-nombre"
          name="nombre"
          autoComplete="name"
          required
          minLength={NOMBRE_MIN}
          maxLength={200}
          defaultValue={val('nombre')}
          {...invalido('nombre')}
        />
        {aviso('nombre')}
      </div>
      {negocio && (
        <div className="campo">
          <label htmlFor="f-empresa">{tipo === 'empresa' ? (en ? 'Company' : 'Empresa') : en ? 'Business name (optional)' : 'Nombre comercial (opcional)'}</label>
          <input id="f-empresa" name="empresa" autoComplete="organization" maxLength={200} defaultValue={val('empresa')} />
        </div>
      )}
      <div className="campo">
        <label htmlFor="f-email">{en ? 'Email' : 'Correo electrónico'} *</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={val('email')} {...invalido('email')} />
        {aviso('email')}
      </div>
      <div className="campo">
        <label htmlFor="f-tel">{en ? 'Phone (optional)' : 'Teléfono (opcional)'}</label>
        <input
          id="f-tel"
          name="telefono"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={25}
          pattern={'[+0-9 \\(\\)\\.\\-]{9,25}'}
          title={en ? 'At least 9 digits' : 'Al menos 9 dígitos'}
          defaultValue={val('telefono')}
          {...invalido('telefono')}
        />
        {aviso('telefono')}
      </div>

      <div className="campo">
        <label htmlFor="f-area">{en ? 'Service' : 'Área'}</label>
        <select id="f-area" name="area" defaultValue={val('area', areaInicial ?? '')}>
          {areas.map((a) => <option key={a}>{a}</option>)}
          <option>{en ? 'Not sure' : 'No lo sé'}</option>
        </select>
      </div>
      <div className="campo">
        <label htmlFor="f-sede">{en ? 'Office' : 'Despacho'}</label>
        <select id="f-sede" name="sede" defaultValue={val('sede', sedeInicial ?? '')}>
          {sedes.map((s) => <option key={s}>{s}</option>)}
          <option>{en ? 'Any office' : 'Me es indiferente'}</option>
        </select>
      </div>

      <div className="campo ancho">
        <label htmlFor="f-msg">{en ? 'Message' : 'Mensaje'} *</label>
        <textarea
          id="f-msg"
          name="mensaje"
          required
          minLength={MENSAJE_MIN}
          maxLength={5000}
          placeholder={en ? 'Tell us briefly what you need.' : 'Cuéntenos brevemente qué necesita.'}
          defaultValue={val('mensaje')}
          {...invalido('mensaje')}
        />
        {aviso('mensaje')}
      </div>

      <details
        className="cualificacion campo ancho"
        {...(val('tamano') || val('sector') || val('tiene_asesoria') || val('urgencia') || val('como_conocio') ? { open: true } : {})}
      >
        <summary>{en ? 'Help us serve you better (optional)' : 'Ayúdenos a atenderle mejor (opcional)'}</summary>
        <div className="cualificacion-grid">
          {tipo === 'empresa' && (
            <div className="campo">
              <label htmlFor="f-tamano">{en ? 'Company size' : 'Tamaño de la empresa'}</label>
              <select id="f-tamano" name="tamano" defaultValue={val('tamano')}>
                <option value="">{elegir}</option>
                {TAMANOS.map((o) => <option key={o.valor} value={o.valor}>{o[l]}</option>)}
              </select>
            </div>
          )}
          {negocio && (
            <div className="campo">
              <label htmlFor="f-sector">{en ? 'Sector' : 'Sector'}</label>
              <select id="f-sector" name="sector" defaultValue={val('sector')}>
                <option value="">{elegir}</option>
                {SECTORES.map((o) => <option key={o.valor} value={o.valor}>{o[l]}</option>)}
              </select>
            </div>
          )}
          <div className="campo">
            <label htmlFor="f-asesoria">{en ? 'Do you already have an adviser?' : '¿Tiene ya asesoría?'}</label>
            <select id="f-asesoria" name="tiene_asesoria" defaultValue={val('tiene_asesoria')}>
              <option value="">{elegir}</option>
              {ASESORIA.map((o) => <option key={o.valor} value={o.valor}>{o[l]}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-urgencia">{en ? 'How urgent is it?' : '¿Es urgente?'}</label>
            <select id="f-urgencia" name="urgencia" defaultValue={val('urgencia')}>
              <option value="">{elegir}</option>
              {URGENCIAS.map((o) => <option key={o.valor} value={o.valor}>{o[l]}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-conocio">{en ? 'How did you hear about us?' : '¿Cómo nos ha conocido?'}</label>
            <select id="f-conocio" name="como_conocio" defaultValue={val('como_conocio')}>
              <option value="">{elegir}</option>
              {CONOCIO.map((o) => <option key={o.valor} value={o.valor}>{o[l]}</option>)}
            </select>
          </div>
        </div>
      </details>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-web">Web</label>
        <input id="f-web" type="text" name="website" tabIndex={-1} autoComplete="off" />
        <label htmlFor="f-fax">Fax</label>
        <input id="f-fax" type="text" name="fax" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo ancho">
        <label className="gdpr">
          <input type="checkbox" name="gdpr" required defaultChecked={val('gdpr') === 'on'} {...invalido('gdpr')} />
          <span>
            {en ? 'I have read the ' : 'He leído la '}
            <Link className="enlace" href={en ? EN.privacy : ES.privacidad}>
              {en ? 'privacy policy' : 'política de privacidad'}
            </Link>
            {en
              ? ' and agree that Serveco uses this data to answer my enquiry and follow it up.'
              : ' y acepto que Serveco use estos datos para atender mi consulta y hacer su seguimiento.'}
          </span>
        </label>
        {aviso('gdpr')}
      </div>

      {estado.error && <p className="form-aviso error" role="alert">{estado.error}</p>}

      <div className="campo ancho">
        <p className="campos-obligatorios">{en ? '* Required' : '* Obligatorio'}</p>
        <button className="btn btn-marca" type="submit" disabled={enviando}>
          {enviando ? (en ? 'Sending…' : 'Enviando…') : en ? 'Send message' : 'Enviar consulta'}
        </button>
      </div>
    </form>
  );
}
