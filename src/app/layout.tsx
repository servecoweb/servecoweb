import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/data/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Serveco Asesores | Asesoría de empresas desde 1977',
    template: '%s | Serveco Asesores',
  },
  description:
    'Asesoría integral de empresas desde 1977. Fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación.',
  openGraph: {
    type: 'website',
    siteName: 'Serveco Asesores',
    locale: 'es_ES',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* next/font/google cuelga la compilación tras el proxy (UNABLE_TO_VERIFY_LEAF_SIGNATURE). */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
