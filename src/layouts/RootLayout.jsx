import { Outlet } from 'react-router'
import { ConfigProvider } from 'antd'
import { useTheme } from '../providers/theme/useTheme.js'
import { AuthProvider } from '../providers/auth/AuthProvider.jsx'

export default function RootLayout() {
   const { themeConfig } = useTheme()
   return (
      <ConfigProvider theme={themeConfig}>
         <AuthProvider>
            <Outlet />
         </AuthProvider>
      </ConfigProvider>
   )
}