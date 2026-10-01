import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { EMPRESA, SITE_URL } from '@/data/site';
import { ES } from '@/lib/rutas';

export const metadata: Metadata = { title: 'Aviso legal', robots: { index: false } };

/**
 * BORRADOR de aviso legal (LSSI-CE, art. 10) redactado por Eskala (25 sep 2026).
 * Entre corchetes, los datos que solo tiene Serveco. La versión definitiva la valida Serveco.
 */
export default function AvisoLegal() {
  return (
    <LegalPage titulo="Aviso legal">
      <h2>Titular de la web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico, le informamos de
        que esta web ({SITE_URL}) pertenece a:
      </p>
      <ul>
        <li><strong>Titular:</strong> {EMPRESA.razonSocial} [razón social completa pendiente]</li>
        <li><strong>NIF:</strong> [pendiente]</li>
        <li><strong>Domicilio social:</strong> [pendiente]</li>
        <li><strong>Datos registrales:</strong> [Registro Mercantil, tomo, folio, hoja: pendiente]</li>
        <li><strong>Contacto:</strong> {EMPRESA.email} · {EMPRESA.tel}</li>
        <li><strong>Colegio profesional de los abogados:</strong> [pendiente, si procede]</li>
      </ul>

      <h2>Condiciones de uso</h2>
      <p>
        El acceso a esta web es libre y gratuito. Al usarla, usted se compromete a hacerlo de forma lícita y a no dañar su
        funcionamiento ni la información que contiene.
      </p>

      <h2>Los contenidos no son asesoramiento</h2>
      <p>
        Los textos de esta web, los artículos del blog y las respuestas del asistente virtual tienen carácter informativo y general.
        No constituyen asesoramiento fiscal, laboral, jurídico ni de ningún otro tipo, y no sustituyen el estudio de su caso por un
        profesional. La normativa cambia con frecuencia: antes de tomar una decisión, consúltenos.
      </p>
      <p>
        El uso del formulario de contacto o del asistente virtual no crea por sí mismo una relación profesional con {EMPRESA.razonSocial}.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el diseño, los logotipos y el resto de elementos de esta web son de {EMPRESA.razonSocial} o se usan con
        autorización. No se pueden reproducir, distribuir ni transformar sin permiso, salvo para uso personal y privado. Las imágenes
        ilustrativas se identifican como tales.
      </p>

      <h2>Enlaces</h2>
      <p>
        Esta web puede enlazar a páginas de terceros, como organismos oficiales. No somos responsables de su contenido ni de su
        disponibilidad. Algunos servicios de terceros, como el buscador de subvenciones, solo se cargan si usted lo pide.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Procuramos que la información sea correcta y esté actualizada, pero no garantizamos la ausencia de errores ni que la web esté
        siempre disponible. No respondemos de los daños derivados del uso de la información de la web sin el asesoramiento
        profesional correspondiente.
      </p>

      <h2>Protección de datos y cookies</h2>
      <p>
        Lo explicamos en la <Link className="enlace" href={ES.privacidad}>política de privacidad</Link> y en la{' '}
        <Link className="enlace" href={ES.cookies}>política de cookies</Link>.
      </p>

      <h2>Legislación aplicable</h2>
      <p>Este aviso se rige por la legislación española. [Juzgados competentes: pendiente de Serveco.]</p>
    </LegalPage>
  );
}
