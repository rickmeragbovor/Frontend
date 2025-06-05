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
      '8361-196-170-112-13.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'https://8361-196-170-112-13.ngrok-free.app',
        changeOrigin: true,
        secure: false, // car ngrok utilise un certificat auto-signé
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});