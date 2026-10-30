import { createBrowserRouter, Outlet } from "react-router";
import ErrorPage from "./pages/Errorpage";
import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import { useAppTheme } from "./providers/ThemeProvider.jsx";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute.jsx";

function Providers() {
   const { themeConfig } = useAppTheme();
   return (
      <ConfigProvider theme={themeConfig}>
         <AuthProvider>
            <Outlet />
         </AuthProvider>
      </ConfigProvider>
   );
}

const router = createBrowserRouter([
   {
      element: <Providers />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: "/",
            element: (
               <PublicOnlyRoute>
                  <Login />
               </PublicOnlyRoute>
            ),
         },
         {
            element: <ProtectedRoute />,
            children: [
               { path: "/home", element: <MainLayout /> },
            ],
         },
      ],
   },
]);

export default router;