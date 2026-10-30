import { useState, useMemo, useCallback } from 'react'
import { theme as antdTheme } from 'antd'
import { ThemeContext } from './themeContext.js'

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light')
  const [primaryColor, setPrimaryColor] = useState('#1677ff')

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  const themeConfig = useMemo(
    () => ({
      algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: primaryColor,
        borderRadius: 8,
      },
    }),
    [mode, primaryColor],
  )

  const value = useMemo(
    () => ({ mode, toggleMode, primaryColor, setPrimaryColor, themeConfig }),
    [mode, toggleMode, primaryColor, themeConfig],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}