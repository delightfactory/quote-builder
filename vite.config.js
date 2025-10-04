import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    // Ensure assets are copied correctly
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  // Ensure CSV files are treated as static assets
  assetsInclude: ['**/*.csv'],
  publicDir: 'public'
})
