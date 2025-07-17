import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5174,
    proxy: {
      '/api': import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    },
  },
});

