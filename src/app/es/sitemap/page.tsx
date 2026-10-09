import type { Metadata } from 'next';
import MapaWeb from '@/components/MapaWeb';
import { mapaES } from '@/lib/mapa-web';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Mapa web',
  description: 'Todas las páginas de la web de Serveco Asesores.',
  alternates: { canonical: ES.mapaWeb, languages: idiomas(ES.mapaWeb, EN.sitemap) },
};

export const dynamic = 'force-dynamic';

export default async function MapaWebEs() {
  return <MapaWeb grupos={await mapaES()} lang="es" />;
}
