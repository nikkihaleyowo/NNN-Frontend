// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':   
 {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});