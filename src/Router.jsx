import { createBrowserRouter } from "react-router";
import ErrorPage from "./pages/Errorpage";
import MainLayout from "./layouts/MainLayout.jsx";
import { useAppTheme } from "./providers/ThemeProvider.jsx";
import { ConfigProvider } from "antd";

function AppTheme() {
   const { themeConfig } = useAppTheme();
   return (
      <ConfigProvider theme={themeConfig}>
         <MainLayout />
      </ConfigProvider>
   );
}

const router = createBrowserRouter([
   {
      path: '/',
      element: <AppTheme />,
      errorElement: <ErrorPage />,
      children: [
         {
            index: true,
            lazy: () => import('./pages/Home.jsx').then((m) => ({ Component: m.default }))
         },
         {
            path: '*',
            lazy: () => import('./pages/NotFound.jsx').then((m) => ({ Component: m.default }))
         }
      ]
   }
]);

export default router
