/**
 * Las 8 áreas del menú actual de serveco.es.
 * En Supabase será la tabla `service_areas`.
 *
 * PENDIENTE (PLAN-ARRANQUE-WEB.md §1):
 *  - slug "juridico" (menú actual) o "legal" (informe Rafael / plan). Cambiar aquí basta.
 *  - Los puntos de "incluye" son redacción de Eskala: que los valide Rafael.
 */
export type Area = {
  slug: string;
  slugEn: string;
  nombre: string;
  nombreEn: string;
  grupo: 'empresa' | 'personas' | 'crecimiento';
  resumen: string;
  resumenEn: string;
  intro: string;
  incluye: string[];
};

export const AREAS: Area[] = [
  {
    slug: 'fiscal',
    slugEn: 'tax',
    nombre: 'Fiscal',
    nombreEn: 'Tax',
    grupo: 'empresa',
    resumen: 'Sociedades, IRPF, IVA, planificación fiscal, sucesiones y no residentes.',
    resumenEn: 'Corporate tax, personal income tax, VAT, tax planning, inheritance and non-residents.',
    intro:
      'Llevamos la fiscalidad de empresas, autónomos y particulares, y la coordinamos con la contabilidad y el área laboral para que no haya sorpresas al cierre.',
    incluye: [
      'Impuesto de sociedades e IVA',
      'IRPF de autónomos y particulares',
      'Planificación fiscal y operaciones societarias',
      'Herencias, donaciones y empresa familiar',
      'No residentes (IRNR)',
    ],
  },
  {
    slug: 'laboral',
    slugEn: 'employment',
    nombre: 'Laboral',
    nombreEn: 'Employment',
    grupo: 'personas',
    resumen: 'Nóminas, seguros sociales, contratos, despidos e inspecciones de trabajo.',
    resumenEn: 'Payroll, social security, contracts, dismissals and labour inspections.',
    intro:
      'Gestionamos el día a día laboral de su plantilla y le acompañamos cuando hay que contratar, despedir o atender una inspección.',
    incluye: [
      'Nóminas y seguros sociales',
      'Contratos y altas',
      'Despidos y finiquitos',
      'Inspecciones de trabajo',
    ],
  },
  {
    slug: 'juridico',
    slugEn: 'legal',
    nombre: 'Jurídico',
    nombreEn: 'Legal',
    grupo: 'personas',
    resumen: 'Mercantil, civil, contratación, reclamaciones y procedimientos judiciales.',
    resumenEn: 'Corporate, civil, contracts, claims and court proceedings.',
    intro:
      'Asesoramiento jurídico para empresas y particulares: contratos, sociedades, reclamaciones y defensa de sus intereses.',
    incluye: [
      'Mercantil y societario',
      'Redacción y revisión de contratos',
      'Reclamaciones extrajudiciales',
      'Procedimientos judiciales',
    ],
  },
  {
    slug: 'contable',
    slugEn: 'accounting',
    nombre: 'Contable',
    nombreEn: 'Accounting',
    grupo: 'empresa',
    resumen: 'Contabilidad, cuentas anuales, libros oficiales y cierre del ejercicio.',
    resumenEn: 'Bookkeeping, annual accounts, statutory books and year-end closing.',
    intro:
      'Mantenemos su contabilidad al día para que sepa cómo va la empresa durante el año, no solo en el cierre.',
    incluye: ['Contabilidad', 'Cuentas anuales', 'Libros oficiales', 'Cierre del ejercicio'],
  },
  {
    slug: 'financiero',
    slugEn: 'financial',
    nombre: 'Financiero',
    nombreEn: 'Financial',
    grupo: 'empresa',
    resumen: 'Financiación, viabilidad, presupuestos y cuadros de mando con los sistemas A.D.',
    resumenEn: 'Financing, feasibility, budgets and dashboards with our A.D. systems.',
    intro:
      'Analizamos la salud financiera de su empresa con nuestros propios sistemas A.D.I, A.D.P y A.D.A.',
    incluye: [
      'A.D.I · Análisis Dinámico Intermensual',
      'A.D.P · Análisis Dinámico Presupuestario',
      'A.D.A · Análisis Dinámico Analítico',
      'Financiación y planes de viabilidad',
    ],
  },
  {
    slug: 'auditoria',
    slugEn: 'audit',
    nombre: 'Auditoría',
    nombreEn: 'Audit',
    grupo: 'empresa',
    resumen: 'Auditoría de cuentas anuales y otros informes de revisión.',
    resumenEn: 'Statutory audit of annual accounts and other review reports.',
    intro: 'Emitimos informes de auditoría de cuentas y trabajos de revisión.',
    incluye: ['Auditoría de cuentas anuales', 'Informes de revisión'],
  },
  {
    slug: 'idi-patent-box',
    slugEn: 'rd-patent-box',
    nombre: 'I+D+i y Patent Box',
    nombreEn: 'R&D and Patent Box',
    grupo: 'crecimiento',
    resumen: 'Deducciones fiscales por innovación con análisis de cada proyecto.',
    resumenEn: 'Tax deductions for innovation, analysed project by project.',
    intro:
      'Estudiamos si sus proyectos pueden aplicar las deducciones por I+D+i y el Patent Box, y preparamos la documentación.',
    incluye: ['Análisis de proyectos', 'Deducciones por I+D+i', 'Patent Box'],
  },
  {
    slug: 'formacion',
    slugEn: 'training',
    nombre: 'Formación',
    nombreEn: 'Training',
    grupo: 'personas',
    resumen: 'Cursos para su plantilla, 100 % bonificables.',
    resumenEn: 'Training courses for your staff, fully subsidised.',
    intro: 'Organizamos formación para su plantilla con cargo al crédito de formación de la empresa.',
    incluye: ['Cursos 100 % bonificables', 'Gestión del crédito de formación'],
  },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

export function getAreaEn(slugEn: string): Area | undefined {
  return AREAS.find((a) => a.slugEn === slugEn);
}
