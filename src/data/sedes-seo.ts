/**
 * CONTENIDO SEO DE LAS 6 FICHAS DE DESPACHO (/es/la-firma/despachos/[sede]). Plantilla: PLAN-SEO-PAGINAS.md § 3.3.
 * Búsqueda: «asesoría / gestoría en [ciudad]». No compite con las landings («asesoría FISCAL en Yecla») ni con
 * las áreas («asesoría fiscal en Murcia»); en Benidorm, la página internacional persigue «para extranjeros».
 * Texto propio por ciudad (comarca, tejido económico, pueblos que se atienden). Sin horarios, aparcamiento ni
 * coordenadas: PENDIENTES de Serveco (no se inventan). Redacción de Eskala (25 sep 2026) · validado: false.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';

export type SedeSeo = PaginaSeo & {
  /** Municipios y comarcas que se atienden desde el despacho (schema areaServed y texto). */
  zonaAtendida: string[];
};

export const SEDES_SEO: Record<string, SedeSeo> = {
  // ───────────────────────────────────────────────────────────── MURCIA
  murcia: {
    title: 'Asesoría de empresas en Murcia | Serveco, desde 1977',
    metaDescription:
      'Sede central de Serveco Asesores en Murcia: Gran Vía y calle Acisclo Díaz. Asesoría fiscal, laboral, jurídica y contable para empresas desde 1977.',
    h1: 'Asesoría de empresas en Murcia',
    lead:
      'Nuestra sede central, con dos despachos en la ciudad: Gran Vía y calle Acisclo Díaz. Desde aquí coordinamos el trabajo de las ocho áreas y de todos nuestros despachos.',
    busquedaPrincipal: 'asesoría en Murcia',
    zonaAtendida: ['Murcia', 'Molina de Segura', 'Alcantarilla', 'Las Torres de Cotillas', 'Santomera', 'Beniel'],
    secciones: [
      {
        h2: 'La sede central de Serveco',
        parrafos: [
          'Serveco nació en Murcia en 1977 y aquí sigue su sede central. Desde los despachos de Gran Vía y de la calle Acisclo Díaz trabajan los responsables de las áreas y buena parte del equipo que atiende a empresas de toda la Región.',
          'Si su empresa está en Murcia capital o en el área metropolitana (Molina de Segura, Alcantarilla, Las Torres de Cotillas, Santomera…), este es su despacho de referencia. Y si está en otra comarca, su expediente es el mismo en cualquiera de nuestras sedes.',
        ],
      },
      {
        h2: 'Qué puede resolver en nuestros despachos de Murcia',
        parrafos: ['Desde Murcia se atienden todas las áreas de la firma:'],
        lista: [
          { t: 'Fiscal', d: 'Impuestos de empresas, autónomos y particulares, planificación y empresa familiar.' },
          { t: 'Laboral', d: 'Nóminas, contratos, despidos e inspecciones de trabajo.' },
          { t: 'Jurídico', d: 'Sociedades, contratos, reclamaciones y procedimientos judiciales.' },
          { t: 'Contable y financiero', d: 'Contabilidad, cuentas anuales y análisis con los sistemas A.D.' },
          { t: 'Auditoría, I+D+i y formación', d: 'Trabajos especializados que coordinamos desde la sede central.' },
          { t: 'Punto PAE', d: 'Creación de empresas y altas de autónomos en el punto oficial.' },
        ],
      },
      {
        h2: 'Un tejido empresarial de servicios, comercio e industria',
        parrafos: [
          'La capital y su entorno reúnen empresas de servicios, comercio, construcción, industria agroalimentaria y logística. Muchas son empresas familiares que llevan años con nosotros y que ya van por la segunda o la tercera generación: acompañarlas en el relevo es parte de nuestro trabajo.',
        ],
      },
      {
        h2: 'Cómo concertar una cita en Murcia',
        parrafos: [
          'Le recomendamos llamar o escribir antes de venir, para que le atienda directamente la persona del área que necesita. También podemos reunirnos por videollamada si le resulta más cómodo.',
        ],
      },
    ],
    faqs: [
      { q: '¿Qué diferencia hay entre los dos despachos de Murcia?', a: 'Los dos forman parte de la sede central y trabajan sobre los mismos expedientes. Al pedir cita le indicamos en cuál le atenderá la persona del área que necesita.' },
      { q: '¿Atienden a empresas de fuera de Murcia capital?', a: 'Sí. Desde Murcia trabajamos con empresas de toda la Región y, además, tenemos despachos en Yecla, Jumilla, Lorca, Balsicas y Benidorm.' },
      { q: '¿Tengo que ir en persona para darme de alta como cliente?', a: 'No es imprescindible. Podemos empezar por teléfono o videollamada y pedirle la documentación por correo.' },
      { q: '¿Puedo crear mi empresa desde el despacho de Murcia?', a: 'Sí. Somos Punto PAE: tramitamos la creación de sociedades y las altas de autónomos de forma oficial.' },
    ],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── YECLA
  yecla: {
    title: 'Asesoría y gestoría en Yecla | Serveco Asesores',
    metaDescription:
      'Dos despachos de Serveco en Yecla (calle Pío Baroja y calle Esteban Díaz): asesoría fiscal, laboral y contable para empresas del Altiplano, industria y empresa familiar.',
    h1: 'Asesoría de empresas en Yecla',
    lead:
      'Dos despachos en Yecla, en la calle Pío Baroja y en la calle Esteban Díaz, al servicio de las empresas y autónomos del Altiplano.',
    busquedaPrincipal: 'asesoría en Yecla',
    zonaAtendida: ['Yecla', 'Jumilla', 'Altiplano de Murcia'],
    secciones: [
      {
        h2: 'Dos despachos para las empresas del Altiplano',
        parrafos: [
          'Yecla es una de las ciudades con más tradición industrial de la Región. Nuestros dos despachos llevan años trabajando con sus empresas, muchas de ellas familiares, y con los autónomos y profesionales de la comarca.',
          'Tener dos locales en la ciudad nos permite atender cerca de donde está su negocio, con el respaldo de todas las áreas de Serveco.',
        ],
      },
      {
        h2: 'Industria del mueble, vino y empresa familiar',
        parrafos: [
          'El tejido de Yecla tiene nombre propio: la industria del mueble y el hábitat, con empresas que venden en toda España y fuera, y el sector del vino, con su denominación de origen. A su alrededor, talleres, transporte, comercio y servicios.',
          'Son empresas con necesidades concretas: costes de producción y márgenes, exportación, plantillas estables, deducciones por innovación en producto y, en muchos casos, el relevo generacional. Es justo donde más aporta una asesoría que coordina fiscal, laboral y financiero.',
        ],
      },
      {
        h2: 'Servicios desde nuestros despachos de Yecla',
        parrafos: [],
        lista: [
          { t: 'Fiscal', d: 'Impuestos de la empresa y del autónomo, planificación y empresa familiar.' },
          { t: 'Laboral', d: 'Nóminas, contratos y relaciones con la plantilla.' },
          { t: 'Contable y financiero', d: 'Contabilidad al día y análisis de costes con los sistemas A.D.' },
          { t: 'I+D+i', d: 'Deducciones por innovación en producto y procesos.' },
          { t: 'Jurídico', d: 'Contratos, sociedades y pactos entre socios.' },
        ],
      },
      {
        h2: 'Cómo concertar una cita en Yecla',
        parrafos: [
          'Llame al despacho que le quede más cerca o escríbanos. Le recomendamos pedir cita antes de venir para que le atienda la persona del área que necesita.',
        ],
      },
    ],
    faqs: [
      { q: '¿En qué despacho de Yecla me atienden?', a: 'En cualquiera de los dos. Al pedir cita le indicamos cuál le conviene según el área que necesite.' },
      { q: '¿Trabajan con empresas del mueble que exportan?', a: 'Sí. Llevamos la fiscalidad, la contabilidad y la parte laboral de empresas industriales de la zona, incluidas las que venden fuera de España.' },
      { q: '¿Atienden también a autónomos?', a: 'Sí: impuestos trimestrales, declaración de la renta y, cuando llega el momento, el paso a sociedad.' },
      { q: '¿Pueden llevar la empresa familiar en el relevo generacional?', a: 'Sí. Coordinamos la parte fiscal, jurídica y financiera del relevo para que la empresa pase a la siguiente generación con orden.' },
    ],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── JUMILLA
  jumilla: {
    title: 'Asesoría y gestoría en Jumilla | Serveco Asesores',
    metaDescription:
      'Despacho de Serveco en Jumilla, calle Valencia: asesoría fiscal, laboral y contable para bodegas, agricultores, empresas y autónomos de la comarca.',
    h1: 'Asesoría de empresas en Jumilla',
    lead: 'Nuestro despacho de la calle Valencia atiende a bodegas, explotaciones agrícolas, comercios, empresas y autónomos de Jumilla y su comarca.',
    busquedaPrincipal: 'asesoría en Jumilla',
    zonaAtendida: ['Jumilla', 'Yecla', 'Altiplano de Murcia'],
    secciones: [
      {
        h2: 'Un despacho cerca del campo y de las bodegas',
        parrafos: [
          'Jumilla vive en buena parte del vino y de la agricultura, con una denominación de origen reconocida y explotaciones de viñedo, almendro y olivo en toda la comarca. Alrededor, comercios, talleres y empresas de servicios.',
          'Nuestro despacho de la calle Valencia trabaja con ese tejido: bodegas, agricultores, cooperativistas, comercios y autónomos que prefieren tratar con alguien cerca.',
        ],
      },
      {
        h2: 'Lo que más nos piden en Jumilla',
        parrafos: [],
        lista: [
          { t: 'Campañas y contratación de temporada', d: 'Vendimia y recolección: contratos, altas y nóminas en los meses de más trabajo.' },
          { t: 'Fiscalidad agraria y de la bodega', d: 'Impuestos de la explotación y de la empresa, y elección del régimen más adecuado.' },
          { t: 'Contabilidad y cuentas anuales', d: 'Contabilidad al día y cierre del ejercicio.' },
          { t: 'Ayudas y financiación', d: 'Subvenciones para modernizar la explotación o la bodega, y apoyo ante los bancos.' },
          { t: 'Empresa familiar', d: 'Relevo generacional y organización del patrimonio familiar.' },
        ],
      },
      {
        h2: 'Todo el respaldo de Serveco desde Jumilla',
        parrafos: [
          'Aunque el despacho es cercano, detrás está toda la firma: si su bodega necesita un contrato de distribución, un análisis de costes o una revisión de sus deducciones, lo resuelve el área correspondiente sin que tenga que desplazarse.',
        ],
      },
      {
        h2: 'Cómo concertar una cita en Jumilla',
        parrafos: ['Llámenos o escríbanos y le daremos cita en el despacho o, si lo prefiere, por videollamada.'],
      },
    ],
    faqs: [
      { q: '¿Llevan la contratación de temporada de la vendimia?', a: 'Sí: contratos, altas, bajas y nóminas de las campañas, con la modalidad que corresponda en cada caso.' },
      { q: '¿Trabajan con bodegas?', a: 'Sí. Llevamos la fiscalidad, la contabilidad y la parte laboral de bodegas y empresas del sector del vino.' },
      { q: '¿Me pueden ayudar a pedir una subvención para mi explotación?', a: 'Sí. Buscamos las convocatorias que encajan con su proyecto y le ayudamos a preparar y tramitar la solicitud.' },
      { q: '¿Atienden a agricultores autónomos?', a: 'Sí: sus impuestos, su contabilidad y, si contratan personal, sus nóminas.' },
    ],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── LORCA
  lorca: {
    title: 'Asesoría y gestoría en Lorca | Serveco Asesores',
    metaDescription:
      'Despacho de Serveco en Lorca, Antigua Plaza de Abastos: asesoría fiscal, laboral, jurídica y contable para empresas y autónomos del Valle del Guadalentín.',
    h1: 'Asesoría de empresas en Lorca',
    lead:
      'Nuestro despacho de la Antigua Plaza de Abastos atiende a empresas, autónomos y particulares de Lorca y del Valle del Guadalentín.',
    busquedaPrincipal: 'asesoría en Lorca',
    zonaAtendida: ['Lorca', 'Puerto Lumbreras', 'Águilas', 'Totana', 'Valle del Guadalentín'],
    secciones: [
      {
        h2: 'Asesoría para Lorca y el Valle del Guadalentín',
        parrafos: [
          'Lorca es la cabecera de una comarca amplia, con un peso importante de la agricultura, la ganadería y la industria agroalimentaria, junto a la construcción, el comercio y los servicios. Desde nuestro despacho atendemos también a clientes de Puerto Lumbreras, Águilas, Totana y el resto del Valle del Guadalentín.',
        ],
      },
      {
        h2: 'Servicios desde nuestro despacho de Lorca',
        parrafos: [],
        lista: [
          { t: 'Fiscal', d: 'Impuestos de empresas, autónomos y particulares, y planificación antes del cierre.' },
          { t: 'Laboral', d: 'Nóminas, contratos y campañas con picos de contratación.' },
          { t: 'Jurídico', d: 'Contratos, sociedades, reclamación de deudas y herencias.' },
          { t: 'Contable', d: 'Contabilidad, cuentas anuales y libros oficiales.' },
          { t: 'Financiero', d: 'Financiación, planes de viabilidad y subvenciones.' },
        ],
      },
      {
        h2: 'Empresas agroalimentarias, ganaderas y de construcción',
        parrafos: [
          'Son sectores con necesidades muy concretas: plantillas que cambian según la campaña, inversiones grandes que hay que financiar bien, subcontratación en obra y, a menudo, estructuras familiares. Los trabajamos coordinando el área laboral, la fiscal y la financiera sobre el mismo expediente.',
        ],
      },
      {
        h2: 'Cómo concertar una cita en Lorca',
        parrafos: ['Llámenos o escríbanos y le daremos cita en el despacho de la Antigua Plaza de Abastos o por videollamada.'],
      },
    ],
    faqs: [
      { q: '¿Atienden a clientes de Águilas, Totana o Puerto Lumbreras?', a: 'Sí. Desde Lorca trabajamos con empresas y autónomos de todo el Valle del Guadalentín y la costa de Águilas.' },
      { q: '¿Llevan empresas agrícolas y ganaderas?', a: 'Sí: su fiscalidad, su contabilidad y la contratación de las campañas.' },
      { q: '¿Pueden reclamar una factura que no me pagan?', a: 'Sí. Nuestra área jurídica se ocupa de la reclamación, primero de forma extrajudicial y, si hace falta, en el juzgado.' },
      { q: '¿Tramitan herencias desde Lorca?', a: 'Sí: la parte jurídica y la fiscal de la herencia, coordinadas desde el mismo despacho.' },
    ],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── BALSICAS
  balsicas: {
    title: 'Asesoría y gestoría en Balsicas y Torre-Pacheco | Serveco',
    metaDescription:
      'Despacho de Serveco en Balsicas (Torre-Pacheco), avenida Ciudad de Murcia: asesoría para empresas agrícolas, autónomos y negocios del Campo de Cartagena y el Mar Menor.',
    h1: 'Asesoría de empresas en Balsicas y Torre-Pacheco',
    lead:
      'Nuestro despacho de la avenida Ciudad de Murcia, en Balsicas, atiende a empresas y autónomos de Torre-Pacheco, el Campo de Cartagena y el Mar Menor.',
    busquedaPrincipal: 'asesoría en Torre-Pacheco',
    zonaAtendida: ['Balsicas', 'Torre-Pacheco', 'San Javier', 'San Pedro del Pinatar', 'Los Alcázares', 'Fuente Álamo', 'Campo de Cartagena'],
    secciones: [
      {
        h2: 'Un despacho en el Campo de Cartagena',
        parrafos: [
          'Balsicas, pedanía de Torre-Pacheco, está en el centro del Campo de Cartagena, una de las zonas agrícolas más productivas de Europa. Desde aquí atendemos a empresas y autónomos de Torre-Pacheco, San Javier, Los Alcázares, Fuente Álamo y el resto de la comarca y del Mar Menor.',
        ],
      },
      {
        h2: 'Agricultura intensiva, almacenes y hostelería de costa',
        parrafos: [
          'El tejido de la zona combina explotaciones hortícolas, almacenes de manipulado y exportación, transporte, y negocios de hostelería y comercio en la costa del Mar Menor.',
          'Son actividades con mucha contratación de temporada, trabajadores de distintos países y operaciones con el extranjero. Por eso la parte laboral y la fiscal tienen que ir coordinadas desde el primer día.',
        ],
      },
      {
        h2: 'Servicios desde nuestro despacho de Balsicas',
        parrafos: [],
        lista: [
          { t: 'Laboral', d: 'Campañas, contratos, trabajadores extranjeros y nóminas.' },
          { t: 'Fiscal', d: 'Impuestos de la empresa agrícola, del almacén y del autónomo.' },
          { t: 'Contable', d: 'Contabilidad al día y cuentas anuales.' },
          { t: 'Financiero', d: 'Financiación de inversiones y subvenciones del sector.' },
        ],
      },
      {
        h2: 'Cómo concertar una cita en Balsicas',
        parrafos: ['Llámenos o escríbanos y le daremos cita en el despacho de la avenida Ciudad de Murcia o por videollamada.'],
      },
    ],
    faqs: [
      { q: '¿Balsicas pertenece a Torre-Pacheco?', a: 'Sí, Balsicas es una pedanía de Torre-Pacheco. Desde nuestro despacho atendemos a todo el municipio y a la comarca.' },
      { q: '¿Gestionan trabajadores extranjeros para la campaña?', a: 'Sí: contratos, altas y la documentación necesaria para contratar a personas de fuera de la Unión Europea.' },
      { q: '¿Atienden negocios de hostelería del Mar Menor?', a: 'Sí: nóminas de temporada, impuestos y contabilidad de restaurantes, bares y comercios de la costa.' },
      { q: '¿Llevan almacenes que exportan?', a: 'Sí: su contabilidad, la fiscalidad de las operaciones con el extranjero y la gestión laboral.' },
    ],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── BENIDORM
  benidorm: {
    title: 'Asesoría y gestoría en Benidorm | Serveco Asesores',
    metaDescription:
      'Despacho de Serveco en Benidorm, calle Jaén esquina avenida de Europa: asesoría fiscal, laboral y contable para negocios de la Costa Blanca y clientes internacionales.',
    h1: 'Asesoría de empresas en Benidorm',
    lead:
      'Nuestro despacho de la calle Jaén, esquina avenida de Europa, atiende a hoteles, restaurantes, comercios y autónomos de la Marina Baixa, y a clientes internacionales en inglés.',
    busquedaPrincipal: 'asesoría en Benidorm',
    zonaAtendida: ['Benidorm', 'Altea', "L'Alfàs del Pi", 'Finestrat', 'La Vila Joiosa', 'Marina Baixa'],
    secciones: [
      {
        h2: 'Asesoría para los negocios de la Marina Baixa',
        parrafos: [
          'Benidorm es uno de los principales destinos turísticos de Europa, y su economía gira en torno a la hostelería, el comercio y los servicios. Desde nuestro despacho atendemos a negocios de Benidorm, Altea, L’Alfàs del Pi, Finestrat, La Vila Joiosa y el resto de la Marina Baixa.',
        ],
      },
      {
        h2: 'Hostelería y turismo: temporada alta todo el año',
        parrafos: [
          'Los negocios turísticos tienen retos propios: picos de actividad, contratos fijos discontinuos, plantillas de muchas nacionalidades y clientes que pagan en varios idiomas. Llevamos la parte laboral, la fiscal y la contable de hoteles, apartamentos turísticos, restaurantes y comercios de la zona.',
        ],
      },
      {
        h2: 'Servicios desde nuestro despacho de Benidorm',
        parrafos: [],
        lista: [
          { t: 'Laboral', d: 'Nóminas, contratos de temporada y trabajadores extranjeros.' },
          { t: 'Fiscal', d: 'Impuestos de la empresa y del autónomo, y fiscalidad de los alquileres turísticos.' },
          { t: 'Contable', d: 'Contabilidad al día y cuentas anuales.' },
          { t: 'Clientes internacionales', d: 'NIE, impuesto de no residentes, herencias y compraventa de vivienda, en inglés.' },
        ],
      },
      {
        h2: 'Cómo concertar una cita en Benidorm',
        parrafos: ['Llámenos o escríbanos y le daremos cita en el despacho o por videollamada. Atendemos en español y en inglés.'],
      },
    ],
    faqs: [
      { q: '¿Atienden en inglés?', a: 'Sí. En el despacho de Benidorm atendemos en español y en inglés, en persona, por teléfono y por correo.' },
      { q: '¿Llevan hoteles y restaurantes?', a: 'Sí: nóminas de temporada, contratos, impuestos y contabilidad de negocios de hostelería de la Costa Blanca.' },
      { q: '¿Qué zonas atienden desde Benidorm?', a: 'Benidorm y la Marina Baixa: Altea, L’Alfàs del Pi, Finestrat, La Vila Joiosa y alrededores.' },
      { q: '¿Tengo un piso turístico en Benidorm: me pueden llevar los impuestos?', a: 'Sí. Revisamos cómo tributan sus alquileres, tanto si reside en España como si vive fuera.' },
    ],
    validado: false,
  },
};
