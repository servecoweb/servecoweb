import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';

/**
 * Indexación abierta (molde Furgocasa). Las previews de Vercel siguen cerradas.
 * Las páginas legales no van aquí: llevan `noindex` y Google tiene que poder leerlo.
 * Panel y API no se rastrean.
 */
const PRIVADAS = ['/administrator', '/api/'];

const RASTREADORES_IA = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  const regla = { allow: '/', disallow: PRIVADAS };
  return {
    rules: [
      { userAgent: '*', ...regla },
      { userAgent: 'Googlebot', ...regla },
      ...RASTREADORES_IA.map((userAgent) => ({ userAgent, ...regla })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
