/**
 * CONTENIDO SEO de páginas sueltas: Punto PAE y Subvenciones (ES). Plantilla PLAN-SEO-PAGINAS.md.
 * Sin cifras que caducan (capital mínimo, cuantías de ayudas, nombres de convocatorias concretas).
 * Redacción de Eskala (25 sep 2026) · validado: false.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';

export const PAE_SEO: PaginaSeo = {
  title: 'Crear una empresa en Murcia: Punto PAE oficial | Serveco',
  metaDescription:
    'Constituya su sociedad o dese de alta como autónomo con Serveco, Punto de Atención al Emprendedor oficial en Murcia. Trámite telemático y asesoramiento desde el primer día.',
  h1: 'Crear una empresa en Murcia con un Punto PAE oficial',
  lead:
    'Somos Punto de Atención al Emprendedor. Tramitamos la creación de su sociedad o su alta como autónomo de forma telemática, y le asesoramos antes para que elija bien.',
  busquedaPrincipal: 'crear una empresa en Murcia',
  secciones: [
    {
      h2: 'Qué es un Punto de Atención al Emprendedor',
      parrafos: [
        'Los Puntos de Atención al Emprendedor (PAE) forman parte de la red oficial que permite iniciar una actividad de forma telemática. Desde un PAE se rellena un único formulario electrónico, el Documento Único Electrónico (DUE), que se comunica a las distintas administraciones sin que usted tenga que ir de una a otra.',
        'Como Punto PAE, en Serveco tramitamos ese proceso por usted y, además, le asesoramos antes de empezar: la forma jurídica, los impuestos y la parte laboral se deciden bien desde el primer día.',
      ],
    },
    {
      h2: 'Qué tramitamos como Punto PAE',
      parrafos: [],
      lista: [
        { t: 'Alta como autónomo', d: 'Alta en Hacienda y en la Seguridad Social en un solo trámite.' },
        { t: 'Constitución de una sociedad limitada', d: 'Desde la reserva del nombre hasta la inscripción, con cita en notaría.' },
        { t: 'Paso de autónomo a sociedad', d: 'Cuando su actividad crece y conviene cambiar de forma jurídica.' },
        { t: 'Primeros pasos', d: 'Obligaciones fiscales, contables y laborales de los primeros meses.' },
      ],
    },
    {
      h2: 'Autónomo o sociedad: cómo elegir',
      parrafos: [
        'No hay una respuesta única. Influyen los ingresos que espera, el riesgo de la actividad (con una sociedad, en general, su patrimonio personal queda separado del de la empresa), si va a tener socios, la imagen que necesita ante clientes y bancos y los costes de gestión de cada opción.',
        'Antes de tramitar nada, revisamos su proyecto con números y le decimos qué forma le conviene hoy y cuándo le convendría cambiar.',
      ],
    },
    {
      h2: 'Los pasos para constituir una sociedad limitada',
      parrafos: [],
      lista: [
        { t: 'Denominación', d: 'Reserva del nombre de la sociedad en el Registro Mercantil Central.' },
        { t: 'Estatutos y capital', d: 'Redacción de los estatutos y aportación del capital social.' },
        { t: 'Notaría', d: 'Firma de la escritura de constitución.' },
        { t: 'NIF e inscripción', d: 'Obtención del número de identificación fiscal e inscripción en el Registro Mercantil.' },
        { t: 'Altas', d: 'Alta fiscal y, si hay trabajadores o administradores que deban cotizar, en la Seguridad Social.' },
      ],
    },
    {
      h2: 'Y después de crearla',
      parrafos: [
        'Crear la empresa es el principio. Desde el primer mes hay que presentar impuestos, llevar la contabilidad y, si contrata, gestionar nóminas. Como asesoría integral, podemos seguir con usted en todo ello, desde cualquiera de nuestros seis despachos.',
      ],
    },
  ],
  faqs: [
    { q: '¿Cuánto tarda crear una sociedad a través de un PAE?', a: 'Depende sobre todo de la reserva del nombre y de la cita en la notaría. Tramitándolo de forma telemática suele ser bastante más rápido que por la vía tradicional; le damos una previsión al empezar.' },
    { q: '¿Tengo que ir a alguna administración en persona?', a: 'Para la sociedad, la firma ante notario, que en algunos casos ya puede hacerse a distancia. El resto de trámites se hacen de forma telemática desde el Punto PAE.' },
    { q: '¿Puedo darme de alta como autónomo con ustedes aunque luego lleve yo las cuentas?', a: 'Sí, aunque le recomendamos al menos una revisión inicial de sus obligaciones para empezar sin errores.' },
    { q: '¿Atienden a extranjeros que quieren crear una empresa en España?', a: 'Sí. Primero necesitará su NIE; le ayudamos con él y con la creación de la empresa, también en inglés.' },
  ],
  validado: false,
};

export const SUBVENCIONES_SEO: PaginaSeo = {
  title: 'Subvenciones y ayudas para empresas en Murcia | Serveco',
  metaDescription:
    'Localizamos las ayudas y subvenciones que encajan con su empresa, preparamos la solicitud y la justificación. Buscador de convocatorias y asesoramiento en la Región de Murcia.',
  h1: 'Subvenciones y ayudas para empresas en la Región de Murcia',
  lead:
    'Buscamos las convocatorias que encajan con su proyecto, preparamos la solicitud y le acompañamos hasta la justificación. Y ponemos a su disposición nuestro buscador de ayudas.',
  busquedaPrincipal: 'subvenciones para empresas Murcia',
  secciones: [
    {
      h2: 'Ayudas públicas: dinero que muchas empresas dejan pasar',
      parrafos: [
        'Cada año se convocan ayudas regionales, estatales y europeas para invertir, contratar, innovar, digitalizarse, exportar o formar a la plantilla. Muchas empresas no las piden porque no se enteran a tiempo o porque la tramitación les parece complicada.',
      ],
    },
    {
      h2: 'Cómo le ayudamos con las subvenciones',
      parrafos: [],
      lista: [
        { t: 'Búsqueda', d: 'Revisamos qué convocatorias abiertas o próximas encajan con su empresa y su proyecto.' },
        { t: 'Solicitud', d: 'Preparamos la memoria, el presupuesto y la documentación, y la presentamos en plazo.' },
        { t: 'Seguimiento', d: 'Atendemos los requerimientos de la administración durante la tramitación.' },
        { t: 'Justificación', d: 'Preparamos la justificación de la ayuda concedida para que no haya que devolverla.' },
      ],
    },
    {
      h2: 'Antes de invertir, pregunte',
      parrafos: [
        'Muchas ayudas exigen que la inversión o el proyecto no se hayan iniciado antes de presentar la solicitud. Es uno de los errores más caros: comprar la maquinaria o empezar la obra y descubrir después que había una ayuda que ya no se puede pedir. Si está pensando en invertir, consúltenos antes.',
      ],
    },
    {
      h2: 'Tipos de ayudas que tramitamos',
      parrafos: [],
      lista: [
        { t: 'Inversión y modernización', d: 'Maquinaria, instalaciones y ampliación de la actividad.' },
        { t: 'I+D+i y digitalización', d: 'Proyectos de innovación y transformación digital.' },
        { t: 'Empleo', d: 'Incentivos a la contratación.' },
        { t: 'Sector agrario', d: 'Ayudas a explotaciones, bodegas y almacenes.' },
        { t: 'Formación', d: 'Formación bonificada de la plantilla.' },
      ],
    },
  ],
  faqs: [
    { q: '¿Las subvenciones hay que devolverlas?', a: 'No, si se cumplen las condiciones y se justifican correctamente. Si no se justifica bien o se incumplen los compromisos, la administración puede reclamar la devolución.' },
    { q: '¿Una subvención tributa?', a: 'En general, las ayudas se integran en el resultado de la empresa y tienen efectos fiscales. Lo tenemos en cuenta al planificar su año.' },
    { q: '¿Puedo pedir varias ayudas para el mismo proyecto?', a: 'A veces sí, pero muchas convocatorias limitan la compatibilidad con otras ayudas. Lo revisamos antes de solicitar.' },
    { q: '¿El buscador sustituye al asesoramiento?', a: 'No. El buscador le permite ver convocatorias; nosotros revisamos si realmente encajan con su empresa y preparamos la solicitud.' },
  ],
  validado: false,
};
