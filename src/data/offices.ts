/**
 * Sedes. En Supabase será la tabla `offices`.
 * Abrir una sede nueva (p. ej. Madrid) = añadir un objeto aquí. El diseño no cambia.
 * Regla: solo sedes con despacho real (no doorway pages).
 *
 * PENDIENTE verificar con Serveco:
 *  - Balsicas: hoy lleva el mismo teléfono que la central.
 *  - Yecla: qué teléfono corresponde a cada local.
 */
export type Local = { direccion: string; tel: string };

export type Sede = {
  slug: string;
  ciudad: string;
  zona: string;
  central?: boolean;
  locales: Local[];
};

export const SEDES: Sede[] = [
  {
    slug: 'murcia',
    ciudad: 'Murcia',
    zona: 'Región de Murcia',
    central: true,
    locales: [
      { direccion: 'Gran Vía, 28, 5.º', tel: '968 909 020' },
      { direccion: 'C/ Acisclo Díaz, 2', tel: '968 284 766' },
    ],
  },
  {
    slug: 'yecla',
    ciudad: 'Yecla',
    zona: 'Región de Murcia',
    locales: [
      { direccion: 'C/ Pío Baroja, 7', tel: '968 753 640' },
      { direccion: 'C/ Esteban Díaz, 53', tel: '968 790 408' },
    ],
  },
  {
    slug: 'jumilla',
    ciudad: 'Jumilla',
    zona: 'Región de Murcia',
    locales: [{ direccion: 'C/ Valencia, 2', tel: '968 780 040' }],
  },
  {
    slug: 'lorca',
    ciudad: 'Lorca',
    zona: 'Región de Murcia',
    locales: [{ direccion: 'Antigua Plaza de Abastos, 15, local 10', tel: '968 471 431' }],
  },
  {
    slug: 'balsicas',
    ciudad: 'Balsicas',
    zona: 'Región de Murcia',
    locales: [{ direccion: 'Avda. Ciudad de Murcia, 90, bajo', tel: '968 909 020' }],
  },
  {
    slug: 'benidorm',
    ciudad: 'Benidorm',
    zona: 'Costa de Alicante',
    locales: [{ direccion: 'Calle Jaén, 1 (esq. Avda. de Europa)', tel: '665 912 758' }],
  },
  // Ejemplo futuro, solo con despacho real:
  // { slug: 'madrid', ciudad: 'Madrid', zona: 'Madrid', locales: [{ direccion: '…', tel: '…' }] },
];

/** Enlace a Google Maps en otra pestaña. Nunca incrustar el mapa: instalaría cookies sin consentimiento. */
export const comoLlegar = (direccion: string, ciudad: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${direccion}, ${ciudad}, España`)}`;

export function getSede(slug: string): Sede | undefined {
  return SEDES.find((s) => s.slug === slug);
}

const NUMEROS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

/** "Seis ciudades" / "Siete ciudades"… para titulares que no se desactualizan. */
export function ciudadesEnLetra(): string {
  const n = SEDES.length;
  const palabra = NUMEROS[n] ?? String(n);
  return palabra.charAt(0).toUpperCase() + palabra.slice(1) + (n === 1 ? ' ciudad' : ' ciudades');
}
