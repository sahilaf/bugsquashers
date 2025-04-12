import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                         // Use global test API like `test`, `expect`
    environment: 'jsdom',                  // Simulate browser for React components
    setupFiles: ['./vitest.setup.js'],     // Path to test setup file (if needed)
    coverage: {
      enabled: true,                       // Enable built-in coverage
      reporter: ['text', 'lcov'],          // Needed for SonarQube (lcov)
      reportsDirectory: './coverage',      // Output folder for coverage reports
    },
  },
})
