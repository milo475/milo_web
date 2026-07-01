// db.js — MySQL/MariaDB холболтын pool (API ба seed хоёулаа ашиглана)
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// .env-г төслийн язгуураас унших
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'milo',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'milo_kali',
  charset: 'utf8mb4',
  waitForConnections: true,
  // serverless дээр олон instance тус бүр өөрийн pool-той тул хязгаарыг бага барина
  connectionLimit: Number(process.env.DB_POOL_LIMIT) || 3,
  namedPlaceholders: true,
  // Managed MySQL (PlanetScale, Aiven г.м.) SSL шаарддаг бол DB_SSL=true
  ...(process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: true } }
    : {}),
});

export default pool;
