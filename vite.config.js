import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Хөгжүүлэлтэд /api хүсэлтийг локал Express сервер рүү дамжуулна.
// API-ийн портыг .env-ийн PORT-той тааруулсан (default 4000).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
