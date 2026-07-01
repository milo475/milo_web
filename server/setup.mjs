// setup.mjs — Холбогдсон сан (жишээ Aiven defaultdb) дотор бүх
// хүснэгтийг үүсгэнэ. CREATE DATABASE / USE-г алгасна (managed сан
// дээр сан урьдчилан үүссэн, эрх байхгүй байдаг).
// Ажиллуулах:  npm run setup:db   (.env нь зорилтот сан руу заасан байх)
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function sslOption() {
  if (process.env.DB_SSL !== 'true') return {};
  if (process.env.DB_SSL_CA)
    return { ssl: { ca: process.env.DB_SSL_CA, rejectUnauthorized: true } };
  return { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT === 'true' } };
}

// .sql файлаас CREATE DATABASE ба USE мөрүүдийг хасна
function tablesOnly(file) {
  return readFileSync(path.join(__dirname, file), 'utf8')
    .split('\n')
    .filter((l) => !/^\s*(CREATE\s+DATABASE|USE)\b/i.test(l))
    .join('\n');
}

const sql = tablesOnly('schema.sql') + '\n' + tablesOnly('auth_schema.sql');

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  ...sslOption(),
});

try {
  await conn.query(sql);
  const [tables] = await conn.query('SHOW TABLES');
  console.log(`✓ Хүснэгтүүд бэлэн (${tables.length}):`, tables.map((t) => Object.values(t)[0]).join(', '));
  console.log('Дараа нь:  npm run seed   ба   npm run create-admin <нэр> <нууц үг>');
} catch (e) {
  console.error('✗ Setup алдаа:', e.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
