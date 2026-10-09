import { readFileSync } from 'node:fs';

/**
 * Redirecciones 301 del WordPress antiguo (H1.6): src/data/redirecciones.json, generado por
 * `npm run seo:redirecciones` (scripts/mapa-redirecciones.ts) y REVISADO a mano (docs/REDIRECCIONES.md).
 * Las URLs del hackeo no están en el JSON: dan 404 y Google las olvida.
 */
function redireccionesWordPress() {
  try {
    const lista = JSON.parse(readFileSync(new URL('./src/data/redirecciones.json', import.meta.url), 'utf8'));
    return Array.isArray(lista) ? lista.filter((r) => r && r.source && r.destination) : [];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // La raíz del dominio lleva al español (308: Google consolida la home en /es).
      { source: '/', destination: '/es', permanent: true },
      ...redireccionesWordPress(),
    ];
  },
};

export default nextConfig;
