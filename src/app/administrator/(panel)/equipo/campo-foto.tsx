'use client';

import { useEffect, useState } from 'react';

/** Al elegir un archivo se ve esa foto al momento. La publicada no cambia hasta Guardar. */
export function CampoFoto({ actual, campo }: { actual?: string; campo: string }) {
  const [previa, setPrevia] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa);
    };
  }, [previa]);

  return (
    <div>
      <label htmlFor="foto" className="mb-1 block text-sm font-semibold">Foto</label>
      <input
        id="foto"
        name="foto"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={campo}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          setPrevia((antes) => {
            if (antes) URL.revokeObjectURL(antes);
            return archivo ? URL.createObjectURL(archivo) : null;
          });
        }}
      />
      <p className="mt-2 text-xs text-tinta-2">
        {previa
          ? 'Esta es la foto nueva. Pulsa Guardar para publicarla. El nombre del archivo no cambia nada.'
          : actual
            ? 'Esta es la foto que se ve ahora en la web.'
            : 'Todavía no hay foto. JPG, PNG o WebP, hasta 4 MB.'}
      </p>
      {(previa || actual) && (
        <img src={previa || actual} alt="" className="mt-3 h-24 w-24 rounded-lg object-cover object-top" />
      )}
    </div>
  );
}
