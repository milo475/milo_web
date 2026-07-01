// api/index.js — Vercel serverless entry.
// server/index.js доторх Express app-ийг Vercel функц болгон экспортлоно.
// vercel.json дахь rewrite /api/(.*) -> /api бүх API хүсэлтийг энд чиглүүлнэ.
import app from '../server/index.js';

export default app;
