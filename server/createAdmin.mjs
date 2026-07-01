// createAdmin.mjs — админ хэрэглэгч үүсгэх/шинэчлэх
// Ашиглах:  node server/createAdmin.mjs <username> <password>
import { pool } from './db.js';
import { hashPassword } from './auth.js';

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error('Ашиглах: node server/createAdmin.mjs <username> <password>');
  process.exit(1);
}

const hash = await hashPassword(password);
try {
  await pool.execute(
    `INSERT INTO users (username, password_hash, role)
     VALUES (:u, :h, 'admin')
     ON DUPLICATE KEY UPDATE password_hash = :h, role = 'admin'`,
    { u: username, h: hash }
  );
  console.log(`✓ Админ бэлэн: ${username}`);
} catch (e) {
  console.error('✗ Алдаа:', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
