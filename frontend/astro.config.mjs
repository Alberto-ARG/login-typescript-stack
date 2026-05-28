import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3000';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: { port: 4321 },
  vite: {
    server: {
      // Proxy: el navegador pega a /api en el mismo origen (4321) y Vite
      // reenvía al backend Next.js en :3000. Así la cookie httpOnly queda
      // como first-party (SameSite=Lax) y no hace falta configurar CORS.
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  },
});
