import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/', 
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@repo/styles/global-config" as *;`
      }
    }
  },
  resolve: {
    alias: {
      "@edu-enroll": path.resolve(__dirname, "./src"),
      "@edu-enroll/assets": path.resolve(__dirname, "./src/assets/"),
      "@edu-enroll/components": path.resolve(__dirname, "./src/components/"),
      "@edu-enroll/features": path.resolve(__dirname, "./src/features/"),
      "@edu-enroll/routes": path.resolve(__dirname, "./src/routes/"),
      "@edu-enroll/services": path.resolve(__dirname, "./src/services/"),
      "@edu-enroll/store": path.resolve(__dirname, "./src/store/"),
      "@edu-enroll/types": path.resolve(__dirname, "./src/types/")
    }
  }
})
