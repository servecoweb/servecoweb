import { escena } from '@/data/escenas';

/** Foto de escena (gpt-image-2). No es un retrato ni la fachada de un despacho.
 *  `gancho` es el recuadro naranja de la foto: texto real, no va dentro de la imagen. */
export default function EscenaFoto({
  id,
  lang = 'es',
  gancho,
}: {
  id: string;
  lang?: 'es' | 'en';
  gancho?: string;
}) {
  const e = escena(id);
  const pie = lang === 'en' ? 'Illustrative image' : 'Imagen ilustrativa';
  const foto = (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="escena" src={e.archivo} alt={lang === 'en' ? e.altEn : e.alt} loading="lazy" />
  );
  return (
    <figure className="escena-figura">
      {gancho ? (
        <div className="escena-marco">
          {foto}
          <p className="escena-gancho">{gancho}</p>
        </div>
      ) : (
        foto
      )}
      <figcaption>{pie}</figcaption>
    </figure>
  );
}
