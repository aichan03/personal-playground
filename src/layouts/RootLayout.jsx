import { ConfigProvider } from 'antd'
import { Outlet } from 'react-router'

import { AuthProvider } from '../providers/auth/AuthProvider.jsx'
import { useTheme } from '../providers/theme/useTheme.js'

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
