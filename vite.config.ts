import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
  },
  build: command === 'build'
    ? {
        lib: {
          entry: {
            index: resolve(__dirname, 'src/index.ts'),
            'adapters/cli': resolve(__dirname, 'src/adapters/cli.ts'),
            'adapters/mock': resolve(__dirname, 'src/adapters/mock.ts')
          },
          formats: ['es'],
          fileName: (_format, entryName) => `${entryName}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', 'node:child_process'],
          output: {
            preserveModules: false,
            assetFileNames: (assetInfo) => assetInfo.name === 'style.css' ? 'styles.css' : 'assets/[name][extname]'
          }
        },
        sourcemap: true,
        emptyOutDir: true
      }
    : undefined
}));
