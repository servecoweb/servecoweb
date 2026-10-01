-- =====================================================================
-- SERVECO · 0002_datos_ejemplo
-- Carga los datos de ejemplo de src/data/ en las tablas de 0001_init.
-- Pegar en Supabase → SQL Editor → Run, DESPUÉS de 0001_init.sql.
-- Es idempotente: si se ejecuta dos veces, actualiza en lugar de duplicar.
--
-- OJO: equipo, landings, blog y textos de áreas son DE EJEMPLO.
-- Las sedes y las 8 áreas sí son reales (web actual de Serveco).
-- =====================================================================

-- ---------------------------------------------------------------------
-- SEDES (reales)
-- ---------------------------------------------------------------------
insert into public.offices (slug, ciudad, zona, central, orden) values
  ('murcia',   'Murcia',   'Región de Murcia',  true,  0),
  ('yecla',    'Yecla',    'Región de Murcia',  false, 1),
  ('jumilla',  'Jumilla',  'Región de Murcia',  false, 2),
  ('lorca',    'Lorca',    'Región de Murcia',  false, 3),
  ('balsicas', 'Balsicas', 'Región de Murcia',  false, 4),
  ('benidorm', 'Benidorm', 'Costa de Alicante', false, 5)
on conflict (slug) do update set
  ciudad = excluded.ciudad, zona = excluded.zona, central = excluded.central, orden = excluded.orden;

-- Locales: se reponen enteros para estas sedes.
-- PENDIENTE verificar: tel. de Balsicas (= central) y reparto de teléfonos de Yecla.
delete from public.office_locations
where office_slug in ('murcia', 'yecla', 'jumilla', 'lorca', 'balsicas', 'benidorm');

insert into public.office_locations (office_slug, direccion, tel, orden) values
  ('murcia',   'Gran Vía, 28, 5.º',                       '968 909 020', 0),
  ('murcia',   'C/ Acisclo Díaz, 2',                      '968 284 766', 1),
  ('yecla',    'C/ Pío Baroja, 7',                        '968 753 640', 0),
  ('yecla',    'C/ Esteban Díaz, 53',                     '968 790 408', 1),
  ('jumilla',  'C/ Valencia, 2',                          '968 780 040', 0),
  ('lorca',    'Antigua Plaza de Abastos, 15, local 10',  '968 471 431', 0),
  ('balsicas', 'Avda. Ciudad de Murcia, 90, bajo',        '968 909 020', 0),
  ('benidorm', 'Calle Jaén, 1 (esq. Avda. de Europa)',    '665 912 758', 0);

