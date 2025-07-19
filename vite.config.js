import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = process.env.VITE_API_URL || '/'

export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(API_URL)
  },
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true
      }
    }
  }
})
