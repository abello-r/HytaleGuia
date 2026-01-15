import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: [
      'hytaleguia.com',
      'www.hytaleguia.com',
      'localhost',
      '127.0.0.1'
    ],
    watch: {
      usePolling: true
    }
  }
})
