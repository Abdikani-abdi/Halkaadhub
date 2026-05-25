import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Backend server URL - used for development proxy
const BACKEND_URL = 'http://178.18.245.131:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      '/hubs': {
        target: BACKEND_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
