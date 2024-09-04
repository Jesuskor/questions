import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

import vue from '@astrojs/vue';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), db(), vue()],
  output: 'hybrid',
  adapter: vercel()
});