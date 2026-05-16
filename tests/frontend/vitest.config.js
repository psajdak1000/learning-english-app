import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, '../../frontend/src'),
      'react': path.resolve(__dirname, '../../frontend/node_modules/react'),
      'react-dom': path.resolve(__dirname, '../../frontend/node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, '../../frontend/node_modules/react-router-dom'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup.js',
    css: {
      // Obsługuje CSS Modules — zwraca nazwy klas jako klucze
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
