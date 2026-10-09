import type { Metadata } from 'next';
import IntlPortada from '@/components/IntlPortada';
import { INTL_SEO } from '@/data/intl-seo';
import { ES, EN, idiomas } from '@/lib/rutas';

const seo = INTL_SEO.portada.en;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: EN.international, languages: idiomas(ES.internacional, EN.international) },
};

export default function International() {
  return <IntlPortada lang="en" />;
}
