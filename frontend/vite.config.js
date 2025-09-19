import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api' で始まるパスへのリクエストをプロキシする
      '/api': {
        // 転送先
        target: 'http://127.0.0.1:8000',
        // オリジンを転送先に変更
        changeOrigin: true,
      },
    },
  },
})
