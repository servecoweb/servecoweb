'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { marked } from 'marked';
import TurndownService from 'turndown';

const Tiny = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), { ssr: false });

const aMarkdown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });

/**
 * TinyMCE edita el HTML publicado (`body`).
 * El campo oculto sigue en Markdown: al guardar, los controles y el redactor leen eso.
 */
export default function EditorCuerpo({ html, markdown }: { html: string; markdown: string }) {
  const campo = useRef<HTMLInputElement>(null);
  const htmlListo = String(html ?? '').trim();
  const markdownListo = String(markdown ?? '');
  const inicial = htmlListo || (marked.parse(markdownListo, { async: false }) as string);
  const clave = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div className="editor-cuerpo overflow-hidden rounded-lg border border-linea bg-papel">
      <input ref={campo} type="hidden" id="body_md" name="body_md" defaultValue={markdownListo} />
      {clave ? (
        <Tiny
          apiKey={clave}
          cloudChannel="8"
          initialValue={inicial}
          onEditorChange={(contenido) => {
            if (campo.current) campo.current.value = aMarkdown.turndown(contenido);
          }}
          init={{
            height: 640,
            menubar: false,
            branding: false,
            promotion: false,
            language: 'es',
            block_formats: 'Párrafo=p; Apartado=h2; Subapartado=h3',
            plugins: [
              'accordion', 'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
              'charmap', 'code', 'codesample', 'directionality', 'emoticons', 'fullscreen',
              'help', 'image', 'importcss', 'insertdatetime', 'link', 'lists', 'media',
              'nonbreaking', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace',
              'table', 'visualblocks', 'visualchars', 'wordcount',
              'suggestededits', // El abogado propone cambios sin pisar el texto del artículo
              'revisionhistory', // Deja constancia de cada cambio del borrador jurídico
              'exportword', // Saca el borrador a Word para revisarlo fuera del panel
              'powerpaste', // Pega un escrito de Word sin arrastrar el formato del documento
              'tableofcontents', // Índice de los apartados en artículos largos
              'footnotes', // Notas al pie para citas de norma y doctrina
              'importword', // Trae un .docx del despacho y lo deja como cuerpo del artículo
            ],
            toolbar: 'undo redo | blocks | bold italic | bullist numlist | link table | importword exportword | suggestededits revisionhistory | tableofcontents footnotes | searchreplace fullscreen',
            revisionhistory_fetch: () => Promise.resolve([]),
            paste_data_images: false,
            convert_urls: false,
            relative_urls: false,
            content_style:
              'body { font-family: system-ui, sans-serif; font-size: 17px; line-height: 1.6; color: #232527; margin: 16px; } h2 { font-size: 26px; } h3 { font-size: 20px; }',
          }}
        />
      ) : (
        <p className="p-4 text-sm text-red-700">Falta NEXT_PUBLIC_TINYMCE_API_KEY en .env.local.</p>
      )}
    </div>
  );
}

/** Vista previa local al elegir el archivo, antes de pulsar «Usar esta imagen». */
export function ElegirPortada() {
  const [vista, setVista] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const previo = useRef<string | null>(null);

  useEffect(() => () => {
    if (previo.current) URL.revokeObjectURL(previo.current);
  }, []);

  function alElegir(archivo: File | undefined) {
    if (previo.current) URL.revokeObjectURL(previo.current);
    previo.current = null;
    setVista(null);
    if (!archivo) {
      setAviso('');
      return;
    }
    const nombre = archivo.name.toLowerCase();
    const vale = archivo.type.startsWith('image/') || /\.(jpe?g|png|webp)$/.test(nombre);
    if (!vale) {
      setAviso('La imagen tiene que ser JPG, PNG o WebP.');
      return;
    }
    const url = URL.createObjectURL(archivo);
    previo.current = url;
    setVista(url);
    setAviso(archivo.size > 4 * 1024 * 1024 ? 'Pesa más de 4 MB. Elija una más ligera antes de usarla.' : '');
  }

  return (
    <>
      <label className="block text-sm font-semibold" htmlFor="portada">Subir una imagen propia</label>
      <input
        id="portada"
        name="imagen"
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        required
        className="w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca"
        onChange={(e) => alElegir(e.target.files?.[0])}
      />
      {aviso && <p className="text-sm text-red-700">{aviso}</p>}
      {vista && (
        <figure>
          <img src={vista} alt="Vista previa de la imagen elegida" className="max-h-96 w-full rounded-lg object-contain bg-niebla" />
          <figcaption className="mt-1 text-xs text-tinta-2">Vista previa. Aún no sustituye la portada: pulse «Usar esta imagen».</figcaption>
        </figure>
      )}
    </>
  );
}

/** Pestañas de la ficha, al modo Joomla: el texto, la portada, los títulos y la publicación. */
export type FichaArticulo = 'contenido' | 'portada' | 'titulos' | 'publicacion';

const FICHAS: { id: FichaArticulo; etiqueta: string }[] = [
  { id: 'contenido', etiqueta: 'Contenido' },
  { id: 'portada', etiqueta: 'Portada' },
  { id: 'titulos', etiqueta: 'Títulos y metadatos' },
  { id: 'publicacion', etiqueta: 'Publicación' },
];

export function FichasArticulo({
  inicial,
  action,
  portada,
  altPortada,
  contenido,
  titulos,
  publicacion,
  guardar,
}: {
  inicial: FichaArticulo;
  action: (formData: FormData) => Promise<void>;
  portada: ReactNode;
  altPortada: ReactNode;
  contenido: ReactNode;
  titulos: ReactNode;
  publicacion: ReactNode;
  guardar: ReactNode;
}) {
  const [ficha, setFicha] = useState<FichaArticulo>(inicial);
  return (
    <div className="overflow-hidden rounded-xl border border-linea bg-papel">
      <div role="tablist" aria-label="Ficha del artículo" className="flex flex-wrap gap-1 border-b border-linea bg-niebla px-3 pt-3">
        {FICHAS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`ficha-${f.id}`}
            aria-selected={ficha === f.id}
            aria-controls={`panel-${f.id}`}
            className={`-mb-px rounded-t-md border px-4 py-2.5 text-sm font-semibold ${
              ficha === f.id
                ? 'border-linea border-b-papel bg-papel text-tinta'
                : 'border-transparent text-tinta-2 hover:text-tinta'
            }`}
            onClick={() => setFicha(f.id)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>
      <div className="p-5">
        <div id="panel-portada" role="tabpanel" aria-labelledby="ficha-portada" hidden={ficha !== 'portada'}>
          {portada}
        </div>
        <form id="editar" action={action}>
          <div id="panel-contenido" role="tabpanel" aria-labelledby="ficha-contenido" hidden={ficha !== 'contenido'}>
            {contenido}
          </div>
          <div hidden={ficha !== 'portada'} className="mt-4 border-t border-linea pt-4">
            {altPortada}
          </div>
          <div id="panel-titulos" role="tabpanel" aria-labelledby="ficha-titulos" hidden={ficha !== 'titulos'}>
            {titulos}
          </div>
          <div id="panel-publicacion" role="tabpanel" aria-labelledby="ficha-publicacion" hidden={ficha !== 'publicacion'}>
            {publicacion}
          </div>
          <div className="mt-4 border-t border-linea pt-4">{guardar}</div>
        </form>
      </div>
    </div>
  );
}
