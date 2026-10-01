import type { Metadata } from 'next';
import MapaWeb from '@/components/MapaWeb';
import { mapaEN } from '@/lib/mapa-web';
import { ES, EN } from '@/lib/rutas';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'All pages of the Serveco website in English.',
  alternates: { canonical: EN.sitemap, languages: { es: ES.mapaWeb, en: EN.sitemap } },
};

export default function SitemapEn() {
  return <MapaWeb grupos={mapaEN()} lang="en" />;
}
