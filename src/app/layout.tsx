import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/data/site';
import { ScriptConsentimiento } from '@/components/Analitica';
import './globals.css';

const DESCRIPCION =
  'Asesoría integral de empresas desde 1977. Fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Serveco Asesores | Asesoría de empresas desde 1977',
    template: '%s | Serveco Asesores',
  },
  description: DESCRIPCION,
  applicationName: 'Serveco Asesores',
  authors: [{ name: 'Serveco Asesores S.L.P.', url: SITE_URL }],
  creator: 'Serveco Asesores',
  icons: {
    icon: [{ url: '/images/logo_favicon.jpg', type: 'image/jpeg' }],
    shortcut: '/images/logo_favicon.jpg',
    apple: '/images/logo_favicon.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Serveco Asesores',
    locale: 'es_ES',
    alternateLocale: ['en_GB'],
    images: [{ url: '/images/logo-serveco-asesores.jpg', width: 700, height: 250, alt: 'Serveco Asesores' }],
  },
  twitter: {
    card: 'summary',
    images: ['/images/logo-serveco-asesores.jpg'],
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <ScriptConsentimiento />
      </head>
      <body>{children}</body>
    </html>
  );
}
