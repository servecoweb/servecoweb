import { AREAS } from '@/data/areas';
import { SEDES } from '@/data/offices';
import { LANDINGS } from '@/data/landings';
import { INTL } from '@/data/internacional';
import { articulosPublicados } from '@/lib/blog/publico';
import { ES, EN } from '@/lib/rutas';

/**
 * Mapa web: la lista ÚNICA de páginas que existen.
 * La usan /es/sitemap, /en/sitemap (página visible) y sitemap.xml (Google).
 * Regla: no se enlaza nada que no esté aquí; si una página existe, está aquí.
 */
export type Enlace = { label: string; href: string };
export type Grupo = { titulo: string; indexar: boolean; enlaces: Enlace[] };

export async function mapaES(): Promise<Grupo[]> {
  const area = (slug: string) => AREAS.find((a) => a.slug === slug)?.nombre ?? slug;
  const ciudad = (slug: string) => SEDES.find((s) => s.slug === slug)?.ciudad ?? slug;
  // Blog: los artículos PUBLICADOS en Supabase (lo que escribe el redactor y firma el abogado).
  const posts = await articulosPublicados();
  return [
    {
      titulo: 'Principal',
      indexar: true,
      enlaces: [
        { label: 'Inicio', href: ES.home },
        { label: 'Servicios', href: ES.servicios },
        { label: 'La firma', href: ES.firma },
        { label: 'Equipo', href: ES.equipo },
        { label: 'Despachos', href: ES.despachos },
        { label: 'Blog', href: ES.blog },
        { label: 'Contacto', href: ES.contacto },
      ],
    },
    { titulo: 'Áreas', indexar: true, enlaces: AREAS.map((a) => ({ label: a.nombre, href: ES.area(a.slug) })) },
    {
      titulo: 'Servicios por despacho',
      indexar: true,
      enlaces: LANDINGS.map((l) => ({ label: `${area(l.area)} en ${ciudad(l.sede)}`, href: ES.landing(l.area, l.sede) })),
    },
    {
      titulo: 'Trámites y ayudas',
      indexar: true,
      enlaces: [
        { label: 'Subvenciones', href: ES.subvenciones },
        { label: 'Punto PAE', href: ES.pae },
      ],
    },
    {
      titulo: 'Internacional',
      indexar: true,
      enlaces: [{ label: 'Internacional', href: ES.internacional }, ...INTL.map((p) => ({ label: p.titulo, href: ES.intl(p.slug) }))],
    },
    { titulo: 'Despachos', indexar: true, enlaces: SEDES.map((s) => ({ label: s.ciudad, href: ES.sede(s.slug) })) },
    { titulo: 'Blog', indexar: true, enlaces: posts.map((p) => ({ label: p.titulo, href: ES.post(p.slug) })) },
    {
      titulo: 'Legal',
      indexar: false,
      enlaces: [
        { label: 'Aviso legal', href: ES.avisoLegal },
        { label: 'Política de privacidad', href: ES.privacidad },
        { label: 'Política de cookies', href: ES.cookies },
      ],
    },
  ];
}

export function mapaEN(): Grupo[] {
  return [
    {
      titulo: 'Main',
      indexar: true,
      enlaces: [
        { label: 'Home', href: EN.home },
        { label: 'Services', href: EN.services },
        { label: 'About us', href: EN.about },
        { label: 'Our team', href: EN.team },
        { label: 'Offices', href: EN.offices },
        { label: 'Contact', href: EN.contact },
      ],
    },
    { titulo: 'Services', indexar: true, enlaces: AREAS.map((a) => ({ label: a.nombreEn, href: EN.area(a.slugEn) })) },
    {
      titulo: 'International clients',
      indexar: true,
      enlaces: [{ label: 'International clients', href: EN.international }, ...INTL.map((p) => ({ label: p.tituloEn, href: EN.intl(p.slugEn) }))],
    },
    {
      titulo: 'Legal',
      indexar: false,
      enlaces: [
        { label: 'Legal notice', href: EN.legalNotice },
        { label: 'Privacy policy', href: EN.privacy },
        { label: 'Cookie policy', href: EN.cookies },
      ],
    },
  ];
}
