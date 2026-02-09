import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/main/index.ts') }
      }
    }
  },
  preload: {
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'src/preload/index.ts') }
      }
    }
  },
  renderer: {
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          'main-window': resolve(__dirname, 'src/renderer/main-window/index.html'),
          'secondary-window': resolve(__dirname, 'src/renderer/secondary-window/index.html')
        }
      }
    }
  }
})
