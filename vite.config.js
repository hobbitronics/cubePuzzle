import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cube1: resolve(__dirname, 'cube1/index.html'),
        cube2: resolve(__dirname, 'cube2/index.html'),
        cube3: resolve(__dirname, 'cube3/index.html'),
        cube4: resolve(__dirname, 'cube4/index.html'),
      },
    },
  },
})
