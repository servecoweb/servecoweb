import { escena } from '@/data/escenas';

/** Fondo del inicio: escena generada (mesa de trabajo), no el despacho real. */
export default function HeroFondo() {
  const e = escena('hero');
  return (
    <div className="hero-fondo" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={e.archivo} alt="" width={1536} height={1024} fetchPriority="high" />
    </div>
  );
}
