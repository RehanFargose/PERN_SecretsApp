import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // new code to connect to backend
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    }
  }
  // end
})
