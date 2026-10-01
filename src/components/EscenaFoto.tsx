import { escena } from '@/data/escenas';

/** Foto de escena (gpt-image-2). No es un retrato ni la fachada de un despacho. */
export default function EscenaFoto({ id, lang = 'es' }: { id: string; lang?: 'es' | 'en' }) {
  const e = escena(id);
  const pie = lang === 'en' ? 'Illustrative image' : 'Imagen ilustrativa';
  return (
    <figure className="escena-figura">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="escena" src={e.archivo} alt={lang === 'en' ? e.altEn : e.alt} loading="lazy" />
      <figcaption>{pie}</figcaption>
    </figure>
  );
}
