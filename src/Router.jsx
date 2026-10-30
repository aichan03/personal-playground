import { createBrowserRouter } from 'react-router'
import ErrorPage from './pages/Errorpage'
import RootLayout from './layouts/RootLayout.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Login from './pages/Login.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
   {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/',
            element: (
               <PublicOnlyRoute>
                  <Login />
               </PublicOnlyRoute>
            ),
         },
         {
            element: <ProtectedRoute />,
            children: [{ path: '/home', element: <MainLayout /> }],
         },
      ],
   },
])

export default router