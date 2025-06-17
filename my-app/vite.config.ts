import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {allowedHosts: [
      'd70d-196-170-112-13.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'https://d70d-196-170-112-13.ngrok-free.app',
        changeOrigin: true,
        secure: false, // car ngrok utilise un certificat auto-signé
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});