import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config' // changed from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', 'e2e/**'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.*', 'src/main.*', 'src/**/index.js'],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router)[\\/]/,
              priority: 20,
            },
            {
              name: 'antd-vendor',
              test: /node_modules[\\/](antd|@ant-design|rc-[^\\/]+)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
