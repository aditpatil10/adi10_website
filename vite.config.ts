import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub Pages has no server-side routing. Copying index.html to 404.html lets
 * deep links (e.g. /about) be served the SPA, which then routes client-side.
 */
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const index = resolve(__dirname, 'dist/index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(__dirname, 'dist/404.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Served from the custom domain https://aditpatil.com/ (CNAME), so root base.
  base: '/',
  plugins: [react(), tailwindcss(), spaFallback()],
})
