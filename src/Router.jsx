import { createBrowserRouter } from 'react-router'
import ErrorPage from './pages/Errorpage'
import RootLayout from './layouts/RootLayout.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
   {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
         {
            element: <PublicOnlyRoute />,
            children: [
               { path: '/', lazy: () => import('./pages/Login.jsx').then((m) => ({ Component: m.default })) },
            ],
         },
         {
            element: <ProtectedRoute />,
            children: [
               { path: '/home', lazy: () => import('./layouts/MainLayout.jsx').then((m) => ({ Component: m.default })) },
            ],
         },
      ],
   },
])

export default router