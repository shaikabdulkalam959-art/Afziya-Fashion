import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/ rather than /.
  // Keep local development and non-Pages hosting at the root path.
  base: process.env.GITHUB_ACTIONS ? '/Afziya-Fashion/' : '/',
  plugins: [react()],
  server: { port: 5173 },
});
