import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router'
import router from './Router.jsx'
import React from 'react'
import { ThemeProvider } from './providers/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      { /*Auth Provider here */}
      <RouterProvider
        router={router}
      >
      </RouterProvider>
    </ThemeProvider>
  </React.StrictMode>
)