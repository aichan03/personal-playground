import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { api } from '../../lib/api.js'
import { AuthProvider } from './AuthProvider.jsx'
import { useAuth } from './useAuth.js'
import { ADMIN, PUBLIC_USER } from '../../../tests/data/users.js'

vi.mock('../../lib/api.js', () => ({
   api: { get: vi.fn(), post: vi.fn() },
}))

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

const renderAuth = async () => {
   const hook = renderHook(() => useAuth(), { wrapper })
   await waitFor(() => expect(hook.result.current.loading).toBe(false))
   return hook
}

describe('AuthProvider', () => {
   beforeEach(() => {
      vi.resetAllMocks()
      api.get.mockResolvedValue({ data: { user: PUBLIC_USER } })
      api.post.mockResolvedValue({ data: { user: PUBLIC_USER } })
   })

   describe('session restore', () => {
      test('is loading until /me resolves', async () => {
         const { result } = renderHook(() => useAuth(), { wrapper })

         expect(result.current.loading).toBe(true)
         expect(result.current.isAuthenticated).toBe(false)

         await waitFor(() => expect(result.current.loading).toBe(false))
      })

      test('sets the user when /me succeeds', async () => {
         const { result } = await renderAuth()

         expect(api.get).toHaveBeenCalledWith('/me')
         expect(result.current.user).toEqual(PUBLIC_USER)
         expect(result.current.isAuthenticated).toBe(true)
      })

      test('stays signed out when /me fails', async () => {
         api.get.mockRejectedValue(new Error('Unauthorized'))

         const { result } = await renderAuth()

         expect(result.current.user).toBeNull()
         expect(result.current.isAuthenticated).toBe(false)
      })
   })

   describe('login', () => {
      beforeEach(() => {
         api.get.mockRejectedValue(new Error('Unauthorized'))
      })

      test('posts credentials, defaults remember to true and stores the user', async () => {
         const { result } = await renderAuth()

         let returned
         await act(async () => {
            returned = await result.current.login({ email: ADMIN.email, password: ADMIN.password })
         })

         expect(api.post).toHaveBeenCalledWith('/login', {
            email: ADMIN.email,
            password: ADMIN.password,
            remember: true,
         })
         expect(returned).toEqual(PUBLIC_USER)
         expect(result.current.user).toEqual(PUBLIC_USER)
         expect(result.current.isAuthenticated).toBe(true)
      })

      test('respects remember = false', async () => {
         const { result } = await renderAuth()

         await act(async () => {
            await result.current.login({ email: ADMIN.email, password: ADMIN.password, remember: false })
         })

         expect(api.post).toHaveBeenCalledWith(
            '/login',
            expect.objectContaining({ remember: false }),
         )
      })

      test('propagates the error and stays signed out when login fails', async () => {
         api.post.mockRejectedValue(new Error('Invalid credentials'))
         const { result } = await renderAuth()

         await act(async () => {
            await expect(
               result.current.login({ email: ADMIN.email, password: 'wrong-password' }),
            ).rejects.toThrow('Invalid credentials')
         })

         expect(result.current.user).toBeNull()
      })
   })

   describe('logout', () => {
      test('posts to /logout and clears the user', async () => {
         const { result } = await renderAuth()
         expect(result.current.isAuthenticated).toBe(true)

         await act(async () => {
            await result.current.logout()
         })

         expect(api.post).toHaveBeenCalledWith('/logout')
         expect(result.current.user).toBeNull()
         expect(result.current.isAuthenticated).toBe(false)
      })

      test('clears the user even when the request fails', async () => {
         api.post.mockRejectedValue(new Error('Network error'))
         const { result } = await renderAuth()

         await act(async () => {
            await expect(result.current.logout()).rejects.toThrow('Network error')
         })

         expect(result.current.user).toBeNull()
      })
   })
})