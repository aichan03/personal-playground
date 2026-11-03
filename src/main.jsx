import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import { RouterProvider } from 'react-router/dom'

import { ThemeProvider } from './providers/theme/ThemeProvider.jsx'
import router from './Router.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/*Auth Provider here */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
