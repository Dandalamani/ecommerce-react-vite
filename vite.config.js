import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // 👈 ensure assets load from root
  plugins: [react()],
})