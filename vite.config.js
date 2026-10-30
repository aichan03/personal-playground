import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router)[\\/]/, priority: 20 },
            { name: 'antd-vendor', test: /node_modules[\\/](antd|@ant-design|rc-[^\\/]+)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})
