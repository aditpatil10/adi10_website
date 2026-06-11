import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Project is served from https://aditpatil10.github.io/adi10_website/
  base: '/adi10_website/',
  plugins: [react(), tailwindcss()],
})