-- ---------------------------------------------------------------------
-- ÁREAS (las 8 del menú actual; textos a validar por Rafael)
-- ---------------------------------------------------------------------
insert into public.service_areas (slug, slug_en, nombre, nombre_en, grupo, resumen, resumen_en, intro, incluye, orden) values
  ('fiscal', 'tax', 'Fiscal', 'Tax', 'empresa',
   'Sociedades, IRPF, IVA, planificación fiscal, sucesiones y no residentes.',
   'Corporate tax, personal income tax, VAT, tax planning, inheritance and non-residents.',
   'Llevamos la fiscalidad de empresas, autónomos y particulares, y la coordinamos con la contabilidad y el área laboral para que no haya sorpresas al cierre.',
   array['Impuesto de sociedades e IVA','IRPF de autónomos y particulares','Planificación fiscal y operaciones societarias','Herencias, donaciones y empresa familiar','No residentes (IRNR)'], 0),
  ('laboral', 'employment', 'Laboral', 'Employment', 'personas',
   'Nóminas, seguros sociales, contratos, despidos e inspecciones de trabajo.',
   'Payroll, social security, contracts, dismissals and labour inspections.',
   'Gestionamos el día a día laboral de su plantilla y le acompañamos cuando hay que contratar, despedir o atender una inspección.',
   array['Nóminas y seguros sociales','Contratos y altas','Despidos y finiquitos','Inspecciones de trabajo'], 1),
  ('juridico', 'legal', 'Jurídico', 'Legal', 'personas',
   'Mercantil, civil, contratación, reclamaciones y procedimientos judiciales.',
   'Corporate, civil, contracts, claims and court proceedings.',
   'Asesoramiento jurídico para empresas y particulares: contratos, sociedades, reclamaciones y defensa de sus intereses.',
   array['Mercantil y societario','Redacción y revisión de contratos','Reclamaciones extrajudiciales','Procedimientos judiciales'], 2),
  ('contable', 'accounting', 'Contable', 'Accounting', 'empresa',
   'Contabilidad, cuentas anuales, libros oficiales y cierre del ejercicio.',
   'Bookkeeping, annual accounts, statutory books and year-end closing.',
   'Mantenemos su contabilidad al día para que sepa cómo va la empresa durante el año, no solo en el cierre.',
   array['Contabilidad','Cuentas anuales','Libros oficiales','Cierre del ejercicio'], 3),
  ('financiero', 'financial', 'Financiero', 'Financial', 'empresa',
   'Financiación, viabilidad, presupuestos y cuadros de mando con los sistemas A.D.',
   'Financing, feasibility, budgets and dashboards with our A.D. systems.',
   'Analizamos la salud financiera de su empresa con nuestros propios sistemas A.D.I, A.D.P y A.D.A.',
   array['A.D.I · Análisis Dinámico Intermensual','A.D.P · Análisis Dinámico Presupuestario','A.D.A · Análisis Dinámico Analítico','Financiación y planes de viabilidad'], 4),
  ('auditoria', 'audit', 'Auditoría', 'Audit', 'empresa',
   'Auditoría de cuentas anuales y otros informes de revisión.',
   'Statutory audit of annual accounts and other review reports.',
   'Emitimos informes de auditoría de cuentas y trabajos de revisión.',
   array['Auditoría de cuentas anuales','Informes de revisión'], 5),
  ('idi-patent-box', 'rd-patent-box', 'I+D+i y Patent Box', 'R&D and Patent Box', 'crecimiento',
   'Deducciones fiscales por innovación con análisis de cada proyecto.',
   'Tax deductions for innovation, analysed project by project.',
   'Estudiamos si sus proyectos pueden aplicar las deducciones por I+D+i y el Patent Box, y preparamos la documentación.',
   array['Análisis de proyectos','Deducciones por I+D+i','Patent Box'], 6),
  ('formacion', 'training', 'Formación', 'Training', 'personas',
   'Cursos para su plantilla, 100 % bonificables.',
   'Training courses for your staff, fully subsidised.',
   'Organizamos formación para su plantilla con cargo al crédito de formación de la empresa.',
   array['Cursos 100 % bonificables','Gestión del crédito de formación'], 7)
on conflict (slug) do update set
  slug_en = excluded.slug_en, nombre = excluded.nombre, nombre_en = excluded.nombre_en, grupo = excluded.grupo,
  resumen = excluded.resumen, resumen_en = excluded.resumen_en, intro = excluded.intro,
  incluye = excluded.incluye, orden = excluded.orden;

