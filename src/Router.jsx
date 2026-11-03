import { createBrowserRouter } from 'react-router'

import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import ErrorPage from './pages/Errorpage'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: '/',
            lazy: () => import('./pages/Login.jsx').then((i) => ({ Component: i.default })),
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/home',
            lazy: () => import('./layouts/MainLayout.jsx').then((i) => ({ Component: i.default })),
          },
        ],
      },
    ],
  },
])

export default router
