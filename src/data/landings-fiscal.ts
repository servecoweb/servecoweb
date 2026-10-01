/**
 * LANDINGS FISCAL × 5 sedes (Yecla, Jumilla, Lorca, Balsicas, Benidorm). Ver src/data/landings.ts.
 * Texto propio por sede. Sin cifras que caducan ni consejo personalizado. Eskala, 25 sep 2026 · validado: false.
 */
import type { Landing } from './landings-tipos';

export const LANDINGS_FISCAL: Landing[] = [
  {
    area: 'fiscal',
    sede: 'yecla',
    title: 'Asesoría fiscal en Yecla para empresas y autónomos | Serveco',
    metaDescription:
      'Asesoría fiscal en Yecla para la industria del mueble, bodegas, pymes y autónomos: impuestos, exportación, I+D+i y empresa familiar. Dos despachos en la ciudad.',
    h1: 'Asesoría fiscal en Yecla',
    lead: 'Llevamos los impuestos de fabricantes, talleres, bodegas y autónomos de Yecla desde nuestros dos despachos en la ciudad, con el respaldo de toda el área fiscal de Serveco.',
    busquedaPrincipal: 'asesoría fiscal en Yecla',
    secciones: [
      {
        h2: 'Fiscalidad para la industria de Yecla',
        parrafos: [
          'Yecla tiene uno de los tejidos industriales más sólidos de la Región: el mueble y el hábitat, con empresas que venden en toda España y fuera, y alrededor, talleres, transporte, comercio y servicios. Son empresas con márgenes ajustados, inversiones en maquinaria y, muchas veces, varias generaciones de la misma familia al frente.',
          'En ese contexto, la fiscalidad no es solo presentar impuestos a tiempo: es aprovechar las deducciones que corresponden, no pagar de más por una mala planificación y ordenar el patrimonio de la familia empresaria.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestros despachos de Yecla',
        parrafos: [],
        lista: [
          { t: 'Impuesto de sociedades', d: 'Con una revisión antes del cierre para aplicar deducciones e incentivos que correspondan.' },
          { t: 'IVA y operaciones con el extranjero', d: 'Ventas a otros países de la Unión Europea y exportaciones, con sus declaraciones informativas.' },
          { t: 'IRPF de autónomos y socios', d: 'Pagos fraccionados, declaración de la renta y retribución de los socios que trabajan en la empresa.' },
          { t: 'Deducciones por innovación', d: 'Nuevos diseños, materiales o procesos que pueden dar derecho a la deducción por I+D+i.' },
          { t: 'Empresa familiar', d: 'Planificación del relevo generacional y del patrimonio para aprovechar los beneficios fiscales previstos para la empresa familiar.' },
          { t: 'Requerimientos e inspecciones', d: 'Respuesta a Hacienda y acompañamiento durante las comprobaciones.' },
        ],
      },
      {
        h2: 'Innovación en producto: una deducción que muchas empresas de Yecla no aplican',
        parrafos: [
          'Desarrollar una nueva colección, probar un material distinto o rediseñar un proceso de fabricación puede encajar en la deducción por innovación tecnológica o por I+D. Muchas empresas del mueble lo hacen cada año sin saber que podrían tener un incentivo fiscal por ello.',
          'Nuestra área de I+D+i, con ingenieros en el equipo, revisa qué proyectos pueden encajar y prepara la documentación para aplicarlos con seguridad.',
        ],
      },
      {
        h2: 'El relevo en la empresa familiar',
        parrafos: [
          'Muchas empresas de Yecla están ya en la segunda o tercera generación. Pasar la empresa a los hijos, dar entrada a un socio o reorganizar el patrimonio familiar tiene consecuencias fiscales importantes, y la normativa prevé beneficios para la empresa familiar que solo se aplican si se cumplen ciertos requisitos con antelación.',
          'Por eso conviene planificarlo con tiempo, coordinando la parte fiscal con la jurídica y la financiera, algo que en Serveco se hace sobre el mismo expediente.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: [
          'Una primera reunión en cualquiera de nuestros dos despachos de Yecla, o por videollamada, para conocer su empresa. Revisamos sus últimas declaraciones y le proponemos cómo trabajar: una iguala mensual con todo incluido o un trabajo concreto.',
        ],
      },
    ],
    faqs: [
      { q: '¿Qué despacho de Yecla lleva la parte fiscal?', a: 'Los dos trabajan sobre los mismos expedientes. Al pedir cita le indicamos en cuál le atenderá la persona que llevará su fiscalidad.' },
      { q: '¿Mi taller puede aplicar la deducción por innovación?', a: 'Depende del proyecto: no hace falta ser una gran empresa ni tener laboratorio. Lo revisamos con usted y, si encaja, preparamos la documentación.' },
      { q: 'Vendo muebles a otros países de la UE. ¿Cambia algo en el IVA?', a: 'Sí: las ventas a empresas de otros países de la Unión tienen su propio tratamiento y declaraciones informativas. Las revisamos para que estén bien desde la primera factura.' },
      { q: '¿Cuándo me conviene pasar de autónomo a sociedad?', a: 'Depende de sus beneficios, del riesgo de la actividad y de sus planes. Lo calculamos con sus números reales antes de dar el paso.' },
    ],
    cta: 'Pedir cita con el área fiscal en Yecla',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'fiscal',
    sede: 'jumilla',
    title: 'Asesoría fiscal en Jumilla para bodegas y agricultores | Serveco',
    metaDescription:
      'Asesoría fiscal en Jumilla: impuestos de bodegas, explotaciones agrícolas, comercios y autónomos. Régimen agrario, IVA y ayudas. Despacho en la calle Valencia.',
    h1: 'Asesoría fiscal en Jumilla',
    lead: 'Desde nuestro despacho de la calle Valencia llevamos la fiscalidad de bodegas, agricultores, comercios y autónomos de Jumilla y su comarca.',
    busquedaPrincipal: 'asesoría fiscal en Jumilla',
    secciones: [
      {
        h2: 'Impuestos del campo y de la bodega',
        parrafos: [
          'Buena parte de la economía de Jumilla gira en torno al vino y a la agricultura: viñedo, almendro, olivo, bodegas que embotellan y venden fuera, cooperativistas y pequeños agricultores. Es un sector con una fiscalidad propia y con decisiones que conviene tomar bien desde el principio.',
          'Elegir el régimen adecuado, llevar bien el IVA de la explotación o de la bodega y tener en cuenta cómo tributan las ayudas que se reciben puede suponer una diferencia real al final del año.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Jumilla',
        parrafos: [],
        lista: [
          { t: 'Agricultores y ganaderos', d: 'Elección y seguimiento del régimen de tributación más adecuado para la explotación, en el IRPF y en el IVA.' },
          { t: 'Bodegas', d: 'Impuesto de sociedades, IVA y las obligaciones propias del sector del vino, coordinadas con su contabilidad.' },
          { t: 'Comercios y autónomos', d: 'Impuestos trimestrales, declaración de la renta y paso a sociedad cuando conviene.' },
          { t: 'Ayudas y subvenciones', d: 'Cómo tributan las ayudas agrarias y a la inversión, para que no haya sorpresas en la declaración.' },
          { t: 'Patrimonio familiar', d: 'Tierras, naves y viviendas: herencias y donaciones dentro de la familia, planificadas con tiempo.' },
        ],
      },
      {
        h2: 'Elegir bien el régimen fiscal de la explotación',
        parrafos: [
          'Un agricultor puede tributar por distintos regímenes, tanto en la renta como en el IVA, y cada uno tiene ventajas e inconvenientes según el tamaño de la explotación, las inversiones previstas y a quién vende. No siempre el más sencillo es el que más conviene.',
          'Revisamos su caso con sus números, le explicamos las opciones y le avisamos cuando un cambio en la explotación (una inversión fuerte, una venta a otro cliente, la entrada de un hijo) aconseja cambiar de régimen.',
        ],
      },
      {
        h2: 'Bodegas que crecen y exportan',
        parrafos: [
          'Cuando una bodega empieza a vender en otros países o a otras comunidades, aparecen nuevas obligaciones: facturación, IVA de las operaciones con el extranjero, declaraciones informativas. Las llevamos junto con la contabilidad para que las cifras cuadren y la bodega pueda centrarse en vender.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: [
          'Llámenos o venga al despacho de la calle Valencia. En una primera reunión revisamos su situación y sus últimas declaraciones, y le proponemos cómo trabajar. También podemos vernos por videollamada.',
        ],
      },
    ],
    faqs: [
      { q: '¿Las subvenciones agrarias tributan?', a: 'En general sí, aunque la forma de declararlas depende del tipo de ayuda y del régimen de la explotación. Las tenemos en cuenta al preparar su declaración.' },
      { q: '¿Llevan cooperativistas?', a: 'Sí: la fiscalidad del socio de la cooperativa, sus liquidaciones y su declaración de la renta.' },
      { q: 'Mi padre me va a pasar las tierras. ¿Qué impuestos hay?', a: 'Depende de si es donación o herencia, del valor de las tierras y de los requisitos que se cumplan. Conviene revisarlo antes de firmar nada.' },
      { q: '¿Pueden atenderme sin ir al despacho?', a: 'Sí. Muchas gestiones se resuelven por teléfono, correo o videollamada; al despacho viene cuando le venga bien.' },
    ],
    cta: 'Pedir cita con el área fiscal en Jumilla',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'fiscal',
    sede: 'lorca',
    title: 'Asesoría fiscal en Lorca para empresas y autónomos | Serveco',
    metaDescription:
      'Asesoría fiscal en Lorca y el Valle del Guadalentín: impuestos de empresas agroalimentarias, ganaderas, de construcción, comercios y autónomos. Despacho en la Antigua Plaza de Abastos.',
    h1: 'Asesoría fiscal en Lorca',
    lead: 'Desde nuestro despacho de la Antigua Plaza de Abastos llevamos la fiscalidad de empresas, autónomos y familias de Lorca y de todo el Valle del Guadalentín.',
    busquedaPrincipal: 'asesoría fiscal en Lorca',
    secciones: [
      {
        h2: 'Una comarca de empresas agroalimentarias, ganaderas y constructoras',
        parrafos: [
          'Lorca es la cabecera de una comarca muy activa: explotaciones agrícolas y ganaderas, industria agroalimentaria, construcción y promoción, comercio y servicios. Desde nuestro despacho atendemos también a clientes de Puerto Lumbreras, Águilas y Totana.',
          'Son empresas con inversiones grandes, operaciones con proveedores y clientes de fuera y, a menudo, un patrimonio familiar importante. La fiscalidad tiene que acompañar esas decisiones, no ir detrás de ellas.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Lorca',
        parrafos: [],
        lista: [
          { t: 'Impuesto de sociedades', d: 'Preparación y revisión previa al cierre, con los incentivos que correspondan.' },
          { t: 'IVA', d: 'Declaraciones periódicas, operaciones con el extranjero y las particularidades del IVA en la construcción y la subcontratación.' },
          { t: 'Autónomos y profesionales', d: 'Impuestos trimestrales, renta y paso a sociedad.' },
          { t: 'Inversiones', d: 'Cómo afectan fiscalmente la compra de maquinaria, naves o ganado, y cómo planificarlas.' },
          { t: 'Herencias y patrimonio', d: 'Herencias, donaciones y organización del patrimonio de la familia empresaria.' },
          { t: 'Requerimientos de Hacienda', d: 'Respuesta a comprobaciones e inspecciones.' },
        ],
      },
      {
        h2: 'Planificar antes de invertir',
        parrafos: [
          'Una nave nueva, una granja ampliada o maquinaria para la campaña: son decisiones con un impacto fiscal que conviene conocer antes. El momento de la compra, la forma de financiarla o si se hace a través de la sociedad o a título personal cambian lo que se paga.',
          'Revisamos con usted la operación antes de firmar y, si hay ayudas públicas para esa inversión, se lo decimos también: muchas exigen solicitarse antes de empezar.',
        ],
      },
      {
        h2: 'Construcción y promoción',
        parrafos: [
          'El sector de la construcción tiene reglas propias en el IVA, especialmente cuando hay subcontratación o se trabaja en la rehabilitación y promoción de viviendas. Un error en la factura puede suponer pagar un IVA que no correspondía o una sanción. Lo revisamos para que cada factura lleve el tratamiento correcto.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en el despacho de Lorca o por videollamada. Revisamos su situación y sus últimas declaraciones y le proponemos cómo trabajar.'],
      },
    ],
    faqs: [
      { q: '¿Atienden a empresas de Águilas o Totana desde Lorca?', a: 'Sí. Desde Lorca trabajamos con empresas y autónomos de todo el Valle del Guadalentín y de la costa de Águilas.' },
      { q: 'Me ha llegado una carta de Hacienda. ¿Qué hago?', a: 'No deje pasar el plazo. Tráiganosla o envíenosla cuanto antes: revisamos qué piden y preparamos la respuesta.' },
      { q: '¿Me conviene comprar la nave a nombre de la sociedad o a mi nombre?', a: 'Depende de sus planes, de cómo se financie y de la situación de la empresa. Tiene efectos fiscales distintos que calculamos antes de firmar.' },
      { q: '¿Llevan la fiscalidad de explotaciones ganaderas?', a: 'Sí, incluida la elección del régimen de tributación más adecuado para la explotación.' },
    ],
    cta: 'Pedir cita con el área fiscal en Lorca',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'fiscal',
    sede: 'balsicas',
    title: 'Asesoría fiscal en Torre-Pacheco y Balsicas | Serveco',
    metaDescription:
      'Asesoría fiscal en Balsicas (Torre-Pacheco) para empresas agrícolas, almacenes exportadores, hostelería del Mar Menor y autónomos. IVA de exportación, renta y no residentes.',
    h1: 'Asesoría fiscal en Torre-Pacheco y Balsicas',
    lead: 'Desde nuestro despacho de Balsicas llevamos la fiscalidad de empresas agrícolas, almacenes, negocios de la costa y autónomos del Campo de Cartagena y el Mar Menor.',
    busquedaPrincipal: 'asesoría fiscal en Torre-Pacheco',
    secciones: [
      {
        h2: 'Empresas agrícolas que venden a toda Europa',
        parrafos: [
          'El Campo de Cartagena produce hortalizas que llegan cada día a mercados de toda Europa. Explotaciones, almacenes de manipulado, transportistas y cooperativas mueven un volumen de operaciones con el extranjero que tiene consecuencias directas en el IVA y en la tesorería de la empresa.',
          'Nuestro despacho de Balsicas, pedanía de Torre-Pacheco, trabaja con ese tejido y con los negocios de hostelería y comercio de la costa del Mar Menor.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Balsicas',
        parrafos: [],
        lista: [
          { t: 'IVA de exportaciones y ventas a la UE', d: 'Facturación correcta, declaraciones informativas y seguimiento de las devoluciones de IVA.' },
          { t: 'Impuesto de sociedades', d: 'De almacenes, empresas agrícolas y de transporte, con revisión antes del cierre.' },
          { t: 'Agricultores', d: 'Elección del régimen de tributación de la explotación y declaración de la renta.' },
          { t: 'Hostelería y comercio', d: 'Impuestos trimestrales, renta y contabilidad fiscal de los negocios de la costa.' },
          { t: 'Residentes extranjeros', d: 'Declaración de la renta de quienes se han instalado en la zona e impuesto de no residentes de los propietarios que viven fuera.' },
        ],
      },
      {
        h2: 'Devoluciones de IVA: la tesorería del exportador',
        parrafos: [
          'Una empresa que vende sobre todo fuera de España suele soportar más IVA en sus compras del que repercute en sus ventas, y eso genera derecho a devolución. Cuánto tarda en cobrarse depende de cómo se gestione: hay procedimientos que permiten pedirla con más frecuencia si se cumplen los requisitos.',
          'Revisamos si su empresa puede acogerse a ellos y llevamos las declaraciones para que el dinero vuelva a su caja cuanto antes.',
        ],
      },
      {
        h2: 'Extranjeros en el Mar Menor',
        parrafos: [
          'La costa del Mar Menor tiene muchos residentes y propietarios extranjeros. Si vive aquí, le ayudamos con su declaración de la renta en España; si tiene una vivienda y vive fuera, con el impuesto de no residentes. Todo desde el mismo despacho, sin tener que desplazarse a otra oficina.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en el despacho de la avenida Ciudad de Murcia o por videollamada. Revisamos su situación y le proponemos cómo trabajar.'],
      },
    ],
    faqs: [
      { q: '¿Atienden a empresas de San Javier, Los Alcázares o Fuente Álamo?', a: 'Sí. Desde Balsicas trabajamos con todo el Campo de Cartagena y el Mar Menor.' },
      { q: '¿Cómo puedo cobrar antes las devoluciones de IVA?', a: 'Si su empresa cumple los requisitos, puede solicitar las devoluciones con más frecuencia. Lo revisamos y, si encaja, tramitamos la inscripción.' },
      { q: 'Tengo una casa en Los Alcázares y vivo en el Reino Unido. ¿Me llevan los impuestos?', a: 'Sí: el impuesto de no residentes por su vivienda, también en inglés.' },
      { q: '¿Llevan cooperativas?', a: 'Llevamos la fiscalidad de los socios cooperativistas; para la cooperativa, revisamos cada caso.' },
    ],
    cta: 'Pedir cita con el área fiscal en Balsicas',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'fiscal',
    sede: 'benidorm',
    title: 'Asesoría fiscal en Benidorm para empresas y particulares | Serveco',
    metaDescription:
      'Asesoría fiscal en Benidorm: impuestos de hoteles, restaurantes, comercios, autónomos, pisos turísticos y clientes extranjeros. Normativa valenciana y atención en inglés.',
    h1: 'Asesoría fiscal en Benidorm',
    lead: 'Desde nuestro despacho de Benidorm llevamos la fiscalidad de negocios turísticos, autónomos, propietarios de pisos turísticos y clientes extranjeros de la Marina Baixa.',
    busquedaPrincipal: 'asesoría fiscal en Benidorm',
    secciones: [
      {
        h2: 'Impuestos para una economía turística',
        parrafos: [
          'En Benidorm y la Marina Baixa la mayoría de los negocios viven del turismo: hoteles, apartamentos, restaurantes, bares, comercios y servicios. Tienen ingresos muy concentrados en la temporada, mucho movimiento de caja y, a menudo, propietarios o clientes extranjeros.',
          'Llevamos su fiscalidad con esa realidad en mente: previsión de los pagos de impuestos en los meses flojos, control del IVA y planificación antes del cierre.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Benidorm',
        parrafos: [],
        lista: [
          { t: 'Hostelería y comercio', d: 'Impuesto de sociedades, IVA y pagos a cuenta de hoteles, restaurantes y tiendas.' },
          { t: 'Autónomos', d: 'Impuestos trimestrales y declaración de la renta.' },
          { t: 'Pisos turísticos', d: 'Cómo tributan sus alquileres, tanto si reside en España como si vive fuera.' },
          { t: 'Residentes extranjeros', d: 'Declaración de la renta y cambio de residencia fiscal al instalarse en España.' },
          { t: 'No residentes', d: 'Impuesto de no residentes por tener, alquilar o vender una vivienda.' },
          { t: 'Herencias y donaciones', d: 'Con la normativa valenciana que corresponda, también para herederos que viven fuera.' },
        ],
      },
      {
        h2: 'Benidorm tributa con normativa valenciana',
        parrafos: [
          'Benidorm está en la Comunitat Valenciana, y eso importa: impuestos como el de sucesiones y donaciones o el de transmisiones patrimoniales tienen reglas autonómicas propias, distintas de las de la Región de Murcia. Una herencia o la compra de una vivienda aquí no se calcula igual que en Murcia.',
          'Trabajamos con las dos normativas a diario, así que le decimos qué aplica en su caso concreto, esté el bien donde esté.',
        ],
      },
      {
        h2: 'Pisos turísticos: cada caso tributa distinto',
        parrafos: [
          'Alquilar un apartamento a turistas no siempre tributa igual: depende de si usted reside en España o no, de los servicios que ofrece a los huéspedes y de si lo hace como particular o a través de una empresa. Según el caso, puede haber IVA o no, y los gastos que se pueden deducir cambian.',
          'Revisamos cómo lo tiene organizado y le decimos cómo declararlo correctamente.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Venga al despacho de la calle Jaén, llámenos o escríbanos. Atendemos en español y en inglés, en persona o por videollamada.'],
      },
    ],
    faqs: [
      { q: '¿Atienden en inglés?', a: 'Sí. En Benidorm atendemos en español y en inglés, en persona, por teléfono y por correo.' },
      { q: 'Heredo una vivienda en Benidorm y vivo en Murcia. ¿Qué normativa se aplica?', a: 'Depende de varios factores, entre ellos la residencia de quien fallece. Lo revisamos con los datos concretos antes de presentar nada.' },
      { q: '¿Tengo que cobrar IVA por mi piso turístico?', a: 'Depende de los servicios que preste a los huéspedes y de cómo lo gestione. Lo revisamos con usted.' },
      { q: 'Me instalo a vivir en Benidorm. ¿Cuándo empiezo a declarar la renta en España?', a: 'En general, cuando pasa a ser residente fiscal. Lo revisamos al llegar para que el cambio de residencia quede bien hecho en los dos países.' },
    ],
    cta: 'Pedir cita con el área fiscal en Benidorm',
    pendienteReparto: true,
    validado: false,
  },
];
