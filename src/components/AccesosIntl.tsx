import Link from 'next/link';
import { ES, EN } from '@/lib/rutas';

/**
 * Accesos a los servicios para extranjeros y no residentes (home ES y EN).
 * Cada tarjeta lleva a una página que existe (regla de cero huérfanos):
 *  · NIE, impuesto de no residentes y Benidorm → páginas del silo internacional.
 *  · Testamentos y herencias → área jurídica (no hay página propia; su apartado civil lo cubre).
 *  · «Inmuebles» se integra en IRNR (la página trata alquileres, venta y retenciones).
 */
export default function AccesosIntl({ lang = 'es', variante = 'tarjetas' }: { lang?: 'es' | 'en'; variante?: 'tarjetas' | 'lista' }) {
  const en = lang === 'en';
  const accesos = en
    ? [
        { t: 'NIE number', d: 'Applying for and renewing it', href: EN.intl('nie-number') },
        { t: 'Non-resident tax (IRNR)', d: 'Rentals, property sales and the yearly return', href: EN.intl('non-resident-tax') },
        { t: 'Benidorm office', d: 'Face-to-face, in English', href: EN.intl('benidorm') },
        { t: 'Wills and inheritance', d: 'Succession in Spain', href: EN.area('legal') },
      ]
    : [
        { t: 'NIE', d: 'Obtención y renovación', href: ES.intl('nie') },
        { t: 'Impuesto de no residentes', d: 'Alquileres, venta de vivienda e impuesto anual', href: ES.intl('impuesto-no-residentes') },
        { t: 'Despacho en Benidorm', d: 'Atención presencial en inglés', href: ES.intl('benidorm') },
        { t: 'Testamentos y herencias', d: 'Sucesiones en España', href: ES.area('juridico') },
      ];

  return (
    <ul className={variante === 'lista' ? 'intl-accesos intl-accesos-lista' : 'intl-accesos'}>
      {accesos.map((a) => (
        <li key={a.t}>
          <Link href={a.href}>
            <strong>{a.t}</strong>
            <span>{a.d}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
