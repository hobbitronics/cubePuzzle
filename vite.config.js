import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cube1: resolve(__dirname, 'cube1.html'),
        cube2: resolve(__dirname, 'cube2.html'),
        cube3: resolve(__dirname, 'cube3.html'),
        cube4: resolve(__dirname, 'cube4.html'),
      },
    },
  },
})
