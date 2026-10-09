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
    host: true,
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
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (
              id.includes('/react/') || id.includes('\\react\\') ||
              id.includes('/react-dom/') || id.includes('\\react-dom\\') ||
              id.includes('scheduler')
            ) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          if (
            id.includes('supplementalStotrasData') ||
            id.includes('canonicalParayanaStotras') ||
            id.includes('brihatStotraRatnakarIndex') ||
            id.includes('bhagavadGitaIndex') ||
            id.includes('darshanTaxonomy')
          ) {
            return 'stotra-data';
          }
          if (
            id.includes('chhandasEngine') ||
            id.includes('karmakandaParser') ||
            id.includes('scriptureTypography')
          ) {
            return 'sanskrit-linguistics';
          }
        },
      },
    },
  },
});
