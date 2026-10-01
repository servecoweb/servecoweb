import type { Metadata } from 'next';
import ServiciosHub from '@/components/ServiciosHub';
import { HUB_SEO } from '@/data/hub-seo';
import { ES, EN } from '@/lib/rutas';

const seo = HUB_SEO.es;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: ES.servicios, languages: { es: ES.servicios, en: EN.services } },
};

export default function Servicios() {
  return <ServiciosHub lang="es" />;
}
