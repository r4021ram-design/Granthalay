import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@shared': path.resolve(import.meta.dirname, './shared'),
    },
  },
  server: {
    port: 5173,
    watch: {
      ignored: [
        '**/Docs/**',
        '**/storage/**',
        '**/*.pdf',
        /[\\/]Docs([\\/]|$)/,
        /[\\/]storage([\\/]|$)/,
        /\.pdf$/i,
        /\.db$/i,
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
