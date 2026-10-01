/**
 * Aplica las migraciones de supabase/migrations/*.sql en orden, una sola vez cada una.
 * Uso: npm run db:migrate
 *
 * Necesita SUPABASE_DB_URL en .env.local (cadena de conexión de Postgres, NO la URL de la API):
 *   Supabase → botón «Connect» → «Session pooler» → copiar URI y poner la contraseña de la BD.
 *   postgresql://postgres.hmhqzyhxyojuyyozjwuv:[CONTRASEÑA]@aws-0-xx.pooler.supabase.com:5432/postgres
 *
 * Plan B (sin contraseña): pegar el .sql en Supabase → SQL Editor → Run.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('✗ Falta SUPABASE_DB_URL en .env.local (Supabase → Connect → Session pooler).');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
} catch (e) {
  console.error('✗ No se pudo conectar a la base de datos:', e.message);
  console.error('  Revisa la contraseña de SUPABASE_DB_URL y que sea la del «Session pooler».');
  process.exit(1);
}

// Registro de migraciones fuera de "public" (no se expone por la API).
await client.query('create schema if not exists privado');
await client.query(
  'create table if not exists privado.migraciones (nombre text primary key, aplicada timestamptz not null default now())',
);

const dir = path.join(process.cwd(), 'supabase', 'migrations');
const archivos = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
const { rows } = await client.query('select nombre from privado.migraciones');
const hechas = new Set(rows.map((r) => r.nombre));

let nuevas = 0;
for (const archivo of archivos) {
  if (hechas.has(archivo)) {
    console.log(`= ${archivo} (ya aplicada)`);
    continue;
  }
  const sql = await readFile(path.join(dir, archivo), 'utf8');
  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('insert into privado.migraciones (nombre) values ($1)', [archivo]);
    await client.query('commit');
    console.log(`✓ ${archivo}`);
    nuevas++;
  } catch (e) {
    await client.query('rollback');
    console.error(`✗ ${archivo}: ${e.message}`);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log(nuevas ? `Listo: ${nuevas} migración(es) aplicada(s).` : 'Nada nuevo que aplicar.');
