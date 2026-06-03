import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Relative base => emitted asset URLs are "./assets/..." instead of "/assets/...".
  // Works whether the site is served from the domain root or a subpath, and avoids
  // the host returning a fallback HTML/octet-stream response for a missing absolute path.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
