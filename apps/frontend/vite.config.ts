import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(process.cwd(), '../../')
  const env = loadEnv(mode, envDir, '')
  return {
    plugins: [
      react(),
      {
        name: 'html-env-transform',
        transformIndexHtml(html) {
          return html.replace(/%(\w+)%/g, (match, p1) => {
            return env[p1] ?? match
          })
        },
      },
    ],
  }
})
