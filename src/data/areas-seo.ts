/**
 * CONTENIDO SEO DE LAS 8 PÁGINAS DE ÁREA (money pages). Plantilla: W - SERVECO/PLAN-SEO-PAGINAS.md § 3.1.
 * Redacción de Eskala (24 sep 2026). **validado: false** hasta que cada área lo revise en Serveco:
 * mientras sea false, la página muestra un aviso (solo se ve en local: la web lleva noindex hasta producción).
 * Reglas: sin cifras legales sin vigencia, sin promesas, sin honorarios (PLAN-SEO-PAGINAS.md § 4).
 * Mañana: columna `seo` (jsonb) de `service_areas` en Supabase.
 */
export type SeccionSeo = {
  h2: string;
  parrafos: string[];
  /** Lista con título y explicación (servicios, pasos, casos). */
  lista?: { t: string; d: string }[];
};

export type AreaSeo = {
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  busquedaPrincipal: string;
  secciones: SeccionSeo[];
  faqs: { q: string; a: string }[];
  relacionadas: string[]; // slugs de otras áreas
  validado: boolean;
};

const DESPACHOS = 'Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm';

export const AREAS_SEO: Record<string, AreaSeo> = {
  // ───────────────────────────────────────────────────────────── FISCAL
  fiscal: {
    title: 'Asesoría fiscal en Murcia para empresas y autónomos',
    metaDescription:
      'Asesoría fiscal en Murcia desde 1977: impuesto de sociedades, IVA, IRPF, planificación fiscal y empresa familiar. Seis despachos en la Región y Benidorm.',
    h1: 'Asesoría fiscal en Murcia para empresas y autónomos',
    lead:
      'Llevamos la fiscalidad de pymes, empresas familiares, autónomos y particulares, y la coordinamos con su contabilidad y su área laboral para que el cierre del año no traiga sorpresas.',
    busquedaPrincipal: 'asesoría fiscal en Murcia',
    secciones: [
      {
        h2: 'Una asesoría fiscal que se anticipa, no solo que presenta',
        parrafos: [
          'Una asesoría fiscal se ocupa de que su empresa cumpla con Hacienda y, sobre todo, de que pague lo que le corresponde y no más. Eso significa presentar bien y a tiempo cada declaración, pero también anticiparse: revisar antes del cierre qué decisiones tienen efecto fiscal y cuáles conviene tomar este año o el siguiente.',
          'En Serveco la fiscalidad no va sola. El mismo equipo ve su contabilidad, sus nóminas y sus contratos, y eso evita el problema más habitual de las empresas que reparten la gestión entre varios proveedores: que nadie tenga la foto completa hasta que llega un requerimiento.',
        ],
      },
      {
        h2: 'Servicios de asesoría fiscal para empresas y autónomos',
        parrafos: ['Trabajamos todos los impuestos que afectan a una empresa o a un autónomo a lo largo del año:'],
        lista: [
          { t: 'Impuesto de sociedades', d: 'Cálculo, ajustes y presentación, con revisión previa del resultado para aplicar los incentivos que correspondan.' },
          { t: 'IVA y retenciones', d: 'Declaraciones trimestrales y resúmenes anuales, operaciones intracomunitarias y regímenes especiales.' },
          { t: 'IRPF de autónomos y particulares', d: 'Pagos fraccionados, declaración de la renta y elección del método de estimación más adecuado.' },
          { t: 'Planificación fiscal', d: 'Revisión antes del cierre, reparto de beneficios, retribución de socios y administradores, inversiones.' },
          { t: 'Operaciones societarias', d: 'Constitución, ampliaciones de capital, fusiones, escisiones y transformación de autónomo a sociedad.' },
          { t: 'Empresa familiar, herencias y donaciones', d: 'Relevo generacional y transmisión de la empresa con el menor coste fiscal que permita la ley.' },
          { t: 'No residentes', d: 'Impuesto sobre la renta de no residentes para propietarios extranjeros, en español o en inglés.' },
          { t: 'Inspecciones y requerimientos', d: 'Contestación de requerimientos, comprobaciones e inspecciones de Hacienda, y recursos cuando proceden.' },
        ],
      },
      {
        h2: 'Cuándo conviene revisar la fiscalidad de su empresa',
        parrafos: [
          'Hay momentos en los que una revisión fiscal suele ahorrar dinero o disgustos: cuando un autónomo empieza a ganar lo suficiente como para plantearse crear una sociedad; antes de una inversión importante o de comprar un inmueble; cuando entra un nuevo socio o un hijo en la empresa familiar; al vender la empresa o parte de ella; y, cada año, unas semanas antes del cierre del ejercicio.',
          'También conviene hacerlo si ha recibido un requerimiento de Hacienda o si su gestoría actual se limita a presentar lo que usted le lleva, sin proponerle nada.',
        ],
      },
      {
        h2: 'Nuestro método de trabajo',
        parrafos: ['Nuestro método es sencillo y se repite con cada cliente:'],
        lista: [
          { t: 'Primera reunión', d: 'En el despacho que le quede más cerca o por videollamada. Nos cuenta su actividad y cómo se ha gestionado hasta ahora.' },
          { t: 'Revisión de partida', d: 'Analizamos sus últimas declaraciones y detectamos riesgos y oportunidades.' },
          { t: 'Propuesta', d: 'Le proponemos una iguala para la gestión del año o un trabajo concreto, con el alcance por escrito.' },
          { t: 'Seguimiento', d: 'Un interlocutor fijo, calendario fiscal compartido y una revisión antes de cada cierre.' },
        ],
      },
      {
        h2: 'Por qué elegir Serveco como asesor fiscal en Murcia',
        parrafos: [
          'Llevamos desde 1977 asesorando a empresas de la Región de Murcia. Somos más de treinta profesionales, entre economistas, abogados, ingenieros y técnicos, y trabajamos coordinados sobre el mismo expediente: si una decisión fiscal afecta a sus nóminas o a sus contratos, lo vemos a la vez.',
          `Tenemos despachos en ${DESPACHOS}, así que puede tratar con nosotros en persona sin desplazarse a la capital. Y contamos con herramientas propias de análisis financiero (los sistemas A.D.) que nos permiten planificar con los números reales de su empresa, mes a mes.`,
        ],
      },
    ],
    faqs: [
      { q: '¿Qué diferencia hay entre una gestoría y una asesoría fiscal?', a: 'Una gestoría se centra en tramitar y presentar declaraciones. Una asesoría fiscal, además, analiza su situación, le propone cómo organizarse para pagar lo justo y le defiende ante Hacienda si hay una comprobación o una inspección.' },
      { q: '¿Cuándo compensa pasar de autónomo a sociedad limitada?', a: 'Depende de su beneficio, de si va a reinvertir en el negocio y de su situación personal. En general, a partir de cierto nivel de beneficio la sociedad empieza a ser interesante, pero hay que hacer los números con su caso concreto antes de decidir.' },
      { q: '¿Pueden llevar la fiscalidad si ya tengo otra gestoría para la contabilidad?', a: 'Sí, aunque le recomendamos que la fiscalidad y la contabilidad las lleve el mismo equipo: los impuestos salen de la contabilidad y, si están separados, los errores de una parte se trasladan a la otra.' },
      { q: '¿Qué hago si recibo un requerimiento de Hacienda?', a: 'No lo deje pasar: los requerimientos tienen plazo. Tráiganoslo cuanto antes; revisamos qué pide, preparamos la documentación y contestamos en su nombre.' },
      { q: '¿Atienden a particulares o solo a empresas?', a: 'Atendemos a ambos: declaraciones de la renta, herencias, donaciones, compraventas de inmuebles y fiscalidad de no residentes, además de la de empresas y autónomos.' },
      { q: '¿Tengo que ir al despacho de Murcia?', a: `No. Puede elegir cualquiera de nuestros despachos (${DESPACHOS}) o trabajar con nosotros a distancia; su expediente es el mismo en todos.` },
    ],
    relacionadas: ['contable', 'laboral', 'financiero', 'idi-patent-box'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── LABORAL
  laboral: {
    title: 'Asesoría laboral en Murcia: nóminas, contratos y despidos',
    metaDescription:
      'Asesoría laboral en Murcia para empresas: nóminas, seguros sociales, contratos, despidos e inspecciones de trabajo. Serveco, desde 1977, con seis despachos.',
    h1: 'Asesoría laboral en Murcia para empresas',
    lead:
      'Gestionamos el día a día laboral de su plantilla (nóminas, altas, contratos) y le acompañamos en los momentos delicados: un despido, una inspección de trabajo o un cambio en la organización.',
    busquedaPrincipal: 'asesoría laboral en Murcia',
    secciones: [
      {
        h2: 'Una asesoría laboral que va más allá de las nóminas',
        parrafos: [
          'Una asesoría laboral se encarga de todo lo que tiene que ver con las personas que trabajan en su empresa: que cobren bien y a tiempo, que estén dadas de alta con el contrato adecuado, que se cotice lo que corresponde y que la empresa cumpla con obligaciones como el registro de jornada o los calendarios laborales.',
          'Pero su valor real está en lo que evita: un contrato mal elegido, un despido mal planteado o una inspección sin preparar pueden costar mucho más que la gestión de todo un año.',
        ],
      },
      {
        h2: 'Servicios de asesoría laboral para empresas',
        parrafos: ['Nos ocupamos de toda la gestión laboral de su empresa:'],
        lista: [
          { t: 'Nóminas y seguros sociales', d: 'Cálculo mensual de nóminas, liquidación de cotizaciones y retenciones.' },
          { t: 'Contratación', d: 'Elección del tipo de contrato, altas, bajas y variaciones, y comunicación de contratos.' },
          { t: 'Convenios colectivos', d: 'Aplicación del convenio de su sector: tablas salariales, pluses, jornada y vacaciones.' },
          { t: 'Despidos y extinciones', d: 'Cartas de despido, finiquitos, cálculo de indemnizaciones y conciliaciones.' },
          { t: 'Inspecciones de trabajo', d: 'Preparación de la documentación y asistencia a la empresa durante la inspección.' },
          { t: 'Organización del trabajo', d: 'Registro de jornada, calendarios, turnos, teletrabajo y modificaciones de condiciones.' },
          { t: 'Trabajadores extranjeros', d: 'Contratación de personas de fuera de la Unión Europea y sus autorizaciones.' },
        ],
      },
      {
        h2: 'Cuándo necesita apoyo laboral especializado',
        parrafos: [
          'Cuando va a contratar a su primer trabajador; cuando la plantilla crece y el convenio empieza a pesar; en temporadas con muchas altas y bajas, como la agricultura, la hostelería o el comercio; cuando tiene que despedir o reorganizar la empresa; y, por supuesto, cuando llega una citación de la Inspección de Trabajo.',
          'También es buen momento si su empresa ha cambiado de actividad o de convenio, o si nunca ha revisado si los contratos que usa son los que le convienen.',
        ],
      },
      {
        h2: 'Así llevamos la gestión laboral de su empresa',
        parrafos: ['Nuestro objetivo es que usted no tenga que pensar en la gestión laboral salvo cuando hay que decidir algo:'],
        lista: [
          { t: 'Toma de datos', d: 'Revisamos su plantilla, contratos y convenio aplicable.' },
          { t: 'Calendario mensual', d: 'Recibimos las incidencias del mes y le devolvemos nóminas y seguros sociales en plazo.' },
          { t: 'Consulta directa', d: 'Antes de contratar, sancionar o despedir, nos consulta y le decimos cómo hacerlo bien.' },
          { t: 'Coordinación', d: 'Las nóminas se trasladan a su contabilidad y a su fiscalidad sin que tenga que hacer nada.' },
        ],
      },
      {
        h2: 'Por qué elegir Serveco como asesoría laboral en Murcia',
        parrafos: [
          'En la misma firma están los abogados que le defienden si un despido acaba en el juzgado, los economistas que ven el coste real de su plantilla y el área de formación que puede usar el crédito de formación de su empresa. No tendrá que explicar su caso tres veces.',
          `Llevamos desde 1977 trabajando con empresas de sectores muy distintos de la Región, y tenemos despachos en ${DESPACHOS}.`,
        ],
      },
    ],
    faqs: [
      { q: '¿Qué contrato me conviene para un trabajador de temporada?', a: 'Depende de si la necesidad se repite cada año o es puntual. Para actividades que se repiten por temporadas suele encajar el contrato fijo discontinuo; para necesidades puntuales, otras modalidades. Lo revisamos con su caso antes de contratar.' },
      { q: '¿Qué pasa si no llevo el registro de jornada?', a: 'El registro de jornada es obligatorio y es de lo primero que se revisa en una inspección. Le ayudamos a implantar un sistema sencillo que cumpla y que sea fácil de llevar en su empresa.' },
      { q: '¿Cómo se calcula la indemnización por despido?', a: 'Depende del tipo de despido, de la antigüedad y del salario del trabajador, y de si el despido se reconoce o se declara improcedente. Antes de despedir, conviene calcularlo y preparar bien la carta.' },
      { q: '¿Qué hago si recibo una citación de la Inspección de Trabajo?', a: 'Avísenos en cuanto la reciba. Revisamos qué documentación pide, la preparamos con usted y le acompañamos durante el proceso.' },
      { q: '¿Pueden llevar las nóminas si tengo muy pocos trabajadores?', a: 'Sí. Trabajamos con empresas de todos los tamaños, desde autónomos con su primer empleado hasta plantillas grandes.' },
      { q: '¿Gestionan la contratación de trabajadores extranjeros?', a: 'Sí, incluidas las personas de fuera de la Unión Europea, coordinándolo con nuestra área jurídica cuando hace falta tramitar autorizaciones.' },
    ],
    relacionadas: ['juridico', 'formacion', 'fiscal', 'contable'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── JURÍDICO
  juridico: {
    title: 'Asesoría jurídica para empresas en Murcia | Mercantil',
    metaDescription:
      'Asesoría jurídica para empresas en Murcia: derecho mercantil y societario, contratos, reclamación de deudas y procedimientos judiciales. Serveco, desde 1977.',
    h1: 'Asesoría jurídica para empresas en Murcia',
    lead:
      'Abogados para el día a día de su empresa: contratos, sociedades, reclamaciones y, cuando hace falta, defensa en los tribunales. Con la ventaja de trabajar junto a su asesoría fiscal y laboral.',
    busquedaPrincipal: 'asesoría jurídica para empresas en Murcia',
    secciones: [
      {
        h2: 'Asesoría jurídica para prevenir, no solo para litigar',
        parrafos: [
          'La mayoría de los problemas legales de una empresa se pueden evitar con un buen contrato o una buena decisión a tiempo: unos estatutos que prevean qué pasa si un socio quiere salir, un contrato con proveedores que aclare quién responde de qué, o una reclamación bien planteada antes de que la deuda sea incobrable.',
          'Nuestra área jurídica trabaja precisamente ahí, en la prevención, sin dejar de lado la defensa cuando el conflicto ya existe.',
        ],
      },
      {
        h2: 'Servicios jurídicos para empresas y empresarios',
        parrafos: ['Cubrimos las necesidades jurídicas más habituales de empresas y empresarios:'],
        lista: [
          { t: 'Mercantil y societario', d: 'Constitución de sociedades, estatutos, juntas, cambios de administradores, pactos entre socios.' },
          { t: 'Contratos', d: 'Redacción y revisión de contratos con clientes, proveedores, distribuidores y socios.' },
          { t: 'Reclamación de deudas', d: 'Reclamaciones extrajudiciales y, si no prosperan, procedimientos judiciales para cobrar.' },
          { t: 'Empresa familiar', d: 'Protocolo familiar, pactos de socios y organización del relevo generacional.' },
          { t: 'Procedimientos judiciales', d: 'Defensa de la empresa en procedimientos civiles y mercantiles.' },
          { t: 'Civil', d: 'Herencias, compraventas, arrendamientos y otros asuntos de empresarios y particulares.' },
        ],
      },
      {
        h2: 'Cuándo conviene consultar con un abogado',
        parrafos: [
          'Antes de firmar un contrato importante; al crear una sociedad con otros socios; cuando un cliente deja de pagar; si un socio quiere salir de la empresa o hay desacuerdos en la junta; y cuando llega una demanda o una reclamación. Cuanto antes se consulta, más opciones hay y más barata suele ser la solución.',
        ],
      },
      {
        h2: 'Nuestra forma de trabajar',
        parrafos: [],
        lista: [
          { t: 'Análisis del caso', d: 'Revisamos la documentación y le explicamos, con claridad, sus opciones y riesgos.' },
          { t: 'Propuesta', d: 'Le indicamos cómo actuar y el alcance del trabajo antes de empezar.' },
          { t: 'Negociación primero', d: 'Siempre que es posible buscamos un acuerdo antes de ir a los tribunales.' },
          { t: 'Defensa', d: 'Si el conflicto no se resuelve, le representamos en el procedimiento.' },
        ],
      },
      {
        h2: 'Abogados que trabajan con su asesor fiscal y laboral',
        parrafos: [
          'Casi ningún problema legal de empresa es solo legal. La salida de un socio tiene efectos fiscales; un despido tiene una parte laboral y otra judicial; una reclamación de deuda afecta a su contabilidad. En Serveco los abogados trabajan con los economistas y los laboralistas sobre el mismo expediente.',
          `Desde 1977, con despachos en ${DESPACHOS}.`,
        ],
      },
    ],
    faqs: [
      { q: '¿Qué debe incluir un pacto de socios?', a: 'Normalmente regula cómo se toman las decisiones importantes, qué pasa si un socio quiere vender o salir, cómo se valoran sus participaciones y cómo se resuelven los bloqueos. Cada empresa necesita el suyo; no conviene usar un modelo genérico.' },
      { q: '¿Cómo reclamo una factura que un cliente no me paga?', a: 'Lo habitual es empezar con un requerimiento formal de pago. Si no funciona, hay procedimientos judiciales pensados para reclamar deudas. Revisamos su documentación y le decimos cuál encaja mejor.' },
      { q: '¿Me pueden revisar un contrato antes de firmarlo?', a: 'Sí, y es de lo más rentable que puede hacer: revisar un contrato antes de firmar cuesta mucho menos que resolver un conflicto después.' },
      { q: '¿Llevan también asuntos de particulares?', a: 'Sí: herencias, compraventas, arrendamientos y otros asuntos civiles, especialmente de empresarios y familias que ya trabajan con nosotros.' },
      { q: '¿Qué es un protocolo familiar?', a: 'Es un acuerdo entre los miembros de una familia empresaria que regula cómo se relacionan familia, propiedad y empresa: quién puede trabajar en ella, cómo se hace el relevo o qué pasa con las participaciones.' },
    ],
    relacionadas: ['fiscal', 'laboral', 'contable', 'financiero'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── CONTABLE
  contable: {
    title: 'Asesoría contable en Murcia: contabilidad y cuentas anuales',
    metaDescription:
      'Asesoría contable en Murcia: contabilidad al día, cuentas anuales, libros oficiales y cierre del ejercicio para pymes y autónomos. Serveco, desde 1977.',
    h1: 'Asesoría contable en Murcia para pymes y autónomos',
    lead:
      'Llevamos su contabilidad al día para que sepa cómo va su empresa durante el año, no solo al cierre. Y preparamos y depositamos sus cuentas anuales en plazo.',
    busquedaPrincipal: 'asesoría contable en Murcia',
    secciones: [
      {
        h2: 'Una contabilidad al día para decidir, no solo para cumplir',
        parrafos: [
          'La contabilidad es una obligación, pero también la mejor herramienta para dirigir una empresa. Si está al día, sabe en cada momento si gana o pierde dinero, qué clientes le deben y cuánta caja tendrá dentro de tres meses. Si se hace solo para cumplir, a final de año, esa información llega tarde.',
          'Además, de la contabilidad salen los impuestos: una contabilidad descuidada acaba en declaraciones mal hechas.',
        ],
      },
      {
        h2: 'Servicios de contabilidad para pymes y autónomos',
        parrafos: ['Nos encargamos de toda la contabilidad de su empresa:'],
        lista: [
          { t: 'Contabilidad periódica', d: 'Registro de facturas, bancos y demás operaciones con la periodicidad que necesite.' },
          { t: 'Informes de situación', d: 'Balance y cuenta de resultados durante el año para que pueda tomar decisiones.' },
          { t: 'Cierre del ejercicio', d: 'Ajustes, amortizaciones y revisión final antes de calcular el impuesto de sociedades.' },
          { t: 'Cuentas anuales', d: 'Preparación y depósito en el Registro Mercantil.' },
          { t: 'Libros oficiales', d: 'Legalización de los libros obligatorios de la empresa.' },
          { t: 'Contabilidad de autónomos', d: 'Libros registro de ingresos, gastos y bienes de inversión.' },
        ],
      },
      {
        h2: 'Señales de que su contabilidad necesita otro enfoque',
        parrafos: [
          'Si solo ve su contabilidad cuando le llaman para firmar las cuentas anuales; si no sabe cuánto ha ganado este año hasta que se presenta el impuesto de sociedades; si le han llegado sanciones por presentar las cuentas tarde; o si su empresa ha crecido y necesita información para decidir, no solo para cumplir.',
        ],
      },
      {
        h2: 'Cómo llevamos su contabilidad',
        parrafos: [],
        lista: [
          { t: 'Envío de documentación', d: 'Nos hace llegar sus facturas y extractos de la forma que le resulte más cómoda.' },
          { t: 'Registro y conciliación', d: 'Contabilizamos y cuadramos bancos, clientes y proveedores.' },
          { t: 'Información periódica', d: 'Le enviamos la situación de su empresa y se la explicamos.' },
          { t: 'Cierre coordinado', d: 'El cierre contable y el fiscal los hace el mismo equipo.' },
        ],
      },
      {
        h2: 'Información para dirigir la empresa, no solo para cumplir',
        parrafos: [
          'Nuestros sistemas propios de análisis (A.D.I, A.D.P y A.D.A) convierten su contabilidad en información para decidir: evolución mes a mes, presupuestos y análisis de costes. Es la diferencia entre saber qué pasó el año pasado y saber qué está pasando ahora.',
          `Desde 1977, con despachos en ${DESPACHOS}.`,
        ],
      },
    ],
    faqs: [
      { q: '¿Estoy obligado a depositar las cuentas anuales?', a: 'Las sociedades mercantiles tienen que aprobar sus cuentas anuales y depositarlas en el Registro Mercantil dentro de los plazos que marca la ley. Nosotros las preparamos y nos ocupamos del depósito.' },
      { q: '¿Qué pasa si presento las cuentas anuales tarde?', a: 'No depositarlas en plazo puede impedir inscribir otros actos en el Registro Mercantil y dar lugar a sanciones. Si está en esa situación, le ayudamos a regularizarla.' },
      { q: '¿Un autónomo tiene que llevar contabilidad?', a: 'Depende de su actividad y de su régimen de tributación. En muchos casos basta con los libros registro de ingresos y gastos. Le decimos qué le corresponde en su caso.' },
      { q: '¿Cada cuánto tiempo tengo que enviar la documentación?', a: 'Lo acordamos con usted: mensual o trimestralmente, según el volumen de su empresa y la información que quiera recibir.' },
      { q: '¿Pueden llevar la contabilidad de una empresa que viene de otra gestoría?', a: 'Sí. Revisamos la contabilidad que recibimos, detectamos si hay algo que corregir y continuamos desde ahí.' },
    ],
    relacionadas: ['fiscal', 'financiero', 'auditoria', 'laboral'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── FINANCIERO
  financiero: {
    title: 'Asesoramiento financiero para empresas | Serveco Murcia',
    metaDescription:
      'Asesoramiento financiero para pymes en Murcia: financiación, planes de viabilidad, presupuestos y cuadros de mando con los sistemas A.D. de Serveco.',
    h1: 'Asesoramiento financiero para empresas en Murcia',
    lead:
      'Analizamos la salud financiera de su empresa con nuestros propios sistemas A.D. y le ayudamos a conseguir financiación, preparar presupuestos y decidir inversiones con números reales.',
    busquedaPrincipal: 'asesoramiento financiero para empresas',
    secciones: [
      {
        h2: 'Asesoramiento financiero pensado para pymes',
        parrafos: [
          'El asesoramiento financiero le ayuda a responder preguntas que la contabilidad sola no responde: ¿puedo permitirme esta inversión?, ¿qué clientes o productos me hacen ganar dinero?, ¿cuánta caja necesitaré el año que viene?, ¿con qué financiación me conviene crecer?',
          'Para eso usamos la información de su contabilidad, pero la trabajamos de otra manera: mes a mes, por centros de coste y proyectando el futuro.',
        ],
      },
      {
        h2: 'Los sistemas A.D.: análisis financiero propio de Serveco',
        parrafos: ['Son tres herramientas de análisis desarrolladas por Serveco para sus clientes:'],
        lista: [
          { t: 'A.D.I · Análisis Dinámico Intermensual', d: 'Diagnóstico de la situación de la empresa mes a mes, para detectar desviaciones a tiempo.' },
          { t: 'A.D.P · Análisis Dinámico Presupuestario', d: 'Proyecciones a uno o varios años para decidir inversiones y financiación.' },
          { t: 'A.D.A · Análisis Dinámico Analítico', d: 'Costes, precios de venta, existencias y márgenes por producto o actividad.' },
        ],
      },
      {
        h2: 'Financiación, viabilidad y presupuestos',
        parrafos: [],
        lista: [
          { t: 'Financiación bancaria', d: 'Preparación de la información que piden las entidades y apoyo en la negociación.' },
          { t: 'Planes de viabilidad', d: 'Para nuevos proyectos, ampliaciones o empresas que atraviesan dificultades.' },
          { t: 'Subvenciones y ayudas', d: 'Búsqueda y tramitación, con nuestro buscador propio de convocatorias.' },
          { t: 'Presupuestos y cuadro de mando', d: 'Objetivos anuales y seguimiento de los indicadores clave de su negocio.' },
          { t: 'Valoración de empresas', d: 'Para compraventas, entrada o salida de socios y relevo generacional.' },
        ],
      },
      {
        h2: 'Cuándo conviene un análisis financiero',
        parrafos: [
          'Antes de pedir un préstamo o renovar sus líneas de crédito; antes de una inversión importante; cuando las ventas crecen pero la caja no; si no sabe qué parte de su actividad es rentable; y cuando la empresa pasa por un momento difícil y hay que tomar decisiones rápido.',
        ],
      },
      {
        h2: 'Su análisis financiero, con los datos que ya llevamos',
        parrafos: [
          'El análisis financiero se apoya en su contabilidad y en su fiscalidad, que ya llevamos nosotros: no hay que empezar de cero ni pedirle la información dos veces. Y nuestras herramientas son propias, pensadas para pymes, no hojas de cálculo genéricas.',
          `Desde 1977, con despachos en ${DESPACHOS}.`,
        ],
      },
    ],
    faqs: [
      { q: '¿Qué información pide un banco para conceder financiación a una empresa?', a: 'Normalmente las cuentas de los últimos ejercicios, la situación actual y una previsión de cómo se devolverá el préstamo. Le ayudamos a prepararla de forma ordenada y creíble.' },
      { q: '¿Qué es un plan de viabilidad?', a: 'Es un estudio que demuestra, con números, que un proyecto o una empresa puede funcionar y devolver lo que necesita invertir. Lo piden bancos, inversores y muchas convocatorias de ayudas.' },
      { q: '¿Cómo sé qué productos o clientes son rentables?', a: 'Con un análisis de costes por producto, cliente o actividad. Es justo lo que hace nuestro sistema A.D.A.' },
      { q: '¿Me ayudan a encontrar subvenciones?', a: 'Sí. Tenemos un buscador de subvenciones y le ayudamos a preparar y tramitar las que encajan con su empresa.' },
      { q: '¿Sirve para empresas pequeñas?', a: 'Sí. Nuestros sistemas están pensados para pymes: la información se adapta al tamaño y a las necesidades de cada empresa.' },
    ],
    relacionadas: ['contable', 'fiscal', 'idi-patent-box', 'auditoria'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── AUDITORÍA
  auditoria: {
    title: 'Auditoría de cuentas en Murcia | Serveco Asesores',
    metaDescription:
      'Auditoría de cuentas anuales en Murcia para empresas obligadas y voluntarias, e informes de revisión. Serveco, desde 1977, despachos en la Región.',
    h1: 'Auditoría de cuentas en Murcia',
    lead:
      'Auditamos las cuentas anuales de empresas obligadas a ello y de las que deciden hacerlo de forma voluntaria, y emitimos otros informes de revisión que le pueden pedir bancos, socios o administraciones.',
    busquedaPrincipal: 'auditoría de cuentas en Murcia',
    secciones: [
      {
        h2: 'Auditoría de cuentas: confianza para socios, bancos y administraciones',
        parrafos: [
          'Una auditoría de cuentas es la revisión, por parte de un auditor independiente, de las cuentas anuales de una empresa para opinar si reflejan fielmente su situación. El resultado es un informe que da confianza a socios, bancos, clientes y administraciones.',
        ],
      },
      {
        h2: 'Empresas obligadas a auditar sus cuentas',
        parrafos: [
          'La ley obliga a auditar a las sociedades que superan determinados límites de tamaño (activo, cifra de negocios y número de trabajadores) durante dos ejercicios seguidos, y a otras entidades por su actividad o porque reciben determinadas ayudas públicas. También puede exigirla un socio minoritario en ciertos casos.',
          'Si no sabe si su empresa está obligada, lo revisamos con sus cuentas.',
        ],
      },
      {
        h2: 'Trabajos de auditoría y revisión',
        parrafos: [],
        lista: [
          { t: 'Auditoría obligatoria de cuentas anuales', d: 'Para sociedades que superan los límites legales.' },
          { t: 'Auditoría voluntaria', d: 'Para dar confianza a bancos, inversores o socios, o para preparar una operación.' },
          { t: 'Informes de revisión', d: 'Trabajos de revisión y procedimientos acordados que le piden terceros.' },
          { t: 'Auditoría de subvenciones', d: 'Justificación de ayudas públicas cuando la convocatoria lo exige.' },
        ],
      },
      {
        h2: 'El proceso de auditoría, paso a paso',
        parrafos: [],
        lista: [
          { t: 'Planificación', d: 'Conocemos su empresa y planificamos el trabajo con tiempo.' },
          { t: 'Revisión', d: 'Comprobamos las cuentas y sus soportes, con la mínima interrupción de su actividad.' },
          { t: 'Comunicación', d: 'Le comentamos lo que encontramos antes de emitir el informe.' },
          { t: 'Informe', d: 'Emitimos el informe de auditoría en plazo para la aprobación y el depósito de las cuentas.' },
        ],
      },
    ],
    faqs: [
      { q: '¿Cómo sé si mi empresa está obligada a auditarse?', a: 'Depende de su tamaño durante dos ejercicios consecutivos y de otras circunstancias, como recibir ciertas subvenciones. Lo revisamos con sus cuentas anuales.' },
      { q: '¿Puede el mismo despacho llevar mi contabilidad y auditarme?', a: 'No: la normativa exige independencia entre quien prepara las cuentas y quien las audita. Por eso organizamos cada encargo respetando esas incompatibilidades.' },
      { q: '¿Para qué sirve una auditoría voluntaria?', a: 'Para dar confianza sobre sus cuentas a bancos, inversores, socios o compradores, por ejemplo antes de pedir financiación o de vender la empresa.' },
      { q: '¿Cuándo hay que empezar la auditoría?', a: 'Conviene planificarla antes del cierre del ejercicio para que el informe esté listo cuando la junta tenga que aprobar las cuentas.' },
    ],
    relacionadas: ['contable', 'financiero', 'fiscal'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── I+D+i
  'idi-patent-box': {
    title: 'Deducción por I+D+i y Patent Box | Serveco Asesores',
    metaDescription:
      'Deducción por I+D+i y Patent Box para empresas: análisis de proyectos, documentación e informe motivado. Serveco, asesoría de empresas desde 1977.',
    h1: 'Deducción por I+D+i y Patent Box para empresas',
    lead:
      'Muchas empresas innovan sin saber que pueden aplicar deducciones fiscales por ello. Analizamos sus proyectos, le decimos cuáles encajan y preparamos la documentación para aplicarlas con seguridad.',
    busquedaPrincipal: 'deducción por I+D+i',
    secciones: [
      {
        h2: 'La deducción por I+D+i en el impuesto de sociedades',
        parrafos: [
          'La deducción por I+D+i es un incentivo del impuesto de sociedades que permite reducir la cuota a las empresas que invierten en investigación y desarrollo o en innovación tecnológica. No hace falta ser una gran empresa ni tener un laboratorio: nuevos productos, mejoras de procesos o desarrollos de software pueden encajar si cumplen los requisitos.',
        ],
      },
      {
        h2: 'Patent Box: menos impuestos por sus activos intangibles',
        parrafos: [
          'El Patent Box es un régimen fiscal que reduce la tributación de las rentas que obtiene una empresa por ceder o explotar determinados activos intangibles, como patentes o software protegido. Puede ser muy interesante para empresas que han desarrollado tecnología propia.',
        ],
      },
      {
        h2: 'Proyectos que pueden aplicar la deducción',
        parrafos: ['Algunos ejemplos habituales en empresas de la Región:'],
        lista: [
          { t: 'Nuevos productos', d: 'Desarrollo de productos con mejoras técnicas relevantes frente a lo que existe.' },
          { t: 'Mejora de procesos', d: 'Nuevos procesos de fabricación o transformación, automatización, eficiencia.' },
          { t: 'Software', d: 'Desarrollo de aplicaciones o sistemas con novedad técnica.' },
          { t: 'Agroalimentario', d: 'Nuevas variedades, técnicas de cultivo o procesos de conservación.' },
        ],
      },
      {
        h2: 'De la idea a la deducción aplicada',
        parrafos: [],
        lista: [
          { t: 'Análisis de proyectos', d: 'Revisamos sus proyectos con perfil técnico y fiscal y le decimos cuáles pueden encajar.' },
          { t: 'Documentación', d: 'Preparamos la memoria técnica y la justificación de los gastos.' },
          { t: 'Seguridad jurídica', d: 'Le asesoramos sobre el informe motivado y las opciones para aplicar la deducción con seguridad.' },
          { t: 'Aplicación', d: 'Coordinamos la deducción con su impuesto de sociedades.' },
        ],
      },
      {
        h2: 'Ingenieros, economistas y abogados en el mismo equipo',
        parrafos: [
          'En nuestro equipo hay ingenieros, además de economistas y abogados: podemos valorar la parte técnica del proyecto y la fiscal a la vez, que es justo lo que exige este incentivo.',
        ],
      },
    ],
    faqs: [
      { q: '¿Mi empresa puede aplicar la deducción por I+D+i si es pequeña?', a: 'Sí. El tamaño no es un requisito: lo que cuenta es que el proyecto cumpla las condiciones de investigación, desarrollo o innovación tecnológica.' },
      { q: '¿Qué diferencia hay entre I+D e innovación tecnológica?', a: 'La I+D busca conocimientos o productos sustancialmente nuevos; la innovación tecnológica, mejoras significativas sobre lo existente. Tienen tratamientos distintos y hay que clasificarlas bien.' },
      { q: '¿Qué es el informe motivado?', a: 'Es un informe que emite la Administración sobre la calificación de un proyecto como I+D o innovación y que da seguridad jurídica ante Hacienda. Le explicamos cuándo conviene solicitarlo.' },
      { q: '¿Puedo aplicar la deducción aunque tenga pérdidas?', a: 'Hay opciones para aprovechar la deducción en ejercicios posteriores o en determinadas condiciones. Lo estudiamos con su caso.' },
      { q: '¿Qué activos entran en el Patent Box?', a: 'Determinados activos intangibles, como patentes o software protegido, cumpliendo los requisitos de la ley. No todas las marcas o conocimientos entran, por eso conviene analizarlo antes.' },
    ],
    relacionadas: ['fiscal', 'financiero', 'contable'],
    validado: false,
  },

  // ───────────────────────────────────────────────────────────── FORMACIÓN
  formacion: {
    title: 'Formación bonificada para empresas en Murcia | Serveco',
    metaDescription:
      'Formación bonificada para empresas: cursos para su plantilla con cargo al crédito de formación y gestión completa ante FUNDAE. Serveco, desde 1977.',
    h1: 'Formación bonificada para empresas',
    lead:
      'Su empresa dispone cada año de un crédito para formar a su plantilla. Le ayudamos a aprovecharlo: organizamos los cursos y gestionamos toda la tramitación.',
    busquedaPrincipal: 'formación bonificada para empresas',
    secciones: [
      {
        h2: 'Formación bonificada: el crédito que su empresa ya tiene',
        parrafos: [
          'Las empresas que cotizan por formación profesional disponen cada año de un crédito para formar a sus trabajadores. Ese crédito se recupera bonificando las cotizaciones a la Seguridad Social, de modo que la formación puede tener un coste muy bajo o nulo para la empresa.',
          'Muchas empresas no lo usan porque desconocen que lo tienen o por la tramitación. Nosotros nos ocupamos de ella.',
        ],
      },
      {
        h2: 'Gestión completa de la formación bonificada',
        parrafos: [],
        lista: [
          { t: 'Cálculo del crédito', d: 'Le decimos de cuánto crédito dispone su empresa este año.' },
          { t: 'Plan de formación', d: 'Proponemos cursos útiles para su plantilla y su sector.' },
          { t: 'Gestión ante FUNDAE', d: 'Comunicaciones de inicio y fin, documentación y control de la bonificación.' },
          { t: 'Aplicación en nóminas', d: 'Coordinamos la bonificación con su área laboral.' },
        ],
      },
      {
        h2: 'Cursos para su plantilla',
        parrafos: [
          'Formación ligada a su actividad: idiomas, informática, prevención, gestión, atención al cliente, cursos técnicos del sector y otros. Lo importante es que sirva a su empresa y a sus trabajadores.',
        ],
      },
      {
        h2: 'Formación coordinada con su gestión laboral',
        parrafos: [
          'La bonificación se aplica en sus cotizaciones, así que conviene que la formación y la gestión laboral vayan de la mano. Si llevamos también sus nóminas, lo coordinamos todo y la formación no se convierte en un trámite más para usted.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cuánto crédito de formación tiene mi empresa?', a: 'Depende de lo que su empresa cotizó por formación profesional el año anterior y de su tamaño. Se lo calculamos sin compromiso.' },
      { q: '¿Qué pasa si no uso el crédito de formación?', a: 'En general, el crédito que no se usa en el año no se recupera, salvo algunas posibilidades para empresas pequeñas. Por eso conviene planificar la formación a principios de año.' },
      { q: '¿Los cursos son gratis para la empresa?', a: 'El coste se compensa con la bonificación en las cotizaciones hasta el límite de su crédito; en algunos casos la empresa debe aportar una parte. Se lo detallamos antes de empezar.' },
      { q: '¿Pueden hacerse los cursos en línea?', a: 'Sí, hay modalidades presenciales, en línea y mixtas. Elegimos la que mejor encaje con su plantilla.' },
      { q: '¿Qué es FUNDAE?', a: 'Es la Fundación Estatal para la Formación en el Empleo, el organismo a través del que se gestiona la formación bonificada de las empresas.' },
    ],
    relacionadas: ['laboral', 'financiero'],
    validado: false,
  },
};

export function getAreaSeo(slug: string): AreaSeo | undefined {
  return AREAS_SEO[slug];
}
