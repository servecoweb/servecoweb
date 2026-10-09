import type { Metadata } from 'next';
import ServiciosHub from '@/components/ServiciosHub';
import { HUB_SEO } from '@/data/hub-seo';
import { ES, EN, idiomas } from '@/lib/rutas';

const seo = HUB_SEO.en;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: EN.services, languages: idiomas(ES.servicios, EN.services) },
};

export default function Services() {
  return <ServiciosHub lang="en" />;
}
