import UtilBar from '@/components/UtilBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import CookieBanner from '@/components/CookieBanner';
import Analitica from '@/components/Analitica';
import CapturaVisita from '@/components/CapturaVisita';
import DatosOrganizacion from '@/components/DatosOrganizacion';

// .web = web pública. Los paneles de /administrator no llevan esta clase (ni banner, ni Analytics).
export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="web">
      <UtilBar lang="es" />
      <Header lang="es" />
      <main>{children}</main>
      <Footer lang="es" />
      <ChatWidget lang="es" />
      <CookieBanner lang="es" />
      <Analitica />
      <CapturaVisita />
      <DatosOrganizacion />
    </div>
  );
}
