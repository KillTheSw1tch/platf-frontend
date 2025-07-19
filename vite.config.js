import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Підвантажимо .env (якщо використовуєш локально .env-файл)
dotenv.config()

// Тут точно беремо з process.env
const API_URL = process.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// https://vite.dev/config/
export default defineConfig({
  base: '/',         // тут зазвичай лишають '/' для Netlify
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5174,
    proxy: {
      // всі запити /api/* під час dev перенаправляти на бек
      '/api': {
        target: API_URL,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    },
  },
  define: {
    // щоб в твоєму коді import.meta.env.VITE_API_URL теж працювало
    'import.meta.env.VITE_API_URL': JSON.stringify(API_URL)
  }
})
