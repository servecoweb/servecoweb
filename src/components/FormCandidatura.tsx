'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AREAS_CANDIDATURA, TIPOS_CANDIDATURA } from '@/lib/candidatos';
import { enviarCandidatura, type EstadoCandidatura } from '@/lib/candidatura';
import { ES, EN } from '@/lib/rutas';

/**
 * Formulario de empleo y prácticas. Sin currículum adjunto: si encaja, el despacho lo pide.
 * La marca de tiempo antispam se añade al enviar (React 19 vacía los ocultos si van en el formulario).
 */
const INICIAL: EstadoCandidatura = { ok: false, error: null };

export default function FormCandidatura({ lang }: { lang: 'es' | 'en' }) {
  const en = lang === 'en';
  const [estado, accion, enviando] = useActionState(enviarCandidatura, INICIAL);
  const [tipo, setTipo] = useState('empleo');
  const inicioRef = useRef(0);
  const origen = usePathname();

  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  const enviar = (fd: FormData) => {
    fd.set('lang', lang);
    fd.set('origen', origen ?? '');
    fd.set('t', String(inicioRef.current || 0));
    accion(fd);
  };

  if (estado.ok) {
    return (
      <div className="lead" style={{ display: 'block' }}>
        <p className="form-aviso ok" role="status">
          {en
            ? 'Application received. If it fits what the firm needs, we will write to you. This is not a client enquiry.'
            : 'Candidatura recibida. Si encaja con lo que el despacho necesita, te escribimos. No es una consulta de cliente.'}
        </p>
      </div>
    );
  }

  const val = (k: string, porDefecto = '') => estado.valores?.[k] ?? porDefecto;
  const err = estado.campos ?? {};
  const aviso = (campo: keyof typeof err) =>
    err[campo] ? (
      <p id={`c-${campo}-error`} className="campo-error" role="alert">
        {err[campo]}
      </p>
    ) : null;
  const invalido = (campo: keyof typeof err) =>
    err[campo] ? { 'aria-invalid': true as const, 'aria-describedby': `c-${campo}-error` } : {};
  const l = en ? 'en' : 'es';

  return (
    <form className="lead" id="formulario" action={enviar}>
      <div className="campo ancho">
        <fieldset>
          <legend>{en ? 'You are looking for' : 'Buscas'}</legend>
          <div className="chips" style={{ marginTop: 6 }}>
            {TIPOS_CANDIDATURA.map((o) => (
              <label key={o.valor}>
                <input type="radio" name="tipo" value={o.valor} checked={tipo === o.valor} onChange={() => setTipo(o.valor)} />
                <span>{o[l]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="campo">
        <label htmlFor="c-nombre">{en ? 'Name' : 'Nombre'} *</label>
        <input id="c-nombre" name="nombre" autoComplete="name" required minLength={2} maxLength={200} defaultValue={val('nombre')} {...invalido('nombre')} />
        {aviso('nombre')}
      </div>
      <div className="campo">
        <label htmlFor="c-email">{en ? 'Email' : 'Correo electrónico'} *</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={val('email')} {...invalido('email')} />
        {aviso('email')}
      </div>
      <div className="campo">
        <label htmlFor="c-tel">{en ? 'Phone (optional)' : 'Teléfono (opcional)'}</label>
        <input
          id="c-tel"
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
        <label htmlFor="c-area">{en ? 'Area (optional)' : 'Área (opcional)'}</label>
        <select id="c-area" name="area" defaultValue={val('area')}>
          <option value="">{en ? 'Choose…' : 'Seleccione…'}</option>
          {AREAS_CANDIDATURA.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="campo ancho">
        <label htmlFor="c-msg">{en ? 'Your experience' : 'Tu experiencia'} *</label>
        <textarea
          id="c-msg"
          name="mensaje"
          required
          minLength={15}
          maxLength={5000}
          placeholder={
            en
              ? 'What you have studied or done, and when you could start. No need to attach a CV.'
              : 'Qué has estudiado o a qué te has dedicado, y cuándo podrías incorporarte. No hace falta adjuntar el currículum.'
          }
          defaultValue={val('mensaje')}
          {...invalido('mensaje')}
        />
        {aviso('mensaje')}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="c-web">Web</label>
        <input id="c-web" type="text" name="website" tabIndex={-1} autoComplete="off" />
        <label htmlFor="c-fax">Fax</label>
        <input id="c-fax" type="text" name="fax" tabIndex={-1} autoComplete="off" />
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
              ? ' and agree that Serveco uses this data to review my application.'
              : ' y acepto que Serveco use estos datos para valorar mi candidatura.'}
          </span>
        </label>
        {aviso('gdpr')}
      </div>

      {estado.error && (
        <p className="form-aviso error" role="alert">
          {estado.error}
        </p>
      )}

      <div className="campo ancho">
        <p className="campos-obligatorios">{en ? '* Required' : '* Obligatorio'}</p>
        <button className="btn btn-marca" type="submit" disabled={enviando}>
          {enviando ? (en ? 'Sending…' : 'Enviando…') : en ? 'Send application' : 'Enviar candidatura'}
        </button>
      </div>
    </form>
  );
}
