import type { Metadata } from 'next';
import MapaWeb from '@/components/MapaWeb';
import { mapaEN } from '@/lib/mapa-web';
import { ES, EN, idiomas } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'All pages of the Serveco website in English.',
  alternates: { canonical: EN.sitemap, languages: idiomas(ES.mapaWeb, EN.sitemap) },
};

export default function SitemapEn() {
  return <MapaWeb grupos={mapaEN()} lang="en" />;
}
