/**
 * CONTENIDO SEO DE LAS 8 ÁREAS EN INGLÉS (/en/services/[area]). Plantilla: PLAN-SEO-PAGINAS.md § 3.1.
 * NO es traducción de areas-seo.ts: está escrito para quien busca en inglés (empresas extranjeras con actividad
 * en España, residentes extranjeros con negocio, propietarios internacionales). Búsquedas tipo
 * «English-speaking accountant in Murcia», «tax adviser Spain». Mismas reglas: sin cifras ni plazos, sin consejo
 * personalizado, H2 descriptivos, FAQs distintas de los H2. Redacción de Eskala (25 sep 2026) · validado: false.
 */
import type { PaginaSeo } from '@/components/ContenidoSeo';

const OFFICES = 'Murcia, Yecla, Jumilla, Lorca, Balsicas and Benidorm';

export const AREAS_SEO_EN: Record<string, PaginaSeo & { relacionadas: string[] }> = {
  fiscal: {
    title: 'English-speaking tax adviser in Spain | Serveco',
    metaDescription:
      'Tax advice in English for companies, freelancers and individuals in Spain: corporate tax, VAT, income tax and tax planning. Six offices in Murcia and Alicante.',
    h1: 'English-speaking tax advisers in Spain',
    lead:
      'We handle the Spanish taxes of companies, self-employed professionals and private clients, and explain them in English, from our offices in the Region of Murcia and on the Costa Blanca.',
    busquedaPrincipal: 'English-speaking tax adviser Spain',
    secciones: [
      {
        h2: 'Spanish tax, explained in English',
        parrafos: [
          'The Spanish tax system has its own forms, deadlines and logic, and getting it wrong is expensive. We take care of your returns and, just as importantly, explain what you are signing and why, in English.',
          'Because tax, accounting, payroll and legal work sit in the same firm, nothing falls between the cracks: the figures in your returns come from the books we keep, and any decision with tax consequences is reviewed before it is made.',
        ],
      },
      {
        h2: 'Tax services for companies and individuals',
        parrafos: [],
        lista: [
          { t: 'Corporate tax', d: 'Preparation and filing, with a review of the year before closing to apply any available incentives.' },
          { t: 'VAT and withholdings', d: 'Quarterly returns, annual summaries, intra-EU operations and special schemes.' },
          { t: 'Income tax', d: 'Returns for the self-employed and for individuals resident in Spain.' },
          { t: 'Tax planning', d: 'Before year end, before an investment, or when you restructure or sell.' },
          { t: 'Non-residents', d: 'Non-resident income tax for property owners who live abroad.' },
          { t: 'Tax inspections', d: 'Replies to requests from the Spanish tax office and support during inspections.' },
        ],
      },
      {
        h2: 'Foreign-owned companies and expats in business',
        parrafos: [
          'Many of our international clients run a business in Spain while their owners, partners or head office are abroad. We act as their local tax team: we keep them compliant, report back in English and coordinate with their advisers at home when there are cross-border questions.',
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: [
          `Advising businesses in Spain since 1977, with more than thirty professionals and offices in ${OFFICES}. One point of contact, in English, backed by the whole firm.`,
        ],
      },
    ],
    faqs: [
      { q: 'Can you file my Spanish taxes if I only speak English?', a: 'Yes. We deal with you in English and handle the Spanish paperwork with the tax office.' },
      { q: 'I have just moved to Spain. When do I become a tax resident?', a: 'As a general rule, when you spend more than 183 days a year in Spain or your main interests are here. The exact position depends on your case, so it is worth reviewing when you move.' },
      { q: 'Do you work with companies whose owners live abroad?', a: 'Yes. We act as the local tax and accounting team and report to the owners in English.' },
      { q: 'Can you coordinate with my accountant in the UK or elsewhere?', a: 'Yes. For cross-border questions we work with your adviser abroad so both sides are aligned.' },
    ],
    relacionadas: ['contable', 'laboral', 'juridico'],
    validado: false,
  },

  laboral: {
    title: 'Payroll and employment advice in Spain | Serveco',
    metaDescription:
      'Payroll, employment contracts, dismissals and labour inspections in Spain, explained in English. Employment advice for companies in Murcia and Alicante.',
    h1: 'Payroll and employment advice in Spain',
    lead:
      'We run your payroll and guide you through Spanish employment law: which contract to use, how to handle a dismissal and what to do if the labour inspectorate calls. In English.',
    busquedaPrincipal: 'payroll and employment advice Spain',
    secciones: [
      {
        h2: 'Spanish employment law without surprises',
        parrafos: [
          'Spanish employment rules are detailed and strict: each sector has its collective agreement, contracts must match the job, working hours have to be recorded and dismissals follow set procedures. A mistake can cost far more than getting advice first.',
          'We handle your monthly payroll and social security, and we are there before you hire, change conditions or let someone go.',
        ],
      },
      {
        h2: 'Employment and payroll services',
        parrafos: [],
        lista: [
          { t: 'Payroll and social security', d: 'Monthly payslips, contributions and withholdings.' },
          { t: 'Hiring', d: 'Choosing the right contract, registrations and notifications.' },
          { t: 'Collective agreements', d: 'Applying your sector’s agreement: pay scales, hours and holidays.' },
          { t: 'Dismissals', d: 'Dismissal letters, final settlements and conciliation.' },
          { t: 'Labour inspections', d: 'Preparing the documents and supporting you throughout.' },
          { t: 'Foreign staff', d: 'Hiring employees from outside the EU and their authorisations.' },
        ],
      },
      {
        h2: 'Seasonal businesses and international teams',
        parrafos: [
          'Hotels, restaurants, farms and packing warehouses in our area hire heavily in season and often employ people of many nationalities. We manage those peaks and the paperwork for foreign workers, so your business stays compliant.',
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: [
          'Our employment team works alongside our lawyers and tax advisers: if a dismissal ends up in court, or a hire has tax implications, the same firm handles it. Since 1977, with offices across the Region of Murcia and in Benidorm.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need to record my employees’ working hours in Spain?', a: 'Yes, keeping a record of working hours is mandatory and is one of the first things checked in an inspection. We help you set up a simple system.' },
      { q: 'Which contract should I use for seasonal staff?', a: 'It depends on whether the need repeats every year or is one-off. We review your case before you hire.' },
      { q: 'Can you hire staff from outside the EU for my business?', a: 'Yes, together with our legal team, including the authorisations they need.' },
      { q: 'I run a small business with one employee. Can you do my payroll?', a: 'Yes. We work with businesses of every size, from a first employee to large teams.' },
    ],
    relacionadas: ['juridico', 'fiscal', 'formacion'],
    validado: false,
  },

  juridico: {
    title: 'English-speaking business lawyers in Murcia | Serveco',
    metaDescription:
      'Corporate law, contracts, debt recovery, wills and inheritance in Spain, in English. Business lawyers across our six offices in Murcia and Alicante, working with your tax advisers.',
    h1: 'English-speaking business lawyers in Spain',
    lead:
      'Contracts, companies, debt recovery and, when needed, court proceedings, plus wills and inheritance for private clients. In English, and alongside your tax and payroll team.',
    busquedaPrincipal: 'English-speaking lawyer Murcia',
    secciones: [
      {
        h2: 'Legal advice that prevents problems',
        parrafos: [
          'Most legal problems in business can be avoided with a good contract or the right decision at the right time: articles of association that cover what happens if a partner leaves, supplier contracts that make responsibilities clear, or a claim made before a debt becomes unrecoverable.',
          'That is where our legal team focuses, without losing sight of defending you when a dispute is already under way.',
        ],
      },
      {
        h2: 'Legal services for businesses and private clients',
        parrafos: [],
        lista: [
          { t: 'Company law', d: 'Setting up companies, shareholder meetings, directors and shareholder agreements.' },
          { t: 'Contracts', d: 'Drafting and reviewing contracts with clients, suppliers, distributors and partners.' },
          { t: 'Debt recovery', d: 'Formal demands and, if needed, court claims to get paid.' },
          { t: 'Family businesses', d: 'Family protocols, partner agreements and succession planning.' },
          { t: 'Wills and inheritance', d: 'Spanish wills and inheritance procedures, including for non-residents.' },
          { t: 'Litigation', d: 'Representing you in civil and commercial proceedings.' },
        ],
      },
      {
        h2: 'For international clients',
        parrafos: [
          'If you own property or a business in Spain but live abroad, we explain Spanish legal procedures in English and coordinate the tax side, so you are not left dealing with two firms that do not talk to each other.',
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: [
          'Almost no business legal issue is purely legal: a partner leaving has tax effects, a dismissal has an employment side, a debt affects your accounts. Our lawyers work on the same file as our economists and employment advisers. Since 1977.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I need a Spanish will if I already have one in my country?', a: 'It is often advisable to have a Spanish will covering your assets in Spain: it makes things much easier for your heirs. We review your situation.' },
      { q: 'Can you review a contract in English and Spanish?', a: 'Yes. We review the Spanish version, which is the one that usually counts before Spanish courts, and explain it to you in English.' },
      { q: 'How do I recover an unpaid invoice in Spain?', a: 'Usually with a formal demand first and, if that fails, one of the court procedures designed for debt claims. We tell you which fits your case.' },
      { q: 'Can you set up a Spanish company for a foreign owner?', a: 'Yes, including the NIE, the articles of association and the registrations, and we coordinate the tax and accounting from day one.' },
    ],
    relacionadas: ['fiscal', 'laboral', 'contable'],
    validado: false,
  },

  contable: {
    title: 'English-speaking accountant in Murcia and Alicante',
    metaDescription:
      'Bookkeeping, annual accounts and year-end closing for companies and freelancers in Spain, explained in English. Accountants in Murcia and Benidorm.',
    h1: 'English-speaking accountants in Murcia and Alicante',
    lead:
      'We keep your books up to date so you know how your business is doing during the year, not only at the end of it, and we prepare and file your annual accounts. In English.',
    busquedaPrincipal: 'English-speaking accountant Murcia',
    secciones: [
      {
        h2: 'Accounting that tells you how your business is doing',
        parrafos: [
          'Bookkeeping is a legal requirement in Spain, but it is also the best management tool you have. Kept up to date, it tells you at any moment whether you are making money, who owes you and how much cash you will have in three months.',
          'And your taxes come from your books: if the accounts are wrong, the returns will be too.',
        ],
      },
      {
        h2: 'Accounting services',
        parrafos: [],
        lista: [
          { t: 'Bookkeeping', d: 'Recording invoices, bank movements and other operations as often as you need.' },
          { t: 'Management reports', d: 'Balance sheet and profit and loss during the year, explained in English.' },
          { t: 'Year-end closing', d: 'Adjustments, depreciation and a final review before corporate tax.' },
          { t: 'Annual accounts', d: 'Preparation and filing with the Companies Register.' },
          { t: 'Statutory books', d: 'Legalisation of the company’s mandatory books.' },
          { t: 'Freelancers', d: 'Income, expense and asset registers for the self-employed.' },
        ],
      },
      {
        h2: 'Reporting to owners abroad',
        parrafos: [
          'If your company’s owners or head office are outside Spain, we send them the figures they need in English, on the schedule you agree, and answer their questions directly.',
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: [
          'Our own analysis systems (A.D.I, A.D.P and A.D.A) turn your accounts into month-by-month management information. Accounting and tax are done by the same team. Since 1977.',
        ],
      },
    ],
    faqs: [
      { q: 'Do Spanish companies have to file annual accounts?', a: 'Yes. Companies must approve their annual accounts and file them with the Companies Register within the legal deadlines. We prepare and file them.' },
      { q: 'Can you take over the books from my current accountant?', a: 'Yes. We review what we receive, fix anything that needs correcting and carry on from there.' },
      { q: 'Can I receive the reports in English?', a: 'Yes. We explain your figures in English and can send summaries in English to owners abroad.' },
      { q: 'How often do I need to send you my documents?', a: 'We agree it with you, monthly or quarterly, depending on your volume and the information you want.' },
    ],
    relacionadas: ['fiscal', 'financiero', 'auditoria'],
    validado: false,
  },

  financiero: {
    title: 'Financial advice for companies in Spain | Serveco',
    metaDescription:
      'Financing, business plans, budgets and management dashboards for companies in Spain, with Serveco’s own A.D. analysis systems. In English.',
    h1: 'Financial advice for companies in Spain',
    lead:
      'We analyse your company’s financial health with our own A.D. systems and help you raise finance, prepare budgets and make investment decisions with real numbers.',
    busquedaPrincipal: 'financial advice for companies Spain',
    secciones: [
      {
        h2: 'Financial analysis built for small and medium businesses',
        parrafos: [
          'Financial advice answers the questions accounting alone does not: can I afford this investment, which customers and products actually make money, how much cash will I need next year, what is the right way to fund growth?',
        ],
      },
      {
        h2: 'Serveco’s A.D. systems',
        parrafos: ['Three analysis tools developed by Serveco for its clients:'],
        lista: [
          { t: 'A.D.I · Monthly dynamic analysis', d: 'A month-by-month diagnosis of the business, to spot deviations early.' },
          { t: 'A.D.P · Budget analysis', d: 'Projections over one or several years to decide on investment and funding.' },
          { t: 'A.D.A · Cost analysis', d: 'Costs, selling prices, stock and margins by product or activity.' },
        ],
      },
      {
        h2: 'Financing, grants and business plans',
        parrafos: [],
        lista: [
          { t: 'Bank financing', d: 'Preparing what the banks ask for and supporting the negotiation.' },
          { t: 'Business and viability plans', d: 'For new projects, expansions or businesses going through a difficult time.' },
          { t: 'Grants', d: 'Finding and applying for public funding that fits your project.' },
          { t: 'Business valuation', d: 'For sales, partners joining or leaving, and succession.' },
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: [
          'Our financial analysis builds on the accounts and tax work we already do for you, so there is no need to start from scratch. Our tools are our own, designed for SMEs. Since 1977.',
        ],
      },
    ],
    faqs: [
      { q: 'What do Spanish banks ask for when a company applies for a loan?', a: 'Usually the last years’ accounts, the current position and a forecast showing how the loan will be repaid. We help you present it clearly.' },
      { q: 'Can you help a foreign investor assess a Spanish business?', a: 'Yes, with a financial review and, if needed, a valuation, explained in English.' },
      { q: 'Are there grants for my business in Spain?', a: 'Often there are, at regional, national or EU level. We check which calls fit your project and help you apply.' },
    ],
    relacionadas: ['contable', 'fiscal', 'idi-patent-box'],
    validado: false,
  },

  auditoria: {
    title: 'Statutory audit of annual accounts in Spain | Serveco',
    metaDescription:
      'Audit of annual accounts for companies in Spain, whether required by law or voluntary, and other review reports. Explained in English.',
    h1: 'Audit of annual accounts in Spain',
    lead:
      'We audit the annual accounts of companies that are legally required to be audited and of those that choose to, and we issue other review reports that banks, partners or authorities may ask for.',
    busquedaPrincipal: 'statutory audit Spain',
    secciones: [
      {
        h2: 'What an audit is for',
        parrafos: [
          'An audit is an independent review of a company’s annual accounts to give an opinion on whether they give a true and fair view. The report gives confidence to partners, banks, customers and authorities, and to foreign owners who need assurance on their Spanish subsidiary.',
        ],
      },
      {
        h2: 'Which companies must be audited in Spain',
        parrafos: [
          'Spanish law requires an audit for companies that exceed certain size thresholds (assets, turnover and number of employees) for two consecutive years, and for other entities because of their activity or the public funding they receive. A minority shareholder can also request one in some cases.',
        ],
      },
      {
        h2: 'Audit and review work',
        parrafos: [],
        lista: [
          { t: 'Statutory audit', d: 'For companies above the legal thresholds.' },
          { t: 'Voluntary audit', d: 'To reassure banks, investors, partners or a foreign parent company.' },
          { t: 'Review reports', d: 'Agreed-upon procedures and reviews requested by third parties.' },
          { t: 'Grant audits', d: 'Justifying public funding when the call requires it.' },
        ],
      },
    ],
    faqs: [
      { q: 'Can the same firm keep my books and audit them?', a: 'No. Auditors must be independent from whoever prepares the accounts, so each engagement is organised to respect those rules.' },
      { q: 'Our parent company abroad needs our Spanish accounts audited. Can you help?', a: 'Yes. We carry out voluntary audits and can report in English.' },
      { q: 'When should the audit start?', a: 'Ideally it is planned before the year end, so the report is ready when the accounts have to be approved.' },
    ],
    relacionadas: ['contable', 'financiero', 'fiscal'],
    validado: false,
  },

  'idi-patent-box': {
    title: 'R&D tax credits and Patent Box in Spain | Serveco',
    metaDescription:
      'Spanish R&D and innovation tax credits and the Patent Box regime: project analysis, documentation and support, explained in English.',
    h1: 'R&D tax credits and Patent Box in Spain',
    lead:
      'Many companies innovate without knowing they can claim tax credits for it. We analyse your projects, tell you which qualify and prepare the documentation to claim them safely.',
    busquedaPrincipal: 'R&D tax credits Spain',
    secciones: [
      {
        h2: 'The Spanish R&D and innovation tax credit',
        parrafos: [
          'Spanish corporate tax includes an incentive for companies that invest in research and development or technological innovation. You do not need to be a large company or have a laboratory: new products, improved processes or software development may qualify if they meet the requirements.',
        ],
      },
      {
        h2: 'The Patent Box regime',
        parrafos: [
          'The Patent Box reduces the tax on income a company earns from licensing or exploiting certain intangible assets, such as patents or protected software. It can be very attractive for companies that have developed their own technology.',
        ],
      },
      {
        h2: 'How we work',
        parrafos: [],
        lista: [
          { t: 'Project analysis', d: 'We review your projects from a technical and tax perspective and tell you which may qualify.' },
          { t: 'Documentation', d: 'We prepare the technical report and the evidence of the costs.' },
          { t: 'Legal certainty', d: 'We advise you on the options available to claim the credit safely.' },
          { t: 'Claiming the credit', d: 'We coordinate the credit with your corporate tax return.' },
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: ['Our team includes engineers as well as economists and lawyers, so we can assess the technical and the tax side of a project together, which is exactly what this incentive requires.'],
      },
    ],
    faqs: [
      { q: 'Can a small company claim R&D tax credits in Spain?', a: 'Yes. Size is not a requirement: what matters is that the project meets the conditions for R&D or technological innovation.' },
      { q: 'What is the difference between R&D and technological innovation?', a: 'R&D aims at substantially new knowledge or products; innovation at significant improvements to existing ones. They are treated differently, so they need to be classified correctly.' },
      { q: 'Can I claim the credit if the company makes a loss?', a: 'There are options to use the credit in later years or in certain conditions. We look at your case.' },
    ],
    relacionadas: ['fiscal', 'financiero', 'contable'],
    validado: false,
  },

  formacion: {
    title: 'Subsidised staff training in Spain (FUNDAE) | Serveco',
    metaDescription:
      'Use your company’s training credit in Spain: we organise courses for your staff and handle the FUNDAE paperwork. Explained in English.',
    h1: 'Subsidised staff training in Spain',
    lead:
      'Your company has a yearly credit to train its staff. We help you use it: we organise the courses and handle all the paperwork.',
    busquedaPrincipal: 'subsidised training Spain FUNDAE',
    secciones: [
      {
        h2: 'Your company’s training credit',
        parrafos: [
          'Companies in Spain that pay vocational training contributions have a yearly credit to train their employees. The credit is recovered through a reduction in social security contributions, so training can cost the company very little or nothing.',
          'Many companies never use it because they do not know it exists or because of the paperwork. We take care of that.',
        ],
      },
      {
        h2: 'Training management services',
        parrafos: [],
        lista: [
          { t: 'Credit calculation', d: 'We tell you how much credit your company has this year.' },
          { t: 'Training plan', d: 'We suggest useful courses for your staff and your sector, including languages.' },
          { t: 'FUNDAE paperwork', d: 'Start and end notifications, documents and control of the reduction.' },
          { t: 'Payroll coordination', d: 'We apply the reduction together with your payroll.' },
        ],
      },
      {
        h2: 'Why Serveco',
        parrafos: ['The reduction is applied to your social security contributions, so it works best when training and payroll are coordinated by the same team.'],
      },
    ],
    faqs: [
      { q: 'What is FUNDAE?', a: 'The Spanish State Foundation for Training in Employment, the body through which companies manage subsidised training.' },
      { q: 'What happens if we do not use the credit?', a: 'In general, unused credit is lost at the end of the year, with some options for small companies. That is why it pays to plan training early.' },
      { q: 'Can the courses be online?', a: 'Yes, courses can be face to face, online or mixed.' },
    ],
    relacionadas: ['laboral', 'financiero'],
    validado: false,
  },
};
