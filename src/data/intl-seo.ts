/**
 * CONTENIDO SEO DEL SILO INTERNACIONAL (portada + NIE + IRNR + Benidorm), ES y EN.
 * Plantilla: W - SERVECO/PLAN-SEO-PAGINAS.md (H1 con la búsqueda, H2 descriptivos, FAQs distintas de los H2).
 * El inglés NO es traducción literal: está escrito para quien busca en inglés (británicos, nórdicos, alemanes
 * con vivienda en la costa). Aquí el inglés es lo que más se busca.
 * Reglas: sin cifras (tipos, porcentajes, tasas) ni plazos sin vigencia; sin consejo personalizado.
 * Redacción de Eskala (25 sep 2026) · validado: false hasta que lo revise Serveco.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';

type Bilingue = { es: PaginaSeo; en: PaginaSeo };

export const INTL_SEO: Record<'portada' | 'nie' | 'impuesto-no-residentes' | 'benidorm', Bilingue> = {
  // ───────────────────────────────────────────────────────────── PORTADA
  portada: {
    es: {
      title: 'Asesoría para extranjeros y no residentes en España',
      metaDescription:
        'NIE, impuesto de no residentes, herencias y compraventa de vivienda en España. Asesoría en español y en inglés en nuestros seis despachos de Murcia y Alicante.',
      h1: 'Asesoría para extranjeros y no residentes en España',
      lead:
        'Ayudamos a quienes viven fuera y tienen una vivienda o ingresos en España, y a quienes acaban de llegar, con sus impuestos, sus trámites y su patrimonio. En español y en inglés.',
      busquedaPrincipal: 'asesoría para extranjeros y no residentes',
      secciones: [
        {
          h2: 'Para quién trabajamos',
          parrafos: [
            'Atendemos a propietarios que tienen una casa en la costa y residen en otro país, a extranjeros que se han instalado en la Región de Murcia o en la Costa Blanca, a quienes están pensando en comprar o vender una vivienda en España y a empresas con socios o trabajadores extranjeros.',
            'Muchos de nuestros clientes internacionales no hablan español, o prefieren resolver los temas fiscales y legales en su idioma. Por eso trabajamos en inglés con normalidad, por escrito, por teléfono o en persona.',
          ],
        },
        {
          h2: 'Servicios para no residentes y extranjeros',
          parrafos: ['Cubrimos lo que suele necesitar alguien con intereses en España sin ser residente, o que acaba de llegar:'],
          lista: [
            { t: 'NIE', d: 'Solicitud del número de identidad de extranjero, imprescindible para comprar, heredar, trabajar o pagar impuestos en España.' },
            { t: 'Impuesto de no residentes', d: 'Declaraciones por tener una vivienda en España, por alquilarla o por venderla.' },
            { t: 'Compraventa de vivienda', d: 'Acompañamiento fiscal y jurídico al comprar o vender un inmueble siendo extranjero.' },
            { t: 'Testamentos y herencias', d: 'Testamento español para sus bienes en España y tramitación de herencias de no residentes.' },
            { t: 'Cambio de residencia', d: 'Qué cambia en sus impuestos cuando pasa a vivir en España, o cuando deja de hacerlo.' },
            { t: 'Negocios en España', d: 'Alta de autónomo o creación de una sociedad, contabilidad y nóminas para quien emprende aquí.' },
          ],
        },
        {
          h2: 'Cómo trabajamos con clientes que viven fuera',
          parrafos: [
            'No hace falta que venga a España para cada gestión. La mayoría de los trámites se preparan a distancia: nos envía la documentación por correo, resolvemos las dudas por videollamada y, cuando la normativa lo permite, actuamos en su nombre con la autorización o el poder que corresponda.',
            'Le avisamos con tiempo de lo que tiene que presentar cada año, para que no tenga que estar pendiente del calendario fiscal español desde su país.',
          ],
        },
        {
          h2: 'Por qué Serveco para sus asuntos en España',
          parrafos: [
            'Somos una asesoría integral desde 1977: fiscalistas, abogados y economistas en el mismo equipo. Si vende una vivienda, la parte fiscal, la jurídica y la notarial se coordinan desde un solo interlocutor, en su idioma.',
            'Tenemos seis despachos: Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm. En cualquiera de ellos le atendemos con estos servicios, y el de Benidorm, en plena Costa Blanca, está especializado en clientes internacionales. Y si vive fuera, lo resolvemos a distancia.',
          ],
        },
      ],
      faqs: [
        { q: '¿Tengo que pagar impuestos en España si no vivo aquí?', a: 'Si tiene una vivienda, cobra alquileres o vende un inmueble en España, normalmente sí, a través del impuesto sobre la renta de no residentes. Lo que corresponda depende de su caso y de su país de residencia.' },
        { q: '¿Pueden atenderme en inglés?', a: 'Sí. Trabajamos en inglés por correo, teléfono y videollamada, y en persona puede acudir a cualquiera de nuestros despachos; el de Benidorm está especializado en clientes internacionales.' },
        { q: '¿Tengo que ir al despacho de Benidorm?', a: 'No. Estos servicios se prestan en los seis despachos (Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm) y también a distancia. Elija el que le quede más cerca.' },
        { q: '¿Necesito estar en España para hacer los trámites?', a: 'En la mayoría de los casos, no. Preparamos la documentación a distancia y, cuando la normativa lo permite, actuamos con su autorización o mediante poder.' },
        { q: '¿Qué pasa con mi casa en España si fallezco?', a: 'Sus bienes en España se heredan conforme a las normas que correspondan y con el impuesto de sucesiones español. Un testamento bien planteado facilita mucho el trámite a sus herederos; lo estudiamos con usted.' },
        { q: '¿Qué cambió para los británicos con el Brexit?', a: 'Desde la salida del Reino Unido de la Unión Europea, los ciudadanos británicos son nacionales de un tercer país a efectos de residencia y de algunos impuestos. Revisamos cómo le afecta en su caso.' },
      ],
      validado: false,
    },
    en: {
      title: 'Tax and legal advice in Spain for non-residents',
      metaDescription:
        'NIE numbers, non-resident tax, wills, inheritance and property in Spain. English-speaking advisers across our six offices in Murcia and Alicante.',
      h1: 'Tax and legal advice in Spain for non-residents and expats',
      lead:
        'We help people who live abroad and own a home or earn income in Spain, and people who have just moved here, with their taxes, paperwork and assets. In plain English.',
      busquedaPrincipal: 'tax advice in Spain for non-residents',
      secciones: [
        {
          h2: 'Who we help',
          parrafos: [
            'Our international clients include homeowners on the coast who live in another country, foreign nationals who have settled in the Region of Murcia or on the Costa Blanca, people planning to buy or sell a property in Spain, and businesses with foreign partners or staff.',
            'Spanish tax and legal paperwork is hard enough in your own language. We deal with you in English, in writing, on the phone or face to face.',
          ],
        },
        {
          h2: 'Services for non-residents and expats in Spain',
          parrafos: ['Everything someone with interests in Spain usually needs, whether you live here or not:'],
          lista: [
            { t: 'NIE number', d: 'Your Spanish foreigner identity number, needed to buy property, inherit, work or pay tax in Spain.' },
            { t: 'Non-resident tax', d: 'Returns for owning a Spanish home, renting it out or selling it.' },
            { t: 'Buying and selling property', d: 'Tax and legal support when you buy or sell a home in Spain as a foreigner.' },
            { t: 'Wills and inheritance', d: 'A Spanish will for your assets in Spain, and inheritance procedures for non-residents.' },
            { t: 'Moving to or leaving Spain', d: 'What changes in your taxes when you become resident here, or stop being one.' },
            { t: 'Starting a business', d: 'Registering as self-employed or setting up a company, plus bookkeeping and payroll.' },
          ],
        },
        {
          h2: 'Working with clients who live abroad',
          parrafos: [
            'You do not need to fly to Spain for every step. Most procedures can be prepared remotely: you send us your documents by email, we talk things through on a video call and, where the rules allow it, we act on your behalf with the authorisation or power of attorney required.',
            'We remind you well in advance of what needs filing each year, so you do not have to keep track of the Spanish tax calendar from home.',
          ],
        },
        {
          h2: 'Why choose Serveco',
          parrafos: [
            'We have been advising businesses and families since 1977, with tax advisers, lawyers and economists in the same team. When you sell a property, the tax, legal and notary sides are coordinated through one point of contact, in English.',
            'We have six offices: Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm. Any of them can help you with these services, and our Benidorm office, on the Costa Blanca, specialises in international clients. If you live abroad, we handle it remotely.',
          ],
        },
      ],
      faqs: [
        { q: 'Do I have to pay tax in Spain if I do not live there?', a: 'If you own a home, receive rental income or sell a property in Spain, you usually do, through non-resident income tax. What applies depends on your situation and your country of residence.' },
        { q: 'Can you deal with everything in English?', a: 'Yes. We work in English by email, phone and video call, and you can see us in person at any of our offices; our Benidorm office specialises in international clients.' },
        { q: 'Do I have to go to the Benidorm office?', a: 'No. These services are available at all six offices (Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm) and remotely. Choose whichever is closest to you.' },
        { q: 'Do I need to be in Spain to sort out my paperwork?', a: 'In most cases, no. We prepare everything remotely and, where the rules allow it, act for you with your authorisation or a power of attorney.' },
        { q: 'What happens to my Spanish home when I die?', a: 'Your Spanish assets will pass under the applicable rules and Spanish inheritance tax. A well-drafted Spanish will makes things much easier for your heirs; we can look at it with you.' },
        { q: 'How did Brexit change things for British owners?', a: 'Since the UK left the EU, British nationals are treated as third-country nationals for residence and some tax purposes. We can review how this affects you.' },
      ],
      validado: false,
    },
  },

  // ───────────────────────────────────────────────────────────── NIE
  nie: {
    es: {
      title: 'NIE para extranjeros: cómo obtenerlo en España',
      metaDescription:
        'Le ayudamos a obtener el NIE para comprar una vivienda, heredar, trabajar o abrir un negocio en España. Documentación, cita y seguimiento, también en inglés.',
      h1: 'NIE para extranjeros: cómo obtenerlo en España',
      lead: 'Preparamos su solicitud del NIE, le ayudamos con la cita y hacemos el seguimiento hasta que lo tenga. En español y en inglés.',
      busquedaPrincipal: 'obtener NIE extranjero',
      secciones: [
        {
          h2: 'Qué es el NIE y para qué lo necesita',
          parrafos: [
            'El NIE (número de identidad de extranjero) es el número personal que identifica a un extranjero ante las administraciones españolas. No es un permiso de residencia: es un número de identificación, y es imprescindible para casi cualquier operación con efectos económicos en España.',
            'Lo necesitará para comprar o vender una vivienda, aceptar una herencia, firmar ante notario, trabajar o darse de alta como autónomo, y para presentar sus impuestos en España.',
          ],
        },
        {
          h2: 'Cómo se solicita el NIE',
          parrafos: [
            'Se puede pedir en España, en la oficina de extranjería o la comisaría de policía que corresponda, o desde el extranjero, en el consulado español. Hay que justificar el motivo por el que se necesita (por ejemplo, la compra de una vivienda) y aportar la documentación de identidad y el pago de la tasa.',
            'El procedimiento, los formularios y la documentación concreta dependen de su nacionalidad, de dónde lo solicite y del motivo. Por eso conviene prepararlo bien antes de pedir la cita: un error suele obligar a empezar de nuevo.',
          ],
        },
        {
          h2: 'Cómo le ayudamos con su NIE',
          parrafos: [],
          lista: [
            { t: 'Revisión de su caso', d: 'Le decimos qué documentación necesita según su nacionalidad y el motivo de la solicitud.' },
            { t: 'Preparación de la solicitud', d: 'Rellenamos los formularios y dejamos lista la documentación y el justificante de la tasa.' },
            { t: 'Cita previa', d: 'Le ayudamos a conseguir la cita y le explicamos qué llevar el día de la presentación.' },
            { t: 'Seguimiento', d: 'Hacemos el seguimiento hasta que tenga su NIE, y le avisamos si falta algo.' },
          ],
        },
        {
          h2: 'Ciudadanos de la UE y de fuera de la UE',
          parrafos: [
            'Si es ciudadano de la Unión Europea y va a vivir en España más de tres meses, además del número tendrá que inscribirse en el registro de ciudadanos de la UE. Si es de fuera de la Unión (incluidos los británicos desde el Brexit) y va a residir aquí, su NIE irá ligado a la autorización de residencia y a la tarjeta que la acredita.',
            'Si solo va a comprar una vivienda o a heredar, sin vivir en España, le basta con el NIE. Lo revisamos con usted para no pedir más de lo necesario.',
          ],
        },
      ],
      faqs: [
        { q: '¿Puedo comprar una vivienda en España sin NIE?', a: 'No. El notario y el registro exigen el NIE del comprador, y lo necesitará también para pagar los impuestos de la compra.' },
        { q: '¿El NIE es lo mismo que la residencia?', a: 'No. El NIE es un número de identificación; la residencia es una autorización distinta. Puede tener NIE sin ser residente en España.' },
        { q: '¿Se puede pedir el NIE desde fuera de España?', a: 'Sí, en el consulado español de su país de residencia, aunque los plazos y requisitos varían de un consulado a otro.' },
        { q: '¿Puede otra persona solicitarlo por mí?', a: 'En algunos casos es posible hacerlo mediante un representante con poder. Depende de la oficina y del tipo de solicitud; lo revisamos con usted.' },
        { q: '¿El NIE caduca?', a: 'El número en sí se mantiene, pero algunos certificados y documentos asociados pueden tener una validez limitada para ciertos trámites. Le decimos qué necesita en cada caso.' },
      ],
      validado: false,
    },
    en: {
      title: 'How to get your NIE number in Spain | Serveco',
      metaDescription:
        'We help you get your NIE number to buy property, inherit, work or start a business in Spain. Documents, appointment and follow-up, all in English.',
      h1: 'How to get your NIE number in Spain',
      lead: 'We prepare your NIE application, help you get an appointment and follow it up until you have your number. All in English.',
      busquedaPrincipal: 'NIE number Spain',
      secciones: [
        {
          h2: 'What the NIE is and why you need it',
          parrafos: [
            'The NIE (número de identidad de extranjero) is the personal number that identifies a foreign national to the Spanish authorities. It is not a residence permit: it is an identification number, and you need it for almost anything with financial consequences in Spain.',
            'You will need it to buy or sell a property, accept an inheritance, sign before a notary, work or register as self-employed, and file your Spanish taxes.',
          ],
        },
        {
          h2: 'How to apply for an NIE',
          parrafos: [
            'You can apply in Spain, at the relevant foreigners’ office or police station, or from abroad, at a Spanish consulate. You have to show why you need it (for example, buying a home) and provide your identity documents and proof of payment of the fee.',
            'The exact procedure, forms and paperwork depend on your nationality, where you apply and why. It pays to get everything ready before you book the appointment: a mistake usually means starting again.',
          ],
        },
        {
          h2: 'How we help with your NIE',
          parrafos: [],
          lista: [
            { t: 'Checking your case', d: 'We tell you which documents you need for your nationality and the reason for the application.' },
            { t: 'Preparing the application', d: 'We fill in the forms and get the paperwork and fee receipt ready.' },
            { t: 'The appointment', d: 'We help you get an appointment and explain what to bring on the day.' },
            { t: 'Follow-up', d: 'We follow it up until you have your NIE and let you know if anything is missing.' },
          ],
        },
        {
          h2: 'EU and non-EU citizens',
          parrafos: [
            'If you are an EU citizen and will live in Spain for more than three months, you will also need to register as an EU citizen resident here. If you are from outside the EU (including British nationals since Brexit) and will live in Spain, your NIE will be linked to your residence authorisation and the card that proves it.',
            'If you are only buying a property or inheriting, without moving to Spain, the NIE is all you need. We check this with you so you do not apply for more than necessary.',
          ],
        },
      ],
      faqs: [
        { q: 'Can I buy a property in Spain without an NIE?', a: 'No. The notary and the land registry require the buyer’s NIE, and you will also need it to pay the taxes on the purchase.' },
        { q: 'Is an NIE the same as residency?', a: 'No. The NIE is an identification number; residency is a separate authorisation. You can have an NIE without being resident in Spain.' },
        { q: 'Can I apply for my NIE from the UK or elsewhere abroad?', a: 'Yes, at the Spanish consulate in your country of residence, although waiting times and requirements vary between consulates.' },
        { q: 'Can someone apply on my behalf?', a: 'In some cases it can be done through a representative with power of attorney. It depends on the office and the type of application; we can check this for you.' },
        { q: 'Does the NIE expire?', a: 'The number itself stays the same, but some related certificates may only be accepted for a limited time for certain procedures. We tell you what you need in each case.' },
      ],
      validado: false,
    },
  },

  // ───────────────────────────────────────────────────────────── IRNR
  'impuesto-no-residentes': {
    es: {
      title: 'Impuesto de no residentes (IRNR): asesoría y declaración',
      metaDescription:
        'Presentamos su impuesto de no residentes por tener una vivienda en España, alquilarla o venderla. Asesoría fiscal para propietarios extranjeros, también en inglés.',
      h1: 'Impuesto de no residentes (IRNR) para propietarios en España',
      lead:
        'Si vive fuera de España y tiene aquí una vivienda o ingresos, probablemente deba presentar el impuesto sobre la renta de no residentes. Nos ocupamos de hacerlo bien y a tiempo.',
      busquedaPrincipal: 'impuesto de no residentes',
      secciones: [
        {
          h2: 'Quién tiene que presentar el impuesto de no residentes',
          parrafos: [
            'El impuesto sobre la renta de no residentes (IRNR) grava las rentas que obtienen en España las personas que no son residentes fiscales aquí. En general, se considera residente a quien pasa en España más de 183 días al año o tiene aquí el centro de sus intereses; quien no cumple esas condiciones tributa como no residente por lo que obtiene en España.',
            'El caso más habitual es el del propietario extranjero de una vivienda en la costa. Pero también afecta a quien cobra alquileres, a quien vende un inmueble o a quien tiene otras rentas en España.',
          ],
        },
        {
          h2: 'Las tres situaciones más habituales de un propietario',
          parrafos: [],
          lista: [
            { t: 'Vivienda que usa usted o está vacía', d: 'Aunque no la alquile, la ley considera que obtiene una renta por tenerla, y hay que declararla cada año.' },
            { t: 'Vivienda alquilada', d: 'Los alquileres se declaran por los periodos que marca la normativa. Según su país de residencia, podrá deducir o no algunos gastos.' },
            { t: 'Venta de la vivienda', d: 'Al vender, el comprador debe retener una parte del precio a cuenta de su impuesto, y usted declara la ganancia o la pérdida. Después se regulariza la diferencia.' },
          ],
        },
        {
          h2: 'Cómo le ayudamos con el IRNR',
          parrafos: [],
          lista: [
            { t: 'Revisión de su situación', d: 'Comprobamos qué tiene que presentar, por qué inmuebles y rentas, y si hay ejercicios pendientes.' },
            { t: 'Declaraciones', d: 'Preparamos y presentamos sus declaraciones en plazo y le enviamos el justificante.' },
            { t: 'Venta de su vivienda', d: 'Calculamos la ganancia, revisamos la retención y tramitamos la devolución si procede.' },
            { t: 'Calendario', d: 'Le avisamos cada año de lo que toca presentar, para que no tenga que estar pendiente desde su país.' },
            { t: 'Regularización', d: 'Si hay años sin declarar, le explicamos cómo ponerse al día y lo tramitamos.' },
          ],
        },
        {
          h2: 'Doble imposición: su país y España',
          parrafos: [
            'Las rentas de su vivienda en España pueden tributar también en su país de residencia. Los convenios para evitar la doble imposición que España tiene firmados con muchos países reparten quién grava qué y cómo se evita pagar dos veces. Revisamos el que le corresponde y coordinamos, si hace falta, con su asesor en su país.',
          ],
        },
      ],
      faqs: [
        { q: '¿Tengo que declarar mi casa en España aunque no la alquile?', a: 'Normalmente sí. La normativa considera que la mera titularidad de una vivienda que no es su residencia habitual genera una renta que se declara cada año.' },
        { q: '¿Qué pasa si no he presentado el impuesto de años anteriores?', a: 'Se puede regularizar. Conviene hacerlo antes de que Hacienda lo requiera, y también antes de vender, porque se revisa en la operación.' },
        { q: '¿Puedo deducir gastos del alquiler?', a: 'Depende de su país de residencia: la normativa permite deducir determinados gastos a residentes de la UE y del Espacio Económico Europeo. Lo revisamos con usted.' },
        { q: '¿Necesito un representante fiscal en España?', a: 'En algunos casos la normativa lo exige y en otros es simplemente práctico. Le decimos si es su caso y podemos actuar como tal.' },
        { q: '¿Qué ocurre con la retención cuando vendo?', a: 'El comprador retiene una parte del precio y la ingresa a Hacienda a cuenta de su impuesto. Si la retención supera lo que le toca pagar, se puede solicitar la devolución.' },
      ],
      validado: false,
    },
    en: {
      title: 'Non-resident tax in Spain for property owners',
      metaDescription:
        'We file your Spanish non-resident income tax for owning, renting out or selling a property in Spain. English-speaking tax advisers for foreign homeowners.',
      h1: 'Non-resident tax in Spain for property owners',
      lead:
        'If you live outside Spain and own a home or earn income here, you probably need to file Spanish non-resident income tax. We make sure it is done properly and on time.',
      busquedaPrincipal: 'non-resident tax Spain',
      secciones: [
        {
          h2: 'Who has to file non-resident tax in Spain',
          parrafos: [
            'Non-resident income tax (IRNR) applies to income earned in Spain by people who are not Spanish tax residents. As a general rule, you are resident if you spend more than 183 days a year in Spain or your main interests are here; if not, you are taxed as a non-resident on what you earn in Spain.',
            'The most common case is a foreign owner of a holiday home on the coast. But it also covers rental income, selling a property and other income from Spain.',
          ],
        },
        {
          h2: 'The three most common situations for owners',
          parrafos: [],
          lista: [
            { t: 'A home you use yourself or leave empty', d: 'Even if you never rent it out, Spanish law treats owning it as generating income, and it has to be declared every year.' },
            { t: 'A home you rent out', d: 'Rental income is declared for the periods set by the rules. Depending on where you live, you may or may not deduct certain expenses.' },
            { t: 'Selling your home', d: 'When you sell, the buyer must withhold part of the price on account of your tax, and you declare the gain or loss. Any difference is then settled.' },
          ],
        },
        {
          h2: 'How we help with your non-resident tax',
          parrafos: [],
          lista: [
            { t: 'Reviewing your situation', d: 'We check what you need to file, for which properties and income, and whether any years are outstanding.' },
            { t: 'Filing your returns', d: 'We prepare and file your returns on time and send you the receipts.' },
            { t: 'Selling your property', d: 'We work out the gain, check the withholding and claim any refund due.' },
            { t: 'Your tax calendar', d: 'We remind you each year of what is due, so you do not have to keep track from abroad.' },
            { t: 'Catching up', d: 'If there are years you have not filed, we explain how to put things right and handle it for you.' },
          ],
        },
        {
          h2: 'Double taxation: your country and Spain',
          parrafos: [
            'Income from your Spanish home may also be taxed in the country where you live. The double tax treaties Spain has signed with many countries set out who taxes what and how to avoid paying twice. We check the one that applies to you and, if needed, coordinate with your adviser at home.',
          ],
        },
      ],
      faqs: [
        { q: 'Do I have to declare my Spanish home if I do not rent it out?', a: 'Usually yes. Spanish rules treat simply owning a home that is not your main residence as generating income, which is declared every year.' },
        { q: 'What if I have not filed for previous years?', a: 'It can be put right. It is better to do it before the tax office contacts you, and before you sell, because it will be checked at that point.' },
        { q: 'Can I deduct expenses from my rental income?', a: 'It depends on where you live: the rules allow residents of the EU and the European Economic Area to deduct certain expenses. We check your case.' },
        { q: 'Do I need a tax representative in Spain?', a: 'In some cases the rules require one; in others it is simply practical. We tell you whether it applies to you and can act as your representative.' },
        { q: 'What happens to the withholding when I sell?', a: 'The buyer withholds part of the price and pays it to the tax office on account of your tax. If it is more than you owe, you can claim a refund.' },
      ],
      validado: false,
    },
  },

  // ───────────────────────────────────────────────────────────── BENIDORM
  benidorm: {
    es: {
      title: 'Asesoría para extranjeros en Benidorm | Serveco',
      metaDescription:
        'Despacho en Benidorm para residentes extranjeros y no residentes: NIE, impuestos, herencias, compraventa de vivienda y negocios. Atención en español y en inglés.',
      h1: 'Asesoría para extranjeros en Benidorm',
      lead:
        'Nuestro despacho de Benidorm atiende a residentes extranjeros, a propietarios que viven fuera y a los negocios de la Costa Blanca, en español y en inglés.',
      busquedaPrincipal: 'asesoría para extranjeros en Benidorm',
      secciones: [
        {
          h2: 'Un despacho en la Costa Blanca para clientes internacionales',
          parrafos: [
            'Benidorm y la Marina Baixa concentran una de las mayores comunidades de residentes extranjeros y propietarios no residentes de España. Muchos llevan años aquí; otros vienen unos meses al año o gestionan su vivienda desde su país.',
            'Nuestro despacho de Benidorm está pensado para ellos: trámites y consultas en inglés, en persona cuando están aquí y a distancia cuando no.',
          ],
        },
        {
          h2: 'Qué resolvemos desde Benidorm',
          parrafos: [],
          lista: [
            { t: 'NIE y trámites de extranjería', d: 'Solicitud del NIE y orientación sobre residencia.' },
            { t: 'Impuesto de no residentes', d: 'Declaraciones por tener, alquilar o vender una vivienda en España.' },
            { t: 'Renta de residentes extranjeros', d: 'Declaración de la renta y cambio de residencia fiscal al instalarse en España.' },
            { t: 'Herencias y testamentos', d: 'Testamento español y tramitación de herencias con bienes en España.' },
            { t: 'Compraventa de vivienda', d: 'Acompañamiento fiscal y jurídico al comprar o vender.' },
            { t: 'Negocios de la costa', d: 'Hostelería, comercio y servicios: laboral, contabilidad e impuestos.' },
          ],
        },
        {
          h2: 'Negocios de hostelería y turismo en Benidorm',
          parrafos: [
            'Además de a particulares, asesoramos a hoteles, restaurantes y comercios de la zona, con sus picos de temporada, sus contrataciones y sus trabajadores de distintos países. La gestión laboral y fiscal la lleva el mismo equipo que en el resto de nuestros despachos.',
          ],
        },
        {
          h2: 'Cómo trabajamos',
          parrafos: [
            'Puede venir al despacho, llamarnos o escribirnos. Si vive fuera, preparamos casi todo a distancia y le vemos en persona cuando esté en Benidorm. Detrás del despacho está toda la estructura de Serveco desde 1977: fiscalistas, abogados y economistas que trabajan sobre el mismo expediente.',
          ],
        },
      ],
      faqs: [
        { q: '¿Atienden en inglés en el despacho de Benidorm?', a: 'Sí. Atendemos en español y en inglés, en persona, por teléfono y por correo.' },
        { q: '¿Tengo que ir al despacho para cada trámite?', a: 'No. La mayoría de las gestiones se preparan a distancia; puede venir cuando le venga bien o cuando haga falta firmar algo en persona.' },
        { q: '¿Llevan también la contabilidad de negocios de la zona?', a: 'Sí: contabilidad, impuestos y nóminas de hoteles, restaurantes, comercios y otros negocios de la Costa Blanca.' },
        { q: '¿Qué zonas atienden desde Benidorm?', a: 'Benidorm y la Marina Baixa, y cualquier cliente de la Costa Blanca o de fuera de España que prefiera tratar con este despacho.' },
      ],
      validado: false,
    },
    en: {
      title: 'English-speaking tax adviser in Benidorm | Serveco',
      metaDescription:
        'Our Benidorm office helps expats and non-resident owners with NIE numbers, Spanish tax, wills, inheritance, property and local businesses. In English.',
      h1: 'English-speaking tax and legal adviser in Benidorm',
      lead:
        'Our Benidorm office looks after foreign residents, owners who live abroad and local businesses on the Costa Blanca, in English and in Spanish.',
      busquedaPrincipal: 'English speaking tax adviser Benidorm',
      secciones: [
        {
          h2: 'An office on the Costa Blanca for international clients',
          parrafos: [
            'Benidorm and the Marina Baixa are home to one of the largest communities of foreign residents and non-resident owners in Spain. Some have lived here for years; others come for a few months a year or manage their property from home.',
            'Our Benidorm office is set up for them: paperwork and advice in English, face to face when you are here and remotely when you are not.',
          ],
        },
        {
          h2: 'What we handle from Benidorm',
          parrafos: [],
          lista: [
            { t: 'NIE and residence paperwork', d: 'NIE applications and guidance on residency.' },
            { t: 'Non-resident tax', d: 'Returns for owning, renting out or selling a Spanish home.' },
            { t: 'Tax returns for foreign residents', d: 'Your Spanish income tax return, and changing your tax residence when you settle here.' },
            { t: 'Wills and inheritance', d: 'A Spanish will and inheritance procedures involving Spanish assets.' },
            { t: 'Buying and selling property', d: 'Tax and legal support when you buy or sell.' },
            { t: 'Local businesses', d: 'Hospitality, retail and services: payroll, bookkeeping and tax.' },
          ],
        },
        {
          h2: 'Hospitality and tourism businesses in Benidorm',
          parrafos: [
            'As well as private clients, we advise hotels, restaurants and shops in the area, with their seasonal peaks, hiring and staff from many countries. Payroll and tax are handled by the same team that serves our other offices.',
          ],
        },
        {
          h2: 'How we work',
          parrafos: [
            'Drop in, call or email us. If you live abroad, we prepare almost everything remotely and see you in person when you are in Benidorm. Behind the office is the whole of Serveco, advising since 1977: tax advisers, lawyers and economists working on the same file.',
          ],
        },
      ],
      faqs: [
        { q: 'Do you speak English at the Benidorm office?', a: 'Yes. We work in English and Spanish, in person, on the phone and by email.' },
        { q: 'Do I have to come to the office for everything?', a: 'No. Most things can be prepared remotely; come in when it suits you or when something has to be signed in person.' },
        { q: 'Do you also do the books for local businesses?', a: 'Yes: bookkeeping, tax and payroll for hotels, restaurants, shops and other businesses on the Costa Blanca.' },
        { q: 'Which areas do you cover from Benidorm?', a: 'Benidorm and the Marina Baixa, plus any client on the Costa Blanca or abroad who prefers to deal with this office.' },
      ],
      validado: false,
    },
  },
};
