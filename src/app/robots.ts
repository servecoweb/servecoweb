import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';

// En desarrollo se bloquea todo. Al salir a producción: molde Furgocasa
// (Allow + 11 user agents de IA: OAI-SearchBot, GPTBot, ChatGPT-User…).
const EN_PRODUCCION = false;

export default function robots(): MetadataRoute.Robots {
  if (!EN_PRODUCCION) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
