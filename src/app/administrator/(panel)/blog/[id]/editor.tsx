'use client';

import { useRef, useState, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';

/**
 * El cuerpo que se edita es el HTML publicado (`body`), el mismo que pinta la web.
 * El campo oculto sigue siendo Markdown: al guardar, los controles y el redactor leen eso.
 */
export default function EditorCuerpo({ html, markdown }: { html: string; markdown: string }) {
  const campo = useRef<HTMLInputElement>(null);
  const htmlListo = String(html ?? '').trim();
  const markdownListo = String(markdown ?? '');
  const usarHtml = htmlListo.length > 0;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: false },
      }),
      Placeholder.configure({ placeholder: 'Escribe el artículo…' }),
      Markdown,
    ],
    content: usarHtml ? htmlListo : markdownListo,
    contentType: usarHtml ? 'html' : 'markdown',
    editorProps: {
      attributes: {
        id: 'cuerpo',
        class: 'texto articulo min-h-[28rem] px-1 py-2 outline-none',
        'aria-label': 'Cuerpo del artículo',
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (campo.current) campo.current.value = ed.getMarkdown();
    },
  });

  const btn = (activo: boolean) =>
    `rounded-md px-2.5 py-1 text-sm font-semibold ${activo ? 'bg-tinta text-white' : 'hover:bg-white'}`;

  const ponerEnlace = () => {
    if (!editor) return;
    const previo = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Dirección del enlace', previo ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="editor-cuerpo overflow-hidden rounded-lg border border-linea">
      <input ref={campo} type="hidden" id="body_md" name="body_md" defaultValue={markdownListo} />
      <div className="flex flex-wrap gap-1 border-b border-linea bg-niebla p-2">
        <button type="button" className={btn(!!editor?.isActive('heading', { level: 2 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          Apartado
        </button>
        <button type="button" className={btn(!!editor?.isActive('heading', { level: 3 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          Subapartado
        </button>
        <button type="button" className={btn(!!editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()}>
          Negrita
        </button>
        <button type="button" className={btn(!!editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Cursiva
        </button>
        <button type="button" className={btn(!!editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          Lista
        </button>
        <button type="button" className={btn(!!editor?.isActive('link'))} onClick={ponerEnlace}>
          Enlace
        </button>
      </div>
      {editor ? (
        <EditorContent editor={editor} className="px-3 py-2" />
      ) : (
        <div className="texto articulo min-h-[28rem] px-4 py-3 text-tinta-2">Cargando el texto…</div>
      )}
    </div>
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
