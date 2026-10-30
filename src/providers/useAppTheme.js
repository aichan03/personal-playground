import { useContext } from 'react'
import { ThemeContext } from './themeContext'

export function useAppTheme() {
   const ctx = useContext(ThemeContext)
   if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
   return ctx
}