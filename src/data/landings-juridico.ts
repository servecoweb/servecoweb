/**
 * LANDINGS JURÍDICO × 2 sedes (Yecla, Lorca). Ver src/data/landings.ts.
 * Texto propio por sede. Sin cifras que caducan ni consejo personalizado. Eskala, 25 sep 2026 · validado: false.
 */
import type { Landing } from './landings-tipos';

export const LANDINGS_JURIDICO: Landing[] = [
  {
    area: 'juridico',
    sede: 'yecla',
    title: 'Abogados de empresa en Yecla: asesoría jurídica | Serveco',
    metaDescription:
      'Asesoría jurídica en Yecla para empresas familiares e industria del mueble: pactos entre socios, protocolo familiar, contratos con agentes y distribuidores, impagos y juicios.',
    h1: 'Asesoría jurídica para empresas en Yecla',
    lead: 'Abogados para las empresas de Yecla: pactos entre socios, contratos con agentes y distribuidores, cobro de impagos y defensa en juicio, coordinados con su asesor fiscal y laboral.',
    busquedaPrincipal: 'abogados de empresa en Yecla',
    secciones: [
      {
        h2: 'Derecho de empresa para la industria de Yecla',
        parrafos: [
          'Las empresas de Yecla venden en toda España y fuera, trabajan con agentes comerciales y distribuidores y, muchas veces, son empresas familiares con varios hermanos o primos en el accionariado. Son situaciones en las que un buen contrato o un buen pacto evita años de conflicto.',
          'Nuestros abogados trabajan desde la prevención y, cuando el conflicto ya existe, le defienden, con la ventaja de que su expediente fiscal, contable y laboral está en la misma firma.',
        ],
      },
      {
        h2: 'Qué llevamos para las empresas de Yecla',
        parrafos: [],
        lista: [
          { t: 'Empresa familiar', d: 'Protocolo familiar, pactos entre socios y organización del relevo generacional.' },
          { t: 'Sociedades', d: 'Juntas, cambios de administradores, ampliaciones de capital y entrada o salida de socios.' },
          { t: 'Agentes y distribuidores', d: 'Contratos de agencia y distribución, exclusivas, comisiones y qué pasa al terminar la relación.' },
          { t: 'Clientes y proveedores', d: 'Condiciones generales, contratos de suministro y de confidencialidad.' },
          { t: 'Cobro de impagos', d: 'Requerimientos y reclamaciones judiciales a clientes de España y del extranjero.' },
          { t: 'Juicios', d: 'Defensa en procedimientos civiles y mercantiles.' },
        ],
      },
      {
        h2: 'Pactos entre socios y protocolo familiar',
        parrafos: [
          'Cuando la empresa pasa a la siguiente generación, o cuando entran socios nuevos, conviene dejar por escrito qué ocurre si alguien quiere salir, cómo se valoran sus participaciones, quién puede trabajar en la empresa y cómo se toman las decisiones importantes. Sin esos acuerdos, un desacuerdo familiar puede bloquear la empresa.',
          'Redactamos el protocolo y los pactos con los socios, y los coordinamos con la planificación fiscal del relevo.',
        ],
      },
      {
        h2: 'Agentes comerciales y distribuidores',
        parrafos: [
          'Muchas fábricas venden a través de agentes o distribuidores. La terminación de esas relaciones puede dar derecho a indemnizaciones que sorprenden a la empresa si el contrato no estaba bien planteado. Revisamos sus contratos actuales y preparamos los nuevos para que las reglas estén claras desde el principio.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en cualquiera de los dos despachos de Yecla o por videollamada. Nos cuenta el asunto, revisamos la documentación y le decimos cómo lo abordaríamos.'],
      },
    ],
    faqs: [
      { q: 'Un cliente de otra provincia no me paga. ¿Qué hago?', a: 'Primero, un requerimiento formal; si no paga, hay procedimientos judiciales pensados para reclamar deudas. Le decimos cuál encaja según el importe y la documentación.' },
      { q: '¿Necesito un protocolo familiar?', a: 'Si hay varias ramas de la familia en la empresa o se acerca el relevo, suele ser muy recomendable. Lo vemos con usted.' },
      { q: 'Quiero cambiar de distribuidor. ¿Tengo que indemnizarle?', a: 'Depende del contrato y de la relación. Revíselo con nosotros antes de comunicar nada.' },
      { q: '¿Pueden defenderme en un juicio?', a: 'Sí. Nuestros abogados le representan en procedimientos civiles y mercantiles.' },
    ],
    cta: 'Consultar con el área jurídica en Yecla',
    pendienteReparto: true,
    validado: false,
  },
  {
    area: 'juridico',
    sede: 'lorca',
    title: 'Abogados en Lorca: asesoría jurídica para empresas | Serveco',
    metaDescription:
      'Asesoría jurídica en Lorca: reclamación de deudas, contratos, herencias con tierras y naves, arrendamientos rústicos, conflictos entre socios y juicios. Despacho en la Antigua Plaza de Abastos.',
    h1: 'Asesoría jurídica en Lorca',
    lead: 'Abogados en Lorca para empresas, agricultores y familias: cobro de deudas, contratos, herencias, arrendamientos y juicios, desde nuestro despacho de la Antigua Plaza de Abastos.',
    busquedaPrincipal: 'abogados en Lorca',
    secciones: [
      {
        h2: 'Asesoría jurídica para la comarca de Lorca',
        parrafos: [
          'Empresas agrícolas y ganaderas, constructoras, comercios y familias con patrimonio en el campo: en la comarca de Lorca los asuntos legales más habituales tienen que ver con cobrar lo que se debe, con los contratos de cada día y con las herencias de tierras, naves y viviendas.',
          'Nuestros abogados trabajan en Lorca coordinados con el área fiscal y laboral, así que un asunto con varias caras se resuelve en un solo sitio.',
        ],
      },
      {
        h2: 'Qué llevamos desde nuestro despacho de Lorca',
        parrafos: [],
        lista: [
          { t: 'Reclamación de deudas', d: 'Facturas impagadas de clientes, primero de forma extrajudicial y, si hace falta, en el juzgado.' },
          { t: 'Contratos', d: 'Compraventas, suministros, obras y contratos con proveedores.' },
          { t: 'Arrendamientos', d: 'Arrendamientos rústicos de fincas y de naves, y los conflictos que surgen de ellos.' },
          { t: 'Herencias', d: 'Testamentos, particiones y herencias con tierras, naves y viviendas.' },
          { t: 'Socios', d: 'Conflictos entre socios, juntas y salida de socios.' },
          { t: 'Juicios', d: 'Defensa en procedimientos civiles y mercantiles.' },
        ],
      },
      {
        h2: 'Herencias con tierras y naves',
        parrafos: [
          'Una herencia con fincas, naves o una explotación en marcha es más compleja que una con solo dinero o una vivienda: hay que valorar los bienes, decidir quién continúa con la actividad y cómo se compensa a los demás herederos, y tener en cuenta los impuestos de cada opción.',
          'La parte jurídica y la fiscal se llevan juntas, lo que evita acuerdos entre hermanos que luego resultan caros en impuestos.',
        ],
      },
      {
        h2: 'Cobrar a tiempo',
        parrafos: [
          'En sectores con márgenes ajustados, una factura grande sin cobrar puede poner en apuros a la empresa. Cuanto antes se reclama, más opciones hay de cobrar. Revisamos la documentación de la deuda y le proponemos la vía más rápida según el importe y el deudor.',
        ],
      },
      {
        h2: 'Cómo empezamos',
        parrafos: ['Pida cita en el despacho de Lorca o por videollamada. Nos cuenta el asunto, revisamos la documentación y le decimos cómo lo abordaríamos.'],
      },
    ],
    faqs: [
      { q: 'Un cliente me debe una factura desde hace meses. ¿Qué puedo hacer?', a: 'Empezar con un requerimiento formal y, si no paga, reclamar judicialmente con el procedimiento que corresponda. Cuanto antes, mejor.' },
      { q: 'Somos varios hermanos y heredamos una finca. ¿Cómo la repartimos?', a: 'Hay varias opciones (dividirla, que uno la adquiera y compense a los demás, mantenerla en común) y cada una tiene efectos jurídicos y fiscales. Las revisamos con todos antes de decidir.' },
      { q: 'El arrendatario de mi finca no paga. ¿Qué hago?', a: 'Revisamos el contrato y le decimos cómo reclamar la renta y, si procede, recuperar la finca.' },
      { q: '¿Atienden asuntos de Águilas o Totana?', a: 'Sí, desde el despacho de Lorca atendemos a todo el Valle del Guadalentín.' },
    ],
    cta: 'Consultar con el área jurídica en Lorca',
    pendienteReparto: true,
    validado: false,
  },
];
