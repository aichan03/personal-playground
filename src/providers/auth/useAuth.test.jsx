import { describe, test, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { AuthContext } from './AuthContext.js'
import { useAuth } from './useAuth.js'

describe('useAuth', () => {
   test('throws when used outside AuthProvider', () => {
      vi.spyOn(console, 'error').mockImplementation(() => { }) // React logs the thrown error

      expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider')
   })

   test('returns the context value inside a provider', () => {
      const value = { user: null, loading: false, isAuthenticated: false }
      const wrapper = ({ children }) => (
         <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current).toBe(value)
   })
})