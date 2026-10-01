/**
 * Equipo publicado en serveco.es/nuestro-equipo/ (1 oct 2026).
 * Cargos y fotos tal como están en esa página. El texto de casino inyectado en una ficha no se ha copiado.
 * No hay despacho asignado: la página antigua no dice en qué sede trabaja cada persona.
 * La portada solo enseña a los socios fundadores (`destacado`).
 */
export type Departamento = 'fiscal' | 'financiero' | 'juridico' | 'laboral' | 'administracion';

export type Persona = {
  nombre: string;
  cargo: string;
  cargoEn: string;
  departamento: Departamento;
  areaSlug?: string;
  sedeSlug?: string;
  foto?: string;
  bio?: string;
  destacado?: boolean;
};

export const DEPARTAMENTOS: { id: Departamento; es: string; en: string }[] = [
  { id: 'fiscal', es: 'Departamento fiscal', en: 'Tax' },
  { id: 'financiero', es: 'Departamento financiero', en: 'Financial' },
  { id: 'juridico', es: 'Departamento jurídico', en: 'Legal' },
  { id: 'laboral', es: 'Departamento laboral', en: 'Employment' },
  { id: 'administracion', es: 'Administración', en: 'Administration' },
];

export const EQUIPO: Persona[] = [
  { nombre: "Guillermo Templado Meseguer", cargo: "Socio Fundador · Economista, Auditor de Cuentas", cargoEn: "Founding partner · Economist, statutory auditor", departamento: 'fiscal', areaSlug: 'fiscal', destacado: true, foto: '/equipo/guillermo-templado-meseguer.jpg' },
  { nombre: "Antonio Robles Nicolás", cargo: "Socio Fundador · Economista, Consultor Fiscal", cargoEn: "Founding partner · Economist, tax adviser", departamento: 'fiscal', areaSlug: 'fiscal', destacado: true, foto: '/equipo/antonio-robles-nicolas.jpg' },
  { nombre: "Fernando Gorostiza Ruiz", cargo: "Abogado", cargoEn: "Lawyer", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/fernando-gorostiza-ruiz.jpg' },
  { nombre: "Pablo Templado Pérez", cargo: "Economista", cargoEn: "Economist", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/pablo-templado-perez.jpg' },
  { nombre: "Juana María Candela Gil", cargo: "Economista", cargoEn: "Economist", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/juana-maria-candela-gil.jpg' },
  { nombre: "Maria Josefa Fernández Jimenez", cargo: "Economista y Diplomada en Ciencias Empresariales", cargoEn: "Economist and diploma in business studies", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/maria-josefa-fernandez-jimenez.jpg' },
  { nombre: "Antonio Robles Jara", cargo: "Abogado", cargoEn: "Lawyer", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/antonio-robles-jara.jpg' },
  { nombre: "Pedro Robles Elvira", cargo: "Grado en Administración y Dirección de Empresas", cargoEn: "Degree in business administration", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/pedro-robles-elvira.jpg' },
  { nombre: "Mario Nohales Palao", cargo: "Abogado. Máster en derecho tributario.", cargoEn: "Lawyer. Master's in tax law.", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/mario-nohales-palao.jpg' },
  { nombre: "José Daniel Quiles Rico", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/jose-daniel-quiles-rico.jpg' },
  { nombre: "Pablo Martínez Abarca", cargo: "Grado en Administración y Dirección de Empresas", cargoEn: "Degree in business administration", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/pablo-martinez-abarca.jpg' },
  { nombre: "Miguel Ángel Lozano Lecina", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/miguel-angel-lozano-lecina.jpg' },
  { nombre: "Miguel Ángel Navarro", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/miguel-angel-navarro.jpg' },
  { nombre: "Eduardo Muñoz Muñoz", cargo: "Grado en Administración y Dirección de Empresas", cargoEn: "Degree in business administration", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/eduardo-munoz-munoz.jpg' },
  { nombre: "Vanesa Gracia Garciafilia", cargo: "Técnico en Administración", cargoEn: "Administration technician", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/vanesa-gracia-garciafilia.jpg' },
  { nombre: "Rocío Pérez López", cargo: "Economista y Abogada", cargoEn: "Economist and lawyer", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/rocio-perez-lopez.jpg' },
  { nombre: "Estefanía Martínez García", cargo: "Grado en Derecho – Máster en Tributación y Asesoría Fiscal", cargoEn: "Law degree and master's in tax and tax advice", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/estefania-martinez-garcia.jpg' },
  { nombre: "Bibiano Pérez Martínez", cargo: "Grado en Administración y Dirección de Empresas", cargoEn: "Degree in business administration", departamento: 'fiscal', areaSlug: 'fiscal', foto: '/equipo/bibiano-perez-martinez.jpg' },
  { nombre: "Norberto García Fernández", cargo: "Economista, Auditor de Cuentas", cargoEn: "Economist, statutory auditor", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/norberto-garcia-fernandez.jpg' },
  { nombre: "Antonia Ponce Nortes", cargo: "Economista", cargoEn: "Economist", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/antonia-ponce-nortes.jpg' },
  { nombre: "José García Fernández", cargo: "Economista", cargoEn: "Economist", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/jose-garcia-fernandez.jpg' },
  { nombre: "José Manuel Abellán González", cargo: "Licenciado en ADE/Master en Auditoría de cuentas", cargoEn: "Business degree and master's in account auditing", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/jose-manuel-abellan-gonzalez.jpg' },
  { nombre: "Juana María Teruel Egea", cargo: "Diplomada en Ciencias Empresariales", cargoEn: "Diploma in business studies", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/juana-maria-teruel-egea.jpg' },
  { nombre: "Germán González Cutillas", cargo: "Economista", cargoEn: "Economist", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/german-gonzalez-cutillas.jpg' },
  { nombre: "José Pedro García Pozzy", cargo: "Licenciado en Ciencias Económicas y Empresariales", cargoEn: "Degree in economics and business", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/jose-pedro-garcia-pozzy.jpg' },
  { nombre: "Francisco José Meseguer Hurtado", cargo: "Economista y Abogado", cargoEn: "Economist and lawyer", departamento: 'financiero', areaSlug: 'financiero', foto: '/equipo/francisco-jose-meseguer-hurtado.jpg' },
  { nombre: "Francisco Liaño López", cargo: "Abogado y Licenciado en Ciencias Económicas y Empresariales", cargoEn: "Lawyer and degree in economics and business", departamento: 'juridico', areaSlug: 'juridico', foto: '/equipo/francisco-liano-lopez.jpg' },
  { nombre: "Salvador Manzano Valverde", cargo: "Abogado", cargoEn: "Lawyer", departamento: 'juridico', areaSlug: 'juridico', foto: '/equipo/salvador-manzano-valverde.jpg' },
  { nombre: "Manuel López Nicolás", cargo: "Abogado", cargoEn: "Lawyer", departamento: 'juridico', areaSlug: 'juridico', foto: '/equipo/manuel-lopez-nicolas.jpg' },
  { nombre: "Rafael Latorre Coy", cargo: "Economista y Graduado en Derecho", cargoEn: "Economist and law graduate", departamento: 'juridico', areaSlug: 'juridico', foto: '/equipo/rafael-latorre-coy.jpg' },
  { nombre: "Carmen María Martínez Escobar", cargo: "Grado en Derecho Bilingüe", cargoEn: "Bilingual law degree", departamento: 'juridico', areaSlug: 'juridico', foto: '/equipo/carmen-maria-martinez-escobar.jpg' },
  { nombre: "Juan Jose Botías Iniesta", cargo: "Abogado", cargoEn: "Lawyer", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/juan-jose-botias-iniesta.jpg' },
  { nombre: "Juan Bernal Jiménez", cargo: "Diplomado en Relaciones Laborales", cargoEn: "Diploma in labour relations", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/juan-bernal-jimenez.jpg' },
  { nombre: "Rosana Teruel Abellán", cargo: "Grado en Relaciones Laborales y Recursos Humanos.", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/rosana-teruel-abellan.jpg' },
  { nombre: "Josefa Rubio Muñoz", cargo: "Técnico en Administración", cargoEn: "Administration technician", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/josefa-rubio-munoz.jpg' },
  { nombre: "Mª del Carmen Gabarrón Díaz", cargo: "Diplomada en Relaciones Laborales", cargoEn: "Diploma in labour relations", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/m-del-carmen-gabarron-diaz.jpg' },
  { nombre: "Laura Haro Navarro", cargo: "Grado en Relaciones Laborales y Recursos Humanos", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/laura-haro-navarro.jpg' },
  { nombre: "María Inmaculada González Montoya", cargo: "Graduada Social diplomada", cargoEn: "Qualified labour adviser", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/maria-inmaculada-gonzalez-montoya.jpg' },
  { nombre: "Maria Belén Muñoz Álamo", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/maria-belen-munoz-alamo.jpg' },
  { nombre: "Carmen Sanjuan Sanjuan", cargo: "Grado en Relaciones Laborales y Recursos Humanos.", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/carmen-sanjuan-sanjuan.jpg' },
  { nombre: "Javier Jiménez Fructuoso", cargo: "Grado en Relaciones Laborales y Recursos Humanos.", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/javier-jimenez-fructuoso.jpg' },
  { nombre: "Marta Rubio Muñoz", cargo: "Grado en Relaciones Laborales y Recursos Humanos.", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/marta-rubio-munoz.jpg' },
  { nombre: "Inmaculada Cascales Ortuño", cargo: "Grado en Relaciones Laborales y Recursos Humanos.", cargoEn: "Degree in labour relations and human resources", departamento: 'laboral', areaSlug: 'laboral', foto: '/equipo/inmaculada-cascales-ortuno.jpg' },
  { nombre: "Juan Andrés Barbiso", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/juan-andres-barbiso.jpg' },
  { nombre: "María Dolores Puche Polo", cargo: "Técnico en Administración", cargoEn: "Administration technician", departamento: 'administracion', foto: '/equipo/maria-dolores-puche-polo.jpg' },
  { nombre: "Aurora Bernal Andreo", cargo: "Técnico en Administración", cargoEn: "Administration technician", departamento: 'administracion', foto: '/equipo/aurora-bernal-andreo.jpg' },
  { nombre: "Elena Teruel Solano", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/elena-teruel-solano.jpg' },
  { nombre: "Jose Francisco Muñoz Semitiel", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/jose-francisco-munoz-semitiel.jpg' },
  { nombre: "Pedro Balibrea García", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/pedro-balibrea-garcia.jpg' },
  { nombre: "Adela Navarro López", cargo: "Grado Social Diplomada", cargoEn: "Qualified labour adviser", departamento: 'administracion', foto: '/equipo/adela-navarro-lopez.jpg' },
  { nombre: "Marta Antolinos Cava", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/marta-antolinos-cava.jpg' },
  { nombre: "Valentín García Benito", cargo: "Grado en Ciencias Políticas", cargoEn: "Degree in political science", departamento: 'administracion', foto: '/equipo/valentin-garcia-benito.jpg' },
  { nombre: "Noelia Yago Martínez", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/noelia-yago-martinez.jpg' },
  { nombre: "Paula Morís Martínez", cargo: "Técnico Superior en Administración y Finanzas", cargoEn: "Higher technician in administration and finance", departamento: 'administracion', foto: '/equipo/paula-moris-martinez.jpg' },
];
