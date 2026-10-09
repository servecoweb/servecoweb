import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntlPage from '@/components/IntlPage';
import { INTL, getIntl } from '@/data/internacional';
import { INTL_SEO } from '@/data/intl-seo';
import { ES, EN, idiomas } from '@/lib/rutas';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return INTL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getIntl(slug);
  if (!p) return {};
  const seo = INTL_SEO[p.slug as keyof typeof INTL_SEO]?.es;
  return {
    title: { absolute: seo?.title ?? p.titulo },
    description: seo?.metaDescription ?? p.lead,
    alternates: { canonical: ES.intl(p.slug), languages: idiomas(ES.intl(p.slug), EN.intl(p.slugEn)) },
  };
}

export default async function IntlEs({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getIntl(slug);
  if (!p) notFound();
  return <IntlPage p={p} lang="es" />;
}
