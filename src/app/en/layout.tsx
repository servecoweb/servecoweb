import UtilBar from '@/components/UtilBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import CookieBanner from '@/components/CookieBanner';
import Analitica from '@/components/Analitica';
import CapturaVisita from '@/components/CapturaVisita';
import DatosOrganizacion from '@/components/DatosOrganizacion';

// El <html> raíz es lang="es". Aquí marcamos el bloque en inglés.
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="web">
      <UtilBar lang="en" />
      <Header lang="en" />
      <main>{children}</main>
      <Footer lang="en" />
      <ChatWidget lang="en" />
      <CookieBanner lang="en" />
      <Analitica />
      <CapturaVisita />
      <DatosOrganizacion />
    </div>
  );
}
