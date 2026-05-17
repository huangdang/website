import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // 打包文件名
  build: {
    outDir: 'website'
  },
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5200,
    host: true,
    proxy: {
      '/seven': {
        // target: 'http://180.184.42.80:8101/',
        // target: 'https://app-ding.digitalhainan.com.cn:10838/', // 生产
        target: 'https://webapi.sporttery.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/seven/, '')
      },
      '/double': {
        target: 'https://www.cwl.gov.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/double/, '')
      }
    }
  }
})
