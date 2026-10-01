'use client';

import { useFormStatus } from 'react-dom';

/** Botón de formulario con estado «trabajando…» (la redacción con IA tarda 2-5 minutos). */
export default function BotonEnviar({
  texto,
  trabajando,
  className = 'rounded-lg bg-marca px-5 py-2.5 text-sm font-semibold text-tinta hover:bg-marca-hover disabled:opacity-60',
  confirmar,
}: {
  texto: string;
  trabajando: string;
  className?: string;
  confirmar?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (confirmar && !window.confirm(confirmar)) e.preventDefault();
      }}
    >
      {pending ? trabajando : texto}
    </button>
  );
}
