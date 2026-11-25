'use client';

import { useEffect, useState } from 'react';

/** Al elegir un archivo se ve esa foto al momento. La publicada no cambia hasta Guardar. */
export function CampoFoto({ actual, campo }: { actual?: string; campo: string }) {
  const [previa, setPrevia] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa);
    };
  }, [previa]);

  function alElegir(input: HTMLInputElement) {
    const archivo = input.files?.[0];
    setAviso('');
    if (!archivo) return;
    const vale = archivo.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(archivo.name);
    if (!vale || archivo.size > 4 * 1024 * 1024) {
      input.value = '';
      setNombre('');
      setPrevia((antes) => {
        if (antes) URL.revokeObjectURL(antes);
        return null;
      });
      setAviso(vale ? 'Pesa más de 4 MB. Elija una más ligera.' : 'Tiene que ser JPG, PNG o WebP.');
      return;
    }
    setNombre(archivo.name);
    setPrevia((antes) => {
      if (antes) URL.revokeObjectURL(antes);
      return URL.createObjectURL(archivo);
    });
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">Foto</span>
      <label className={`${campo} relative block cursor-pointer`}>
        <span className="block truncate">{nombre || 'Elegir foto'}</span>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => alElegir(e.currentTarget)}
        />
      </label>
      {aviso && <p className="mt-2 text-xs text-red-700">{aviso}</p>}
      <p className="mt-2 text-xs text-tinta-2">
        {previa
          ? 'Esta es la foto que acaba de elegir. Ya se ve aquí. Pulse Guardar para publicarla: se ajusta el tamaño y se guarda en WebP.'
          : actual
            ? 'Esta es la foto publicada. Al elegir otra, la verá aquí al momento. Al guardar se ajusta el tamaño y se publica en WebP.'
            : 'Todavía no hay foto. JPG, PNG o WebP, hasta 4 MB. Al guardar se ajusta el tamaño y se publica en WebP.'}
      </p>
      {(previa || actual) && (
        <img
          src={previa || actual}
          alt=""
          className={`mt-3 h-40 w-40 rounded-lg object-cover object-top ${previa ? 'ring-2 ring-marca' : ''}`}
        />
      )}
    </div>
  );
}
