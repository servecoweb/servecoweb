import UtilBar from '@/components/UtilBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import VolverArriba from '@/components/VolverArriba';
import CookieBanner from '@/components/CookieBanner';
import Analitica from '@/components/Analitica';
import CapturaVisita from '@/components/CapturaVisita';
import DatosOrganizacion from '@/components/DatosOrganizacion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: { type: 'website', siteName: 'Serveco Asesores', locale: 'en_GB', alternateLocale: ['es_ES'] },
};

// El <html> raíz es lang="es". Aquí marcamos el bloque en inglés.
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="web">
      <UtilBar lang="en" />
      <Header lang="en" />
      <main>{children}</main>
      <Footer lang="en" />
      <ChatWidget lang="en" />
      <VolverArriba lang="en" />
      <CookieBanner lang="en" />
      <Analitica />
      <CapturaVisita />
      <DatosOrganizacion />
    </div>
  );
}