-- ---------------------------------------------------------------------
-- LANDINGS (2 de ejemplo; las 12 las elige Serveco)
-- ---------------------------------------------------------------------
insert into public.seo_landings
  (area_slug, office_slug, title, meta_description, h1, lead, para_quien, cuando_h2, cuando_texto,
   que_hacemos, pasos, angulo_local, faqs, cta, published) values
  ('fiscal', 'yecla',
   'Asesoría fiscal en Yecla para pymes y autónomos',
   'Asesoría fiscal en Yecla: impuestos de pymes, autónomos e industria. Dos despachos en Yecla. Serveco, desde 1977.',
   'Asesoría fiscal para pymes y autónomos en Yecla',
   'Llevamos los impuestos de talleres, fabricantes y autónomos de Yecla desde nuestros dos despachos en la ciudad.',
   array['Pymes industriales y familiares','Autónomos y profesionales','Empresas que venden fuera de la Región'],
   '¿Cuándo le conviene revisar su fiscalidad?',
   'Al pasar de autónomo a sociedad, al hacer una inversión importante o cuando el cierre del año trae sorpresas. Texto de ejemplo.',
   array['Impuesto de sociedades e IVA','IRPF del autónomo','Planificación antes del cierre','Deducciones por I+D+i'],
   array['Primera reunión en Yecla','Revisión de sus últimas declaraciones','Propuesta de iguala o de trabajo concreto'],
   'Ejemplo de ángulo local: tejido industrial del Altiplano, empresa familiar y dos locales en Yecla. A validar con el despacho.',
   '[{"q":"¿Módulos o estimación directa en una pyme familiar?","a":"Respuesta de ejemplo. La redactará el área fiscal."},{"q":"¿Puede un taller de Yecla aplicar la deducción por I+D+i?","a":"Respuesta de ejemplo. La redactará el área fiscal."}]'::jsonb,
   'Pedir cita en Yecla', true),
  ('laboral', 'benidorm',
   'Asesoría laboral en Benidorm para hostelería y comercio',
   'Asesoría laboral en Benidorm: nóminas, contratos de temporada y trabajadores extranjeros. Serveco, desde 1977.',
   'Asesoría laboral en Benidorm para hostelería y comercio',
   'Nóminas, contratos de temporada y trabajadores extranjeros, desde nuestro despacho de Benidorm y en inglés si lo necesita.',
   array['Hoteles y restaurantes','Comercio de temporada','Empresas con trabajadores extranjeros'],
   '¿Qué cambia al llegar la temporada alta?',
   'Altas, contratos fijos discontinuos y más inspecciones. Texto de ejemplo.',
   array['Nóminas y seguros sociales','Contratos fijos discontinuos','Trabajadores de fuera de la UE','Inspecciones de trabajo'],
   array['Llamada o visita al despacho de Benidorm','Revisión de su plantilla y contratos','Propuesta de gestión laboral'],
   'Ejemplo de ángulo local: costa, turnos y temporada; atención en inglés. A validar con el despacho.',
   '[{"q":"¿Cómo se cotiza un extra en agosto?","a":"Respuesta de ejemplo. La redactará el área laboral."},{"q":"¿Qué necesito para contratar a un camarero británico?","a":"Respuesta de ejemplo. La redactará el área laboral."}]'::jsonb,
   'Consultar en Benidorm', true)
on conflict (area_slug, office_slug) do update set
  title = excluded.title, meta_description = excluded.meta_description, h1 = excluded.h1, lead = excluded.lead,
  para_quien = excluded.para_quien, cuando_h2 = excluded.cuando_h2, cuando_texto = excluded.cuando_texto,
  que_hacemos = excluded.que_hacemos, pasos = excluded.pasos, angulo_local = excluded.angulo_local,
  faqs = excluded.faqs, cta = excluded.cta, published = excluded.published;

-- ---------------------------------------------------------------------
-- SILO INTERNACIONAL (textos de partida)
-- ---------------------------------------------------------------------
insert into public.intl_pages (slug, slug_en, titulo, titulo_en, lead, lead_en, puntos, puntos_en, orden, published) values
  ('nie', 'nie-number',
   'Obtención del NIE', 'Getting your NIE number in Spain',
   'Le ayudamos a solicitar el NIE para comprar una vivienda, trabajar o abrir un negocio en España.',
   'We help you apply for your NIE to buy property, work or start a business in Spain.',
   array['Qué documentación necesita','Cita y presentación de la solicitud','Seguimiento hasta la obtención'],
   array['Which documents you need','Booking the appointment and filing','Follow-up until you get it'], 0, true),
  ('impuesto-no-residentes', 'non-resident-tax',
   'Impuesto sobre la renta de no residentes (IRNR)', 'Non-resident income tax in Spain (IRNR)',
   'Presentamos su declaración si tiene una vivienda o ingresos en España y no reside aquí.',
   'We file your return if you own property or earn income in Spain but do not live here.',
   array['Imputación de rentas por vivienda','Alquileres','Venta de inmuebles y retenciones'],
   array['Deemed income on your Spanish home','Rental income','Selling property and withholding tax'], 1, true),
  ('benidorm', 'benidorm',
   'Asesoría para extranjeros en Benidorm', 'Advisers for foreign residents in Benidorm',
   'Nuestro despacho de Benidorm atiende a residentes extranjeros y no residentes, en español y en inglés.',
   'Our Benidorm office looks after foreign residents and non-residents, in English and Spanish.',
   array['NIE e IRNR','Testamentos y sucesiones','Compraventa de inmuebles'],
   array['NIE and non-resident tax','Wills and inheritance','Buying and selling property'], 2, true)
