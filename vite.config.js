import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Use automatic JSX runtime
    jsxRuntime: 'automatic',
  })],
  ssr: {
    // Don't externalize React - this should make Vite transform CommonJS to ESM
    noExternal: ['react', 'react-dom'],
    // Ensure proper module resolution
    resolve: {
      conditions: ['node'],
      external: [],
    },
  },
  resolve: {
    // Ensure proper resolution for SSR
    dedupe: ['react', 'react-dom'],
  },
  // Ensure CommonJS is transformed
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})


