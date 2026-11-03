import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './Home'

describe('Home page', () => {
  test('renders the welcome heading and description', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { level: 2, name: /welcome in the react playground/i }),
    ).toBeVisible()
    expect(screen.getByText(/personal website to showcase/i)).toBeVisible()
  })
})