on conflict (slug) do update set
  slug_en = excluded.slug_en, titulo = excluded.titulo, titulo_en = excluded.titulo_en, lead = excluded.lead,
  lead_en = excluded.lead_en, puntos = excluded.puntos, puntos_en = excluded.puntos_en,
  orden = excluded.orden, published = excluded.published;

-- ---------------------------------------------------------------------
-- EQUIPO (relleno; ids fijos para no duplicar al repetir)
-- ---------------------------------------------------------------------
insert into public.team_members (id, nombre, cargo, cargo_en, area_slug, office_slug, orden, published) values
  ('00000000-0000-4000-8000-000000000001', 'Nombre y apellidos', 'Responsable del área fiscal',   'Head of Tax',        'fiscal',   'murcia',   0, true),
  ('00000000-0000-4000-8000-000000000002', 'Nombre y apellidos', 'Responsable del área laboral',  'Head of Employment', 'laboral',  'murcia',   1, true),
  ('00000000-0000-4000-8000-000000000003', 'Nombre y apellidos', 'Responsable del área jurídica', 'Head of Legal',      'juridico', 'murcia',   2, true),
  ('00000000-0000-4000-8000-000000000004', 'Nombre y apellidos', 'Despacho de Benidorm',          'Benidorm office',    null,       'benidorm', 3, true)
on conflict (id) do update set
  nombre = excluded.nombre, cargo = excluded.cargo, cargo_en = excluded.cargo_en, area_slug = excluded.area_slug,
  office_slug = excluded.office_slug, orden = excluded.orden, published = excluded.published;

-- ---------------------------------------------------------------------
-- BLOG (3 artículos DE EJEMPLO: borrar antes de publicar la web)
-- ---------------------------------------------------------------------
insert into public.blog_articles (slug, title, excerpt, body, category, status, published_at) values
  ('deduccion-idi-como-saber-si-su-empresa-puede-aplicarla',
   'Cómo saber si su empresa puede aplicar la deducción por I+D+i',
   'Requisitos, informe motivado y errores habituales al cuantificar el gasto.',
   '<p>Artículo de ejemplo para maquetar el blog. El texto definitivo lo redactará el agente del blog y lo validará un abogado de Serveco.</p>',
   'Fiscal', 'published', '2026-09-15 09:00:00+00'),
  ('convocatorias-ayudas-pymes-region-de-murcia',
   'Convocatorias abiertas para pymes en la Región de Murcia',
   'Plazos, requisitos y documentación para presentarse.',
   '<p>Artículo de ejemplo para maquetar el blog.</p>',
   'Ayudas', 'published', '2026-09-08 09:00:00+00'),
  ('comprar-vivienda-en-espana-no-residente',
   'Comprar vivienda en España siendo no residente',
   'NIE, impuestos de la compra y retenciones en la venta.',
   '<p>Artículo de ejemplo para maquetar el blog.</p>',
   'Internacional', 'published', '2026-09-01 09:00:00+00')
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, category = excluded.category,
  status = excluded.status, published_at = excluded.published_at;

-- Comprobación rápida: debería devolver 6 · 8 · 8 · 2 · 3 · 4 · 3
select
  (select count(*) from public.offices)          as sedes,
  (select count(*) from public.office_locations) as locales,
  (select count(*) from public.service_areas)    as areas,
  (select count(*) from public.seo_landings)     as landings,
  (select count(*) from public.intl_pages)       as internacional,
  (select count(*) from public.team_members)     as equipo,
  (select count(*) from public.blog_articles)    as blog;
