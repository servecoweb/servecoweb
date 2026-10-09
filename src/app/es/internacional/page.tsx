import type { Metadata } from 'next';
import IntlPortada from '@/components/IntlPortada';
import { INTL_SEO } from '@/data/intl-seo';
import { ES, EN, idiomas } from '@/lib/rutas';

const seo = INTL_SEO.portada.es;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.metaDescription,
  alternates: { canonical: ES.internacional, languages: idiomas(ES.internacional, EN.international) },
};

export default function Internacional() {
  return <IntlPortada lang="es" />;
}
