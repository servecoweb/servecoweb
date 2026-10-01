/**
 * LANDINGS LABORAL × 5 sedes (Yecla, Jumilla, Lorca, Balsicas, Benidorm). Ver src/data/landings.ts.
 * Texto propio por sede. Sin cifras que caducan ni consejo personalizado. Eskala, 25 sep 2026 · validado: false.
 */
import type { Landing } from './landings-tipos';

export const LANDINGS_LABORAL: Landing[] = [
  {
    area: 'laboral',
    sede: 'yecla',
    title: 'Asesoría laboral en Yecla: nóminas y contratos | Serveco',
    metaDescription:
      'Asesoría laboral en Yecla para la industria del mueble, talleres, bodegas y comercios: nóminas, contratos, convenios, ERTE, despidos e inspecciones. Dos despachos en Yecla.',
    h1: 'Asesoría laboral en Yecla',
    lead: 'Nóminas, contratos y relaciones con la plantilla de fábricas, talleres y comercios de Yecla, desde nuestros dos despachos en la ciudad.',
    busquedaPrincipal: 'asesoría laboral en Yecla',
    secciones: [
      {
        h2: 'Gestión laboral para la industria de Yecla',
        parrafos: [
          'Las empresas del mueble y del hábitat de Yecla suelen tener plantillas estables, con años de antigüedad, turnos de fábrica y un convenio colectivo del sector que marca salarios, jornada y vacaciones. A su lado, talleres, transportistas y comercios con equipos más pequeños pero con las mismas obligaciones.',
          'Llevamos la gestión laboral para que la empresa no tenga que pensar en ella salvo cuando hay que decidir algo, y le avisamos antes de que un cambio normativo o del convenio le afecte.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestros despachos de Yecla',
        parrafos: [],
        lista: [
          { t: 'Nóminas y seguros sociales', d: 'Cálculo mensual, cotizaciones, retenciones y certificados.' },
          { t: 'Contratos', d: 'La modalidad adecuada para cada puesto, altas, bajas y comunicaciones.' },
          { t: 'Convenio colectivo', d: 'Aplicación de las tablas salariales, la jornada y los permisos del convenio que corresponda.' },
          { t: 'Registro de jornada', d: 'Un sistema sencillo para cumplir la obligación de registrar las horas trabajadas.' },
          { t: 'ERTE y ajustes de plantilla', d: 'Cuando bajan los pedidos: expedientes temporales, reducciones de jornada y, si no hay más remedio, despidos bien tramitados.' },
          { t: 'Inspecciones de trabajo', d: 'Preparación de la documentación y acompañamiento.' },
        ],
      },
      {
        h2: 'Cuando bajan los pedidos',
        parrafos: [
          'La industria vive ciclos: temporadas con más pedidos de los que se pueden atender y otras en las que sobra capacidad. Antes de despedir, la ley ofrece herramientas como los expedientes temporales de regulación de empleo o las reducciones de jornada, que permiten ajustar costes sin perder a personas formadas que costaría mucho recuperar.',
          'Le explicamos las opciones, sus requisitos y sus plazos, y las tramitamos con la parte jurídica cuando hace falta.',
        ],
      },
      {
        h2: 'Jubilaciones y relevo en la plantilla',
        parrafos: [
          'Muchas fábricas de Yecla tienen trabajadores que se acercan a la jubilación y un oficio que no se aprende en dos días. Hay fórmulas que permiten una jubilación progresiva mientras se incorpora y forma a quien le va a sustituir. Revisamos si encajan en su empresa y cómo hacerlo bien.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Una primera reunión en cualquiera de los dos despachos de Yecla, o por videollamada. Revisamos su plantilla y sus contratos y le proponemos cómo llevar la gestión laboral.'],
      },
    ],
    faqs: [
      { q: '¿Qué convenio se aplica a mi fábrica de muebles?', a: 'El del sector y ámbito que corresponda a su actividad principal. Lo comprobamos al empezar, porque un convenio mal aplicado es de lo primero que se revisa en una inspección.' },
      { q: '¿Es obligatorio registrar la jornada?', a: 'Sí, para todos los trabajadores. Le ayudamos a montar un sistema sencillo que cumpla y que no complique el día a día del taller.' },
      { q: 'Tengo un pedido grande durante unos meses. ¿Qué contrato uso?', a: 'Depende de si la necesidad es puntual o se repite cada año. Lo revisamos antes de contratar para no elegir una modalidad que luego dé problemas.' },
      { q: '¿Me pueden llevar solo las nóminas?', a: 'Sí, aunque lo habitual es llevar toda la gestión laboral para poder avisarle a tiempo de lo que le afecta.' },
    ],
    cta: 'Pedir cita con el área laboral en Yecla',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'laboral',
    sede: 'jumilla',
    title: 'Asesoría laboral en Jumilla para bodegas y campo | Serveco',
    metaDescription:
      'Asesoría laboral en Jumilla: vendimia y campañas agrícolas, trabajadores agrarios, fijos discontinuos, nóminas de bodegas y comercios. Despacho en la calle Valencia.',
    h1: 'Asesoría laboral en Jumilla',
    lead: 'Contratos de campaña, nóminas de bodegas y explotaciones, y gestión de la plantilla de comercios y empresas de Jumilla, desde nuestro despacho de la calle Valencia.',
    busquedaPrincipal: 'asesoría laboral en Jumilla',
    secciones: [
      {
        h2: 'Campañas, vendimia y trabajo agrario',
        parrafos: [
          'En Jumilla el calendario laboral lo marca el campo: la vendimia, la recogida de la almendra y la oliva, y las tareas de la bodega a lo largo del año. Son meses con muchas altas en poco tiempo y trabajadores que vuelven campaña tras campaña.',
          'El trabajo agrario tiene además sus propias reglas de cotización a la Seguridad Social, y conviene aplicarlas bien desde el primer día para evitar diferencias que luego se reclaman.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Jumilla',
        parrafos: [],
        lista: [
          { t: 'Contratación de campaña', d: 'Altas, bajas y contratos de las campañas, con la modalidad que corresponda.' },
          { t: 'Trabajadores agrarios', d: 'Cotización en el régimen agrario de la Seguridad Social y sus particularidades.' },
          { t: 'Fijos discontinuos', d: 'Llamamientos, periodos de actividad e inactividad y su gestión año tras año.' },
          { t: 'Nóminas de bodegas y comercios', d: 'Nóminas mensuales, seguros sociales y convenio aplicable.' },
          { t: 'Trabajadores extranjeros', d: 'Documentación para contratar a personas de fuera de la Unión Europea.' },
        ],
      },
      {
        h2: 'Fijos discontinuos: la plantilla que vuelve cada campaña',
        parrafos: [
          'Tras la reforma laboral, las actividades de temporada que se repiten cada año se cubren normalmente con contratos fijos discontinuos. El trabajador es fijo de la empresa, pero solo trabaja en los periodos de actividad, y hay que llamarle en el orden y la forma previstos.',
          'Gestionarlo bien evita reclamaciones y le permite contar cada año con personas que ya conocen el trabajo. Nos ocupamos de los llamamientos, las altas y las bajas en cada periodo.',
        ],
      },
      {
        h2: 'Todo coordinado con su fiscalidad y sus ayudas',
        parrafos: [
          'Los costes laborales pesan mucho en una explotación o una bodega, y a veces hay ayudas a la contratación o a la formación que se pueden aprovechar. Como llevamos también la parte fiscal y financiera, lo vemos todo junto.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Llámenos o pase por el despacho de la calle Valencia antes de la próxima campaña. Revisamos su plantilla y sus contratos y organizamos la gestión.'],
      },
    ],
    faqs: [
      { q: '¿Cómo contrato a los trabajadores de la vendimia?', a: 'Depende de si la necesidad se repite cada año y de la relación con cada trabajador. Lo revisamos antes de la campaña para elegir bien la modalidad.' },
      { q: '¿Cotizan igual los trabajadores del campo que los de la bodega?', a: 'No necesariamente: las labores agrarias tienen un sistema de cotización propio. Lo aplicamos según el trabajo que haga cada persona.' },
      { q: '¿Puedo contratar a trabajadores de fuera de la UE para la campaña?', a: 'Sí, con la autorización correspondiente. Le explicamos los requisitos y los plazos, que conviene tener en cuenta con antelación.' },
      { q: '¿Llevan también a las empresas que no son del campo?', a: 'Sí: comercios, talleres y empresas de servicios de Jumilla y la comarca.' },
    ],
    cta: 'Pedir cita con el área laboral en Jumilla',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'laboral',
    sede: 'lorca',
    title: 'Asesoría laboral en Lorca: nóminas, contratos y despidos | Serveco',
    metaDescription:
      'Asesoría laboral en Lorca y el Valle del Guadalentín: nóminas, contratos de campaña, construcción y subcontratación, despidos e inspecciones de trabajo.',
    h1: 'Asesoría laboral en Lorca',
    lead: 'Nóminas, contratos, despidos e inspecciones para empresas agrícolas, ganaderas, de construcción y comercios de Lorca y del Valle del Guadalentín.',
    busquedaPrincipal: 'asesoría laboral en Lorca',
    secciones: [
      {
        h2: 'Plantillas que cambian con la campaña y con la obra',
        parrafos: [
          'En la comarca de Lorca conviven empresas muy distintas: explotaciones agrícolas y ganaderas con picos de trabajo, industria agroalimentaria, constructoras que trabajan con subcontratas y comercios con plantillas pequeñas. Cada una tiene su convenio, sus contratos y sus riesgos.',
          'Nuestro despacho de la Antigua Plaza de Abastos lleva la gestión laboral de todas ellas, con el respaldo del área jurídica cuando un conflicto acaba en reclamación.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Lorca',
        parrafos: [],
        lista: [
          { t: 'Nóminas y seguros sociales', d: 'Cálculo mensual, cotizaciones y certificados.' },
          { t: 'Contratos de campaña', d: 'Altas y bajas de las campañas agrícolas y la cotización del trabajo agrario.' },
          { t: 'Construcción', d: 'Convenio del sector y requisitos de la subcontratación en obra.' },
          { t: 'Despidos y sanciones', d: 'Cartas, liquidaciones y conciliaciones, con el área jurídica si hay juicio.' },
          { t: 'Inspecciones de trabajo', d: 'Preparación de la documentación y acompañamiento.' },
          { t: 'Trabajadores extranjeros', d: 'Autorizaciones y documentación para contratar fuera de la UE.' },
        ],
      },
      {
        h2: 'Subcontratación en obra: responsabilidad en cadena',
        parrafos: [
          'En la construcción, la empresa que subcontrata puede responder de ciertas obligaciones laborales y de Seguridad Social de sus subcontratistas, y la normativa exige requisitos específicos a las empresas que trabajan en obra. Un fallo en la cadena puede acabar en una sanción para quien no lo esperaba.',
          'Le ayudamos a pedir y revisar la documentación de sus subcontratas y a tener la suya en regla cuando es usted quien trabaja para otro.',
        ],
      },
      {
        h2: 'Despidos bien hechos',
        parrafos: [
          'Un despido mal tramitado suele acabar costando más que el propio despido. Antes de dar el paso revisamos la causa, la forma y la liquidación, y si el trabajador reclama, nuestros abogados le defienden en la conciliación y en el juzgado.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en el despacho de Lorca o por videollamada. Revisamos su plantilla y sus contratos y le proponemos cómo trabajar.'],
      },
    ],
    faqs: [
      { q: '¿Atienden a empresas de Totana, Águilas o Puerto Lumbreras?', a: 'Sí. Desde Lorca llevamos empresas de todo el Valle del Guadalentín y la costa de Águilas.' },
      { q: 'Me ha llegado una citación de la Inspección de Trabajo. ¿Qué hago?', a: 'Tráiganosla cuanto antes: revisamos qué documentación piden y le acompañamos en la comparecencia.' },
      { q: 'Un trabajador ha denunciado su despido. ¿Pueden defenderme?', a: 'Sí. El área jurídica lleva la conciliación y, si no hay acuerdo, el juicio, coordinada con quien lleva su gestión laboral.' },
      { q: '¿Qué documentos debo pedir a mis subcontratas?', a: 'Depende del tipo de obra y de la subcontrata. Le damos una lista concreta y la revisamos con usted.' },
    ],
    cta: 'Pedir cita con el área laboral en Lorca',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'laboral',
    sede: 'balsicas',
    title: 'Asesoría laboral en Torre-Pacheco y Balsicas | Serveco',
    metaDescription:
      'Asesoría laboral en Balsicas (Torre-Pacheco): almacenes de manipulado, campañas agrícolas, trabajadores extranjeros y hostelería del Mar Menor. Nóminas, contratos e inspecciones.',
    h1: 'Asesoría laboral en Torre-Pacheco y Balsicas',
    lead: 'Campañas, almacenes, trabajadores extranjeros y negocios de temporada del Campo de Cartagena y el Mar Menor, desde nuestro despacho de Balsicas.',
    busquedaPrincipal: 'asesoría laboral en Torre-Pacheco',
    secciones: [
      {
        h2: 'Almacenes y campo: miles de altas cada campaña',
        parrafos: [
          'Los almacenes de manipulado y las explotaciones del Campo de Cartagena contratan mucho y muy rápido cuando llega la campaña, con plantillas de muchas nacionalidades y turnos que cambian según los pedidos. Cada alta, cada llamamiento y cada baja tiene que estar bien hecho, porque el volumen multiplica cualquier error.',
          'Desde nuestro despacho de Balsicas, pedanía de Torre-Pacheco, llevamos esa gestión y la de los negocios de hostelería y comercio de la costa del Mar Menor.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Balsicas',
        parrafos: [],
        lista: [
          { t: 'Campañas y fijos discontinuos', d: 'Llamamientos, altas y bajas de cada periodo de actividad.' },
          { t: 'Convenio del manipulado y del campo', d: 'Aplicación de las tablas y condiciones del convenio que corresponda a cada actividad.' },
          { t: 'Trabajadores extranjeros', d: 'Autorizaciones para contratar a personas de fuera de la UE y su renovación.' },
          { t: 'Nóminas y seguros sociales', d: 'Cálculo mensual y cotizaciones, también del trabajo agrario.' },
          { t: 'Hostelería de temporada', d: 'Contratos y nóminas de bares, restaurantes y comercios del Mar Menor.' },
          { t: 'Inspecciones de trabajo', d: 'Preparación y acompañamiento.' },
        ],
      },
      {
        h2: 'Contratar a trabajadores de fuera de la Unión Europea',
        parrafos: [
          'Buena parte de las plantillas de la zona son de otros países. Contratar a una persona de fuera de la Unión Europea exige que tenga la autorización adecuada para trabajar, y hay distintas vías según su situación. Contratar sin ella expone a la empresa a sanciones importantes.',
          'Revisamos la documentación de cada trabajador antes del alta y, cuando hace falta, tramitamos las autorizaciones junto con el área jurídica.',
        ],
      },
      {
        h2: 'Inspecciones en campaña',
        parrafos: [
          'Las campañas agrícolas son un momento habitual de inspecciones. Tener los contratos, el registro de jornada y las altas al día es la mejor defensa. Le ayudamos a revisarlo antes de que llegue la inspección, no después.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en el despacho de la avenida Ciudad de Murcia o por videollamada, idealmente antes de la próxima campaña.'],
      },
    ],
    faqs: [
      { q: '¿Qué necesito para contratar a un trabajador marroquí o latinoamericano?', a: 'Que tenga una autorización que le permita trabajar en España. Revisamos su documentación antes del alta y le decimos qué vía corresponde si no la tiene.' },
      { q: '¿Cómo gestiono a los fijos discontinuos entre campañas?', a: 'Hay que llamarles en el orden y la forma previstos y darles de alta y baja en cada periodo. Nos ocupamos de todo el proceso.' },
      { q: '¿Llevan bares y restaurantes de Los Alcázares o San Javier?', a: 'Sí: contratos de temporada, nóminas y seguros sociales de negocios de toda la costa del Mar Menor.' },
      { q: 'Tengo muchos trabajadores. ¿Pueden asumir el volumen?', a: 'Sí. Trabajamos con empresas de campaña con plantillas grandes; organizamos con usted cómo nos pasa las altas y bajas.' },
    ],
    cta: 'Pedir cita con el área laboral en Balsicas',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'laboral',
    sede: 'benidorm',
    title: 'Asesoría laboral en Benidorm para hostelería y comercio | Serveco',
    metaDescription:
      'Asesoría laboral en Benidorm: nóminas, contratos de temporada, fijos discontinuos, trabajadores extranjeros e inspecciones para hoteles, restaurantes y comercios. También en inglés.',
    h1: 'Asesoría laboral en Benidorm',
    lead: 'Nóminas, contratos de temporada y trabajadores de muchos países para hoteles, restaurantes y comercios de Benidorm y la Marina Baixa. También en inglés.',
    busquedaPrincipal: 'asesoría laboral en Benidorm',
    secciones: [
      {
        h2: 'Plantillas de hostelería que cambian con la temporada',
        parrafos: [
          'En Benidorm la temporada es larga, pero no uniforme: hay meses de ocupación máxima y otros más tranquilos, y las plantillas crecen y se reducen con ellos. Hoteles, apartamentos, restaurantes y comercios necesitan contratar rápido, cumplir el convenio de hostelería y gestionar turnos, horas y descansos.',
          'Llevamos esa gestión desde nuestro despacho de Benidorm, en español y en inglés, porque muchos empresarios y trabajadores de la zona son extranjeros.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Benidorm',
        parrafos: [],
        lista: [
          { t: 'Nóminas y seguros sociales', d: 'Cálculo mensual, horas, pluses y cotizaciones.' },
          { t: 'Contratos de temporada y fijos discontinuos', d: 'La modalidad adecuada y la gestión de los llamamientos cada temporada.' },
          { t: 'Convenio de hostelería', d: 'Tablas salariales, categorías, jornada y descansos del convenio que corresponda.' },
          { t: 'Registro de jornada y horas', d: 'Control de horas y turnos, uno de los puntos más revisados en hostelería.' },
          { t: 'Trabajadores extranjeros', d: 'Documentación para contratar a personas de fuera de la UE, incluidos británicos tras el Brexit.' },
          { t: 'Inspecciones de trabajo', d: 'Preparación y acompañamiento, especialmente en temporada alta.' },
        ],
      },
      {
        h2: 'Trabajadores de muchos países',
        parrafos: [
          'Las plantillas de Benidorm reúnen personas de toda Europa y de fuera de ella. Un ciudadano de la Unión Europea puede trabajar sin autorización, pero un británico, desde el Brexit, o una persona de fuera de la UE necesita una autorización para trabajar en España. Comprobarlo antes del alta evita sanciones y problemas al trabajador.',
        ],
      },
      {
        h2: 'La temporada alta, también para la Inspección',
        parrafos: [
          'Los meses de más trabajo son también los de más inspecciones en hostelería: jornada real frente a la contratada, horas extra, descansos y altas. Revisamos con usted contratos, registros y nóminas antes del verano para que todo cuadre.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Venga al despacho de la calle Jaén, llámenos o escríbanos. Revisamos su plantilla y sus contratos y le proponemos cómo llevar la gestión laboral.'],
      },
    ],
    faqs: [
      { q: '¿Puedo contratar a un camarero británico?', a: 'Sí, si tiene una autorización que le permita trabajar en España. Desde el Brexit, los británicos que no residían aquí antes necesitan una. Revisamos su caso antes del alta.' },
      { q: '¿Qué contrato uso para la temporada de verano?', a: 'Si la necesidad se repite cada año, normalmente un fijo discontinuo. Lo revisamos con usted según su negocio.' },
      { q: '¿Cómo registro la jornada con turnos partidos?', a: 'Con un sistema que recoja cada entrada y salida. Le ayudamos a elegir uno sencillo para su equipo.' },
      { q: '¿Me pueden atender en inglés?', a: 'Sí. En el despacho de Benidorm atendemos en español y en inglés.' },
    ],
    cta: 'Pedir cita con el área laboral en Benidorm',
    pendienteReparto: true,
    validado: false,
  },
];
