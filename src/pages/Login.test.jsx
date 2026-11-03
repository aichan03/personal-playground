import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfigProvider } from 'antd'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import Login from './Login.jsx'
import { ADMIN, INVALID_EMAIL, WRONG_PASSWORD } from '../../tests/data/users.js'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  navigate: vi.fn(),
  toggleMode: vi.fn(),
  mode: 'light',
}))

vi.mock('react-router', () => ({ useNavigate: () => mocks.navigate }))
vi.mock('../providers/auth', () => ({ useAuth: () => ({ login: mocks.login }) }))
vi.mock('../providers/theme', () => ({
  useTheme: () => ({ mode: mocks.mode, toggleMode: mocks.toggleMode }),
}))

// motion: false so closing the Alert removes it immediately in jsdom
const renderLogin = () =>
  render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Login />
    </ConfigProvider>,
  )

const emailInput = () => screen.getByLabelText('Email')
const passwordInput = () => screen.getByLabelText('Password')
const submitButton = () => screen.getByRole('button', { name: 'Sign in' })

describe('Login page', () => {
  let user

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.mode = 'light'
    mocks.login.mockResolvedValue(undefined)
    user = userEvent.setup()
  })

  test('renders the login form', () => {
    renderLogin()

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    expect(screen.getByText(/welcome back to the my playground/i)).toBeVisible()
    expect(emailInput()).toBeVisible()
    expect(passwordInput()).toBeVisible()
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeChecked()
    expect(submitButton()).toBeEnabled()
    expect(screen.getByText(/demo: admin@example.com \/ password/i)).toBeVisible()
  })

  describe('validation', () => {
    test('requires email and password on empty submit', async () => {
      renderLogin()

      await user.click(submitButton())

      expect(await screen.findByText('Enter your email')).toBeVisible()
      expect(await screen.findByText('Enter your password')).toBeVisible()
      expect(mocks.login).not.toHaveBeenCalled()
    })

    test('rejects an invalid email format', async () => {
      renderLogin()

      await user.type(emailInput(), INVALID_EMAIL)
      await user.type(passwordInput(), ADMIN.password)
      await user.click(submitButton())

      expect(await screen.findByText('Enter a valid email address')).toBeVisible()
      expect(mocks.login).not.toHaveBeenCalled()
    })

    test('requires a password', async () => {
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.click(submitButton())

      expect(await screen.findByText('Enter your password')).toBeVisible()
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument()
      expect(mocks.login).not.toHaveBeenCalled()
    })
  })

  describe('interactions', () => {
    test('toggles password visibility', async () => {
      renderLogin()

      await user.type(passwordInput(), 'secret123')
      expect(passwordInput()).toHaveAttribute('type', 'password')

      await user.click(screen.getByRole('img', { name: /eye/ })) // antd eye icon
      expect(passwordInput()).toHaveAttribute('type', 'text')
    })

    test('shows the light label and calls toggleMode when the switch is clicked', async () => {
      renderLogin()

      const themeSwitch = screen.getByRole('switch')
      expect(themeSwitch).not.toBeChecked()
      expect(screen.getByText('Light')).toBeVisible()

      await user.click(themeSwitch)

      expect(mocks.toggleMode).toHaveBeenCalledTimes(1)
    })

    test('shows the dark label when the theme is dark', () => {
      mocks.mode = 'dark'
      renderLogin()

      expect(screen.getByRole('switch')).toBeChecked()
      expect(screen.getByText('Dark')).toBeVisible()
    })
  })

  describe('submission', () => {
    test('logs in with the form values and redirects to /home', async () => {
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.type(passwordInput(), ADMIN.password)
      await user.click(submitButton())

      await waitFor(() =>
        expect(mocks.login).toHaveBeenCalledWith({
          email: ADMIN.email,
          password: ADMIN.password,
          remember: true,
        }),
      )
      expect(mocks.navigate).toHaveBeenCalledWith('/home', { replace: true })
    })

    test('sends remember = false when unchecked', async () => {
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.type(passwordInput(), ADMIN.password)
      await user.click(screen.getByRole('checkbox', { name: /remember me/i }))
      await user.click(submitButton())

      await waitFor(() =>
        expect(mocks.login).toHaveBeenCalledWith(expect.objectContaining({ remember: false })),
      )
    })

    test('shows the button loading state while the request is pending', async () => {
      let resolveLogin
      mocks.login.mockReturnValue(new Promise((resolve) => (resolveLogin = resolve)))
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.type(passwordInput(), ADMIN.password)
      await user.click(submitButton())

      expect(await screen.findByRole('img', { name: 'loading' })).toBeVisible()

      resolveLogin()
      await waitFor(() => expect(mocks.navigate).toHaveBeenCalled())
      await waitFor(() =>
        expect(screen.queryByRole('img', { name: 'loading' })).not.toBeInTheDocument(),
      )
    })

    test('shows a dismissible alert when login fails', async () => {
      mocks.login.mockRejectedValue(new Error('Invalid credentials'))
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.type(passwordInput(), WRONG_PASSWORD)
      await user.click(submitButton())

      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent('Invalid credentials')
      expect(mocks.navigate).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: /close/i }))
      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })

    test('falls back to a generic message when the error has no message', async () => {
      mocks.login.mockRejectedValue(new Error(''))
      renderLogin()

      await user.type(emailInput(), ADMIN.email)
      await user.type(passwordInput(), WRONG_PASSWORD)
      await user.click(submitButton())

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.',
      )
    })
  })
})
