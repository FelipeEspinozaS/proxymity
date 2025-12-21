import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@proxymity/shared': path.resolve(__dirname, '../shared/src/index.ts')
    },
  },
  server: {
    port: 3000,
  }
});