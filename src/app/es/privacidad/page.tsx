import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import BotonCookies from '@/components/BotonCookies';
import { EMPRESA } from '@/data/site';

export const metadata: Metadata = { title: 'Política de privacidad', robots: { index: false } };

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
        <strong>Qué datos tratamos:</strong> los que usted nos facilita en el formulario (nombre, correo, teléfono, empresa, tipo de
        cliente, tamaño y sector de la empresa, área y despacho, urgencia, cómo nos conoció y su mensaje) y la página desde la que nos
        escribe. Si ha aceptado las cookies analíticas, también la primera página de su visita y la web o campaña de procedencia.
      </p>
      <p>
        <strong>Para qué:</strong> atender su consulta, asignarla al área y al despacho que corresponde, hacer el seguimiento de la
        misma (contactarle de nuevo sobre esa consulta, concertar una cita) y saber qué canales nos traen consultas. No los usamos
        para enviarle publicidad ni los cedemos a terceros, salvo obligación legal o proveedores que los tratan por cuenta nuestra
        (alojamiento web, base de datos y correo electrónico), con las garantías exigidas por la normativa.
      </p>
      <p>
        <strong>Base legal:</strong> su consentimiento, que da al enviar el formulario, y, si llega a ser cliente, las medidas
        precontractuales que solicita.
      </p>
      <p>
        <strong>Cuánto tiempo:</strong> mientras dure la gestión de su consulta y, después, durante el plazo necesario para atender
        posibles responsabilidades. [Plazo concreto pendiente de Serveco.] Si llega a ser cliente, se aplicarán los plazos de la
        relación profesional.
      </p>

      <h2>Asistente virtual</h2>
      <p>
        Las conversaciones con el asistente virtual de la web se guardan para mejorar sus respuestas y revisar su calidad. No escriba
        en el chat datos personales ni de su caso que no quiera compartir; para su caso concreto, use el formulario.
      </p>

      <h2>Sus derechos</h2>
      <p>
        Puede pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de sus datos, y retirar su consentimiento
        en cualquier momento, escribiendo a {EMPRESA.email}. Si considera que no hemos atendido bien su petición, puede reclamar ante
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
