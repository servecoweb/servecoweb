/**
 * CONTENIDO SEO de la página de servicios (hub) /es/servicios y /en/services.
 * Búsqueda: «servicios de asesoría integral para empresas» (no compite con home, áreas ni ficha de Murcia).
 * Pieza propia: GUÍA «¿Qué necesita?» con situaciones reales → área o página que existe (cero huérfanos).
 * Redacción de Eskala (25 sep 2026) · validado: false.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';
import { getArea } from '@/data/areas';
import { ES, EN } from '@/lib/rutas';

/** Enlace EN de un área a partir de su slug español (así nunca se rompe si cambia un slugEn). */
const areaEn = (slug: string) => EN.area(getArea(slug)?.slugEn ?? slug);

export type Situacion = { situacion: string; destino: string; href: string };

export const HUB_SEO: Record<'es' | 'en', PaginaSeo & { guia: Situacion[] }> = {
  es: {
    title: 'Servicios de asesoría integral para empresas | Serveco',
    metaDescription:
      'Fiscal, laboral, jurídico, contable, financiero, auditoría, I+D+i y formación coordinados sobre el mismo expediente. Asesoría integral de empresas desde 1977.',
    h1: 'Servicios de asesoría integral para empresas',
    lead: 'Ocho áreas que trabajan sobre el mismo expediente, más subvenciones, creación de empresas y servicios para clientes internacionales.',
    busquedaPrincipal: 'asesoría integral para empresas',
    guia: [
      { situacion: 'Quiero crear una empresa o darme de alta como autónomo', destino: 'Punto PAE', href: ES.pae },
      { situacion: 'Voy a contratar, despedir o me ha llegado una inspección de trabajo', destino: 'Asesoría laboral', href: ES.area('laboral') },
      { situacion: 'Me ha llegado un requerimiento de Hacienda', destino: 'Asesoría fiscal', href: ES.area('fiscal') },
      { situacion: 'Quiero pagar los impuestos justos y planificar el cierre del año', destino: 'Asesoría fiscal', href: ES.area('fiscal') },
      { situacion: 'Necesito tener la contabilidad al día y las cuentas anuales', destino: 'Contabilidad', href: ES.area('contable') },
      { situacion: 'Un cliente no me paga o tengo un conflicto con un socio', destino: 'Asesoría jurídica', href: ES.area('juridico') },
      { situacion: 'Voy a invertir o necesito financiación del banco', destino: 'Asesoramiento financiero', href: ES.area('financiero') },
      { situacion: 'Busco ayudas públicas para un proyecto', destino: 'Subvenciones', href: ES.subvenciones },
      { situacion: 'Mi empresa innova y quiero aprovechar las deducciones', destino: 'I+D+i y Patent Box', href: ES.area('idi-patent-box') },
      { situacion: 'Mi empresa supera los límites y debe auditar sus cuentas', destino: 'Auditoría', href: ES.area('auditoria') },
      { situacion: 'Quiero formar a mi plantilla sin coste', destino: 'Formación bonificada', href: ES.area('formacion') },
      { situacion: 'Vivo fuera o soy extranjero y tengo una vivienda en España', destino: 'Internacional', href: ES.internacional },
    ],
    secciones: [
      {
        h2: 'Una asesoría integral: todas las áreas sobre el mismo expediente',
        parrafos: [
          'La mayoría de las decisiones de una empresa tocan varias áreas a la vez. Un despido tiene una parte laboral, otra jurídica y otra fiscal; una inversión afecta a la contabilidad, a los impuestos y a la financiación; una herencia en la empresa familiar mezcla derecho, fiscalidad y organización.',
          'En Serveco esas áreas trabajan juntas sobre el mismo expediente. Usted trata con una persona de referencia y nosotros nos coordinamos por dentro, para que nada se quede entre dos asesores que no hablan entre sí.',
        ],
      },
      {
        h2: 'Para empresas, autónomos y particulares',
        parrafos: [
          'Trabajamos sobre todo con pymes y empresas familiares de la Región de Murcia y la Costa Blanca, de sectores como el agroalimentario, el vino, el mueble, el transporte, la construcción, el comercio o la hostelería. También con autónomos y profesionales, y con particulares en sus impuestos, herencias y patrimonio.',
        ],
      },
      {
        h2: 'Seis despachos y el mismo equipo',
        parrafos: [
          'Tenemos despachos en Murcia, Yecla, Jumilla, Lorca, Balsicas y Benidorm. Todos los servicios se prestan desde cualquiera de ellos, y muchas gestiones se resuelven a distancia.',
        ],
      },
    ],
    faqs: [
      { q: '¿Tengo que contratar todas las áreas?', a: 'No. Puede empezar por la que necesite hoy; si más adelante hace falta otra, se incorpora sobre el mismo expediente.' },
      { q: '¿Cómo sé qué área necesito?', a: 'Use la guía de esta página o cuéntenos su caso en una consulta: la dirigimos nosotros a la persona adecuada.' },
      { q: '¿Atienden a empresas de toda España?', a: 'Nuestra base está en la Región de Murcia y la Costa Blanca, pero trabajamos con empresas de otras zonas cuando el asunto se puede llevar a distancia.' },
      { q: '¿Cómo es la primera reunión?', a: 'Nos cuenta su situación, revisamos lo urgente y le proponemos cómo trabajar y qué incluye. Puede ser en el despacho o por videollamada.' },
    ],
    validado: false,
  },
  en: {
    title: 'Business advisory services in Spain, in English | Serveco',
    metaDescription:
      'Tax, payroll, legal, accounting, financial, audit, R&D and training services in Spain, coordinated on one file and explained in English. Since 1977.',
    h1: 'Business advisory services in Spain',
    lead: 'Eight areas working on the same file, plus grants, company formation and services for non-residents and expats. In English.',
    busquedaPrincipal: 'business advisory services Spain',
    guia: [
      { situacion: 'I live abroad and own a home in Spain', destino: 'Non-residents and expats', href: EN.international },
      { situacion: 'I need an NIE number', destino: 'NIE number', href: EN.intl('nie-number') },
      { situacion: 'I rent out or am selling my Spanish property', destino: 'Non-resident tax', href: EN.intl('non-resident-tax') },
      { situacion: 'I run a business in Spain and need an accountant', destino: 'Accounting', href: areaEn('contable') },
      { situacion: 'I need someone to handle my Spanish taxes', destino: 'Tax advice', href: areaEn('fiscal') },
      { situacion: 'I am hiring staff or need payroll', destino: 'Payroll and employment', href: areaEn('laboral') },
      { situacion: 'I need a contract, a will or to recover a debt', destino: 'Legal advice', href: areaEn('juridico') },
      { situacion: 'I am investing or need bank finance', destino: 'Financial advice', href: areaEn('financiero') },
      { situacion: 'My company develops new products or software', destino: 'R&D tax credits', href: areaEn('idi-patent-box') },
    ],
    secciones: [
      {
        h2: 'One firm, every area, on the same file',
        parrafos: [
          'Most business decisions touch several areas at once. Selling a property has a tax, a legal and a notary side; hiring has employment and tax consequences; an inheritance mixes law, tax and family matters.',
          'At Serveco these areas work together on the same file. You deal with one person, in English, and we coordinate everything internally.',
        ],
      },
      {
        h2: 'For businesses, freelancers and private clients',
        parrafos: [
          'We mainly work with small and family businesses in the Region of Murcia and on the Costa Blanca, with self-employed professionals, with foreign-owned companies operating in Spain, and with non-residents and expats who own property here.',
        ],
      },
      {
        h2: 'Six offices, one team',
        parrafos: [
          'Our offices are in Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm. Every service is available at all of them, and much can be handled remotely if you live abroad.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I have to use all your services?', a: 'No. Start with what you need now; if you need another area later, it is added to the same file.' },
      { q: 'How do I know which service I need?', a: 'Use the guide on this page or tell us about your situation, and we will pass it to the right person.' },
      { q: 'Can everything be done in English?', a: 'Yes. We deal with you in English by email, phone, video call or in person, and handle the Spanish paperwork for you.' },
    ],
    validado: false,
  },
};
