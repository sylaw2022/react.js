import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    // Only include test files, exclude Next.js app directory
    include: ['tests/**/*.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/app/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // Mock production build path for tests
      './dist/server/App.js': './src/App.jsx',
    },
  },
  optimizeDeps: {
    exclude: ['express', 'react', 'react-dom', 'next'],
  },
  // Don't transform Next.js modules - let them be handled as external
  ssr: {
    noExternal: ['react', 'react-dom'],
  },
})

