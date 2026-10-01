/**
 * Escenas generadas con gpt-image-2 (misma guía que las portadas del blog).
 * Sirven para espacios, oficios y objetos. Los retratos del equipo y las fachadas
 * de los despachos reales no van aquí: los inventaría el modelo.
 */
export type Escena = {
  id: string;
  archivo: string;
  alt: string;
  altEn: string;
  brief: string;
};

export const ESCENAS: Escena[] = [
  {
    id: 'hero',
    archivo: '/escenas/hero-mesa.webp',
    alt: 'Mesa de trabajo de una asesoría con un expediente abierto y luz de tarde',
    altEn: 'An advisory firm’s desk with an open file in late-afternoon light',
    brief:
      'Mesa amplia de madera clara en un despacho de asesoría, un expediente de cartulina abierto con papeles en blanco desenfocados, un bolígrafo, una taza, luz de tarde por una ventana alta. Nadie sentado. Ambiente de firma seria en una ciudad mediterránea.',
  },
  {
    id: 'fiscal',
    archivo: '/escenas/area-fiscal.webp',
    alt: 'Mesa de cierre fiscal con carpetas y una taza',
    altEn: 'A year-end tax desk with folders and a cup',
    brief:
      'Mesa de despacho al final del día, varias carpetas de cartón apiladas, una calculadora apagada y una taza de café. Papeles sin texto legible. Luz cálida. Cierre de ejercicio en una asesoría.',
  },
  {
    id: 'laboral',
    archivo: '/escenas/area-laboral.webp',
    alt: 'Manos firmando un contrato sobre la mesa',
    altEn: 'Hands signing a contract on a desk',
    brief:
      'Primer plano de dos manos firmando un contrato en papel blanco, sin texto legible, sobre una mesa de madera. Solo manos y antebrazos, sin caras. Luz natural.',
  },
  {
    id: 'juridico',
    archivo: '/escenas/area-juridico.webp',
    alt: 'Escalinata de un juzgado mediterráneo vista desde la calle',
    altEn: 'Steps of a Mediterranean courthouse seen from the street',
    brief:
      'Escalinata de piedra de un palacio de justicia en una ciudad mediterránea, vista desde la acera, mañana clara. Una carpeta de cartón apoyada en un escalón. Sin personas reconocibles, sin mazo, sin balanza.',
  },
  {
    id: 'contable',
    archivo: '/escenas/area-contable.webp',
    alt: 'Estantería de archivadores en un despacho',
    altEn: 'Shelves of archive boxes in an office',
    brief:
      'Estantería de un despacho llena de archivadores de lomo neutro, sin letras ni años legibles. Pasillo estrecho, luz suave. Orden y archivo de una asesoría.',
  },
  {
    id: 'financiero',
    archivo: '/escenas/area-financiero.webp',
    alt: 'Un folio con gráficos desenfocados sobre la mesa',
    altEn: 'A page of out-of-focus charts on a desk',
    brief:
      'Una mano señala un folio impreso con gráficos abstractos muy desenfocados, sin números ni letras legibles, sobre una mesa clara. Sensación de cuadro de mando mensual.',
  },
  {
    id: 'auditoria',
    archivo: '/escenas/area-auditoria.webp',
    alt: 'Dos personas de espaldas revisando un informe',
    altEn: 'Two people seen from behind reviewing a report',
    brief:
      'Dos personas de espaldas, sentadas a una mesa, revisando un informe en papel sin texto legible. Ropa sobria. Despacho luminoso. Sin caras.',
  },
  {
    id: 'idi',
    archivo: '/escenas/area-idi.webp',
    alt: 'Taller de mueble con viruta y una pieza a medio hacer',
    altEn: 'A furniture workshop with sawdust and a piece in progress',
    brief:
      'Nave de un taller de mueble en el interior de Murcia: banco de trabajo, viruta de madera, una pieza de mobiliario a medio hacer. Luz de nave industrial. Sin marcas ni texto.',
  },
  {
    id: 'formacion',
    archivo: '/escenas/area-formacion.webp',
    alt: 'Sala de formación con sillas en U y una pizarra en blanco',
    altEn: 'A training room with chairs in a U and a blank board',
    brief:
      'Sala de reuniones de un despacho con sillas dispuestas en U y una pizarra totalmente en blanco. Luz natural, nadie en la sala. Formación para una plantilla.',
  },
  {
    id: 'bodega',
    archivo: '/escenas/sector-bodega.webp',
    alt: 'Interior de una bodega con barricas',
    altEn: 'Inside a winery with barrels',
    brief:
      'Interior de una bodega del altiplano: barricas de roble en fila, luz baja y cálida, suelo de piedra. Sin etiquetas legibles ni marcas.',
  },
  {
    id: 'taller',
    archivo: '/escenas/sector-taller.webp',
    alt: 'Taller industrial con madera y herramientas',
    altEn: 'An industrial workshop with wood and tools',
    brief:
      'Taller de ebanistería familiar, herramientas colgadas, tableros de madera, luz de ventanal. Sin logos ni texto. Industria del mueble.',
  },
  {
    id: 'costa',
    archivo: '/escenas/sector-costa.webp',
    alt: 'Terraza de un hotel en la costa mediterránea al atardecer',
    altEn: 'A hotel terrace on the Mediterranean coast at dusk',
    brief:
      'Terraza vacía de un hotel pequeño en la costa de Alicante al atardecer, sillas de mimbre, mar al fondo desenfocado. Sin marcas ni rótulos.',
  },
  // Sectores del carrusel de la home (Claude, 24 sep). Mismo criterio: sin caras, sin rótulos, sin texto.
  {
    id: 'agro',
    archivo: '/escenas/sector-agro.webp',
    alt: 'Almacén de manipulado de fruta con cajas de cítricos',
    altEn: 'A fruit packing warehouse with crates of citrus',
    brief:
      'Almacén de manipulado de fruta en la vega del Segura: cajas de madera con limones y naranjas en primer plano, una cinta transportadora al fondo, luz natural de nave. Sin personas reconocibles, sin rótulos ni etiquetas.',
  },
  {
    id: 'transporte',
    archivo: '/escenas/sector-transporte.webp',
    alt: 'Muelle de carga de una nave logística con palés',
    altEn: 'A logistics warehouse loading dock with pallets',
    brief:
      'Muelle de carga de una nave logística al amanecer, la trasera de un camión blanco sin rótulos acoplada a la puerta, palés con cajas de cartón sin texto. Sin personas reconocibles, sin matrículas legibles.',
  },
  {
    id: 'construccion',
    archivo: '/escenas/sector-construccion.webp',
    alt: 'Vivienda en construcción con andamio y planos enrollados',
    altEn: 'A house under construction with scaffolding and rolled plans',
    brief:
      'Obra de una vivienda en construcción en una ciudad mediterránea: estructura de hormigón, andamio, unos planos enrollados sobre un tablero. Luz de mañana. Sin personas reconocibles, sin carteles ni texto.',
  },
  {
    id: 'comercio',
    archivo: '/escenas/sector-comercio.webp',
    alt: 'Interior de una tienda de barrio con estanterías de madera',
    altEn: 'Inside a neighbourhood shop with wooden shelves',
    brief:
      'Interior de una tienda de barrio cuidada: estanterías de madera con productos sin etiquetas legibles, mostrador, luz cálida de tarde. Nadie en la tienda. Sin rótulos ni marcas.',
  },
  {
    id: 'servicios',
    archivo: '/escenas/sector-servicios.webp',
    alt: 'Pequeño estudio profesional con una mesa junto a la ventana',
    altEn: 'A small professional studio with a desk by the window',
    brief:
      'Pequeño estudio profesional: mesa de madera con un portátil cerrado, una libreta y unas gafas, estantería con libros de lomo liso, ventana con luz de ciudad. Nadie sentado. Sin texto legible.',
  },
  {
    id: 'llaves',
    archivo: '/escenas/intl-llaves.webp',
    alt: 'Llaves y una carpeta sobre la mesa, junto a una ventana con luz de costa',
    altEn: 'Keys and a folder on a table by a window with coastal light',
    brief:
      'Un juego de llaves de una vivienda y una carpeta cerrada sobre una mesa, junto a una ventana con luz de costa. Sin texto en la carpeta. Trámite de compra para alguien que llega a España.',
  },
];

export function escena(id: string): Escena {
  const e = ESCENAS.find((x) => x.id === id);
  if (!e) throw new Error(`Escena desconocida: ${id}`);
  return e;
}

/** Escena de cada área (slug ES). */
export const ESCENA_AREA: Record<string, string> = {
  fiscal: 'fiscal',
  laboral: 'laboral',
  juridico: 'juridico',
  contable: 'contable',
  financiero: 'financiero',
  auditoria: 'auditoria',
  'idi-patent-box': 'idi',
  formacion: 'formacion',
};
