import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  build: {
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      input: './src/index.js',
      output: {
        entryFileNames: 'signup.js',
        chunkFileNames: 'signup-[name].js',
        assetFileNames: 'signup-[name].[ext]'
      }
    }
  }
})