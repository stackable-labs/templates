import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')

  return {
    plugins: [react()],
    envDir: '../../',
    server: {
      port: parseInt(env.VITE_PREVIEW_PORT || '5174', 10),
    },
  }
})
