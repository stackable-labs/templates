import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
      fileName: 'extension',
    },
    rollupOptions: {
      // bundle everything into a single file
    },
  },
  envDir: '../../',
  server: {
    port: parseInt(process.env.VITE_EXTENSION_PORT || '5173', 10),
    cors: true,
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})
