import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import BotonCookies from '@/components/BotonCookies';

export const metadata: Metadata = { title: 'Política de cookies', robots: { index: false } };

/**
 * BORRADOR de política de cookies (LSSI-CE art. 22.2 + Guía de cookies de la AEPD) con lo que la web USA DE VERDAD
 * (revisado en el código el 25 sep 2026: consentimiento.ts, Analitica.tsx, ChatWidget.tsx, CapturaVisita.tsx,
 * BuscadorExterno.tsx). Si se añade una herramienta nueva, actualizar esta tabla. Lo valida Serveco.
 */
const FILAS: { nombre: string; tipo: string; finalidad: string; duracion: string; quien: string }[] = [
  { nombre: 'serveco_cookie_consent_v1', tipo: 'Necesaria · almacenamiento local', finalidad: 'Recordar su elección sobre las cookies', duracion: 'Hasta que la cambie o borre los datos del navegador', quien: 'Serveco' },
  { nombre: 'Conversación del asistente', tipo: 'Necesaria · almacenamiento de sesión', finalidad: 'Mantener la conversación con el asistente mientras navega', duracion: 'Se borra al cerrar la pestaña', quien: 'Serveco' },
  { nombre: 'serveco_visita_v1', tipo: 'Analítica · almacenamiento de sesión', finalidad: 'Saber por qué página entró y de qué web o campaña venía, para atender mejor su consulta', duracion: 'Se borra al cerrar la pestaña', quien: 'Serveco' },
  { nombre: '_ga, _ga_*', tipo: 'Analítica · cookie', finalidad: 'Google Analytics: contar visitas y saber cómo se usa la web, de forma agregada', duracion: 'Hasta 2 años (configuración de Google)', quien: 'Google' },
];

export default function Cookies() {
  return (
    <LegalPage titulo="Política de cookies">
      <h2>Qué son</h2>
      <p>
        Las cookies y tecnologías parecidas (como el almacenamiento local del navegador) guardan pequeños datos en su dispositivo. Algunas
        son necesarias para que la web funcione; el resto solo se usan si usted las acepta.
      </p>

      <h2>Las que usamos</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Para qué</th>
              <th>Duración</th>
              <th>De quién</th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((f) => (
              <tr key={f.nombre}>
                <td><code>{f.nombre}</code></td>
                <td>{f.tipo}</td>
                <td>{f.finalidad}</td>
                <td>{f.duracion}</td>
                <td>{f.quien}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Hoy no usamos cookies de publicidad ni de personalización. Si algún día las usamos, aparecerán aquí y solo se activarán si
        usted las acepta.
      </p>

      <h2>Servicios de terceros que solo se cargan si usted lo pide</h2>
      <ul>
        <li><strong>Buscador de subvenciones (Fandit):</strong> en la página de subvenciones, solo al pulsar «Abrir el buscador». Puede usar sus propias cookies.</li>
        <li><strong>Mapas:</strong> el botón «Cómo llegar» de cada despacho abre Google Maps en otra pestaña; en nuestra web no se carga ningún mapa.</li>
      </ul>

      <h2>Su elección</h2>
      <p>
        Al entrar puede aceptar, rechazar o configurar las cookies con el mismo esfuerzo. Ninguna opcional viene activada por defecto.
        Si retira su consentimiento, borramos las cookies de análisis que ya se hubieran instalado. Puede cambiar de opinión cuando
        quiera:
      </p>
      <p className="aviso" style={{ display: 'inline-block' }}>
        <BotonCookies texto="Abrir la configuración de cookies" className="font-semibold text-marca-texto underline" />
      </p>
      <p>
        También puede bloquear o borrar las cookies desde la configuración de su navegador. Si bloquea las necesarias, alguna parte de
        la web puede no funcionar bien.
      </p>

      <h2>Panel de administración</h2>
      <p>
        El área privada para el personal de Serveco usa cookies de sesión necesarias para identificar a quien entra. No afectan a los
        visitantes de la web.
      </p>
    </LegalPage>
  );
}
