// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':   
      {
        target: 'https://nnn-backend-4w8i.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});