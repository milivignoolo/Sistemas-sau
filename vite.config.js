import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // Aquí debe estar la barra para indicar raíz
  plugins: [react()]
})
