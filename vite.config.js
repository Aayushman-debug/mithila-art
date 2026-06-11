import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Vite 8 uses rolldown which requires the function form of manualChunks
        manualChunks(id) {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('framer-motion')) {
            return 'vendor-framer';
          }
          if (id.includes('react-icons')) {
            return 'vendor-icons';
          }
          if (id.includes('@react-oauth')) {
            return 'vendor-oauth';
          }
        },
      },
    },
    // Raise the chunk warning threshold slightly (icons are ~350 kB unminified)
    chunkSizeWarningLimit: 700,
  },
})
