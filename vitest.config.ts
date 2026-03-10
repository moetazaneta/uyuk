import react from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), Icons({ compiler: 'jsx', jsx: 'react' })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'convex/**/*.test.{ts,tsx}'],
    environmentMatchGlobs: [['convex/**/*.test.ts', 'edge-runtime']],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '**/*.test.{ts,tsx}'],
    },
  },
})
