import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../state/AuthContext'

// Avoid network calls during tests by routing to a page that doesn't fetch

describe('App', () => {
  it('renders navbar', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    )
    expect(getByText('SoundReviews')).toBeDefined()
  })
})
