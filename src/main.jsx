import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import router from './Router.jsx'
import React from 'react'
import { ThemeProvider } from './providers/ThemeProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from "react-router/dom";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        { /*Auth Provider here */}
        <RouterProvider
          router={router}
        >
        </RouterProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)