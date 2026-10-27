import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import BotonCookies from '@/components/BotonCookies';
import { EMPRESA } from '@/data/site';

export const metadata: Metadata = { title: 'Política de privacidad', robots: { index: false, follow: true } };

/**
 * BORRADOR redactado por Eskala (24 sep 2026) para cubrir el formulario de contacto y su seguimiento (mini-CRM).
 * La versión definitiva la valida Serveco (razón social, CIF, domicilio, DPO y plazos): ver PLAN-ARRANQUE-WEB.md § 4.
 */
export default function Privacidad() {
  return (
    <LegalPage titulo="Política de privacidad">
      <h2>Responsable del tratamiento</h2>
      <p>
        {EMPRESA.razonSocial}. Contacto: {EMPRESA.email} · {EMPRESA.tel}. [CIF y domicilio social pendientes.]
      </p>

      <h2>Formulario de contacto</h2>
      <p>
        <strong>Qué datos tratamos:</strong> los que nos facilitas en el formulario (nombre, correo, teléfono, empresa, tipo de
        cliente, tamaño y sector de la empresa, área y despacho, urgencia, cómo nos conociste y tu mensaje) y la página desde la que nos
        escribes. Si has aceptado las cookies analíticas, también la primera página de tu visita y la web o campaña de procedencia.
      </p>
      <p>
        <strong>Para qué:</strong> atender tu consulta, asignarla al área y al despacho que corresponde, hacer el seguimiento de la
        misma (contactarte de nuevo sobre esa consulta, concertar una cita) y saber qué canales nos traen consultas. No los usamos
        para enviarte publicidad ni los cedemos a terceros, salvo obligación legal o proveedores que los tratan por cuenta nuestra
        (alojamiento web, base de datos y correo electrónico), con las garantías exigidas por la normativa.
      </p>
      <p>
        <strong>Base legal:</strong> tu consentimiento, que das al enviar el formulario, y, si llegas a ser cliente, las medidas
        precontractuales que solicitas.
      </p>
      <p>
        <strong>Cuánto tiempo:</strong> mientras dure la gestión de tu consulta y, después, durante el plazo necesario para atender
        posibles responsabilidades. [Plazo concreto pendiente de Serveco.] Si llegas a ser cliente, se aplicarán los plazos de la
        relación profesional.
      </p>

      <h2>Empleo y prácticas</h2>
      <p>
        Si nos escribes para trabajar o hacer prácticas, tratamos tu nombre, correo, teléfono si lo dejas, el tipo de candidatura, el
        área y el mensaje. Sirve para valorar si encaja con lo que el despacho necesita y, si es así, para escribirte. La base es tu
        consentimiento. Lo guardamos mientras se valora la candidatura. [Plazo concreto pendiente de Serveco.]
      </p>

      <h2>Asistente virtual</h2>
      <p>
        Las conversaciones con el asistente virtual de la web se guardan para mejorar sus respuestas y revisar su calidad. No escribas
        en el chat datos personales ni de tu caso que no quieras compartir; para tu caso concreto, usa el formulario.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos, y retirar tu consentimiento
        en cualquier momento, escribiendo a {EMPRESA.email}. Si consideras que no hemos atendido bien tu petición, puedes reclamar ante
        la Agencia Española de Protección de Datos (aepd.es).
      </p>

      <h2>Cookies</h2>
      <p>
        Lo explicamos en la política de cookies.{' '}
        <BotonCookies texto="Cambiar mi elección de cookies" className="font-semibold text-marca-texto underline" />
      </p>
    </LegalPage>
  );
}
