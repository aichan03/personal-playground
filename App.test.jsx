import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './src/App'

describe('App', () => {
   it('renders the count button', () => {
      render(<App />)
      expect(screen.getByText(/count is 0/i)).toBeInTheDocument()
   })

   it('increments count on click', () => {
      render(<App />)
      const button = screen.getByText(/count is 0/i)
      fireEvent.click(button)
      expect(screen.getByText(/count is 1/i)).toBeInTheDocument()
   })
})