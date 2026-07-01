// auth.js — нэвтрэлтийн туслахууд (bcrypt + JWT)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SECRET = process.env.JWT_SECRET || 'dev_secret';
const TOKEN_TTL = '7d';

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

/* Bearer токеныг шалгаж req.user тавина. Токенгүй бол 401. */
export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Токен буруу эсвэл хугацаа дууссан' });
  }
}

/* Зөвхөн admin эрхтэйд зөвшөөрнө (authRequired-ийн дараа). */
export function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Зөвхөн админд зөвшөөрнө' });
  next();
}

export default { hashPassword, verifyPassword, signToken, authRequired, adminRequired };
