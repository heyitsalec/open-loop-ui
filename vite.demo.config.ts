import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/open-loop-ui/' : '/',
  plugins: [react()],
  build: {
    outDir: 'demo-dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
});
