'use client';

import { abrirConfiguracionCookies } from '@/lib/consentimiento';

/** «Configurar cookies»: reabre el modal del banner. Por defecto, estilo del pie (fondo oscuro). */
export default function BotonCookies({
  texto,
  className = 'text-left hover:text-white hover:underline',
}: {
  texto: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={abrirConfiguracionCookies} className={className}>
      {texto}
    </button>
  );
}
