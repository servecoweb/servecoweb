import type { Metadata } from 'next';
import UtilBar from '@/components/UtilBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import VolverArriba from '@/components/VolverArriba';
import CookieBanner from '@/components/CookieBanner';
import Analitica from '@/components/Analitica';
import CapturaVisita from '@/components/CapturaVisita';
import DatosOrganizacion from '@/components/DatosOrganizacion';
import NoEncontrada from '@/components/NoEncontrada';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

/** URL que no casa con ninguna ruta. /es y /en tienen el suyo, dentro de su layout. */
export default function NotFound() {
  return (
    <div className="web">
      <UtilBar lang="es" />
      <Header lang="es" />
      <main>
        <NoEncontrada />
      </main>
      <Footer lang="es" />
      <ChatWidget lang="es" />
      <VolverArriba lang="es" />
      <CookieBanner lang="es" />
      <Analitica />
      <CapturaVisita />
      <DatosOrganizacion />
    </div>
  );
}
