import { Outlet } from 'react-router'
import { ConfigProvider } from 'antd'
import { useAppTheme } from '../providers/ThemeProvider.jsx'
import { AuthProvider } from '../providers/AuthProvider.jsx'

export default function RootLayout() {
   const { themeConfig } = useAppTheme()
   return (
      <ConfigProvider theme={themeConfig}>
         <AuthProvider>
            <Outlet />
         </AuthProvider>
      </ConfigProvider>
   )
}