/* config.js — API-ийн суурь хаяг.
   Production-д деплой хийсэн backend-ийн хаягийг build хийхээс өмнө
   VITE_API_URL орчны хувьсагчаар өгнө. Жишээ:
     VITE_API_URL=https://my-api.onrender.com npm run build
   Хоосон бол харьцангуй /api ашиглана (dev дээр vite proxy хийдэг). */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default API_BASE;
