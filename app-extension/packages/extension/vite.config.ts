import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')

  return {
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
      port: parseInt(env.VITE_EXTENSION_PORT || '6543', 10),
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
  }
})
