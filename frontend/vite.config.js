import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/uploads': {
        target: 'http://localhost:8827',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
