import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  vite: {
    server: {
      allowedHosts: ['chun-unprofessed-telltalely.ngrok-free.dev'],
    },
  },
});
