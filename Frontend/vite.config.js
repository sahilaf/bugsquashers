import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Allows using `test`, `expect` without imports
    environment: 'jsdom',   // Simulates a browser DOM for React testing
    setupFiles: ['./vitest.setup.js'], // Loads the setup file
  },
})
