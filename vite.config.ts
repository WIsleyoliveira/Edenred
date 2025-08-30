
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@lumi.new/sdk']
  },
  build: {
    commonjsOptions: {
      include: [/@lumi\.new\/sdk/, /node_modules/]
    }
  }
})

// so pra enviar
