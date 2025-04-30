import React from 'react'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import DesktopNavigation from '../../../../src/components/Nav/DesktopNavigation'
import * as CartContext from '../../../../src/pages/cart/context/CartContex'

// Mock ThemeToggle to avoid complexity
vi.mock('../../../../src/components/Nav/ThemeToggle', () => ({
  __esModule: true,
  default: () => <button>ThemeToggle</button>,
}))

describe('DesktopNavigation Component', () => {
  let mockNavigate
  let mockHome
  let mockMarket
  let mockLogout
  let mockDashboardClick

  beforeEach(() => {
    mockNavigate = vi.fn()
    mockHome = vi.fn()
    mockMarket = vi.fn()
    mockLogout = vi.fn()
    mockDashboardClick = vi.fn()
    // Default cart count
    vi.spyOn(CartContext, 'useCart').mockReturnValue({ cartCount: 2 })
    // Mock fetch for chat
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ answer: 'Test answer' }) })
    )
  })

  // Utility to render with default handlers
  const renderNav = (props = {}) => {
    render(
      <MemoryRouter>
        <DesktopNavigation
          user={props.user ?? null}
          userData={props.userData ?? {}}
          navigate={mockNavigate}
          handleLogout={mockLogout}
          handleDashboardClick={mockDashboardClick}
          handleMarketClick={mockMarket}
          handleHomeClick={mockHome}
          loading={props.loading ?? false}
        />
      </MemoryRouter>
    )
  }

  it('Home and Market buttons trigger their handlers', async () => {
    renderNav()
    const homeBtn = screen.getByRole('button', { name: /^Home$/i })
    await userEvent.click(homeBtn)
    expect(mockHome).toHaveBeenCalledTimes(1)

    const marketBtn = screen.getByRole('button', { name: /^Market$/i })
    await userEvent.click(marketBtn)
    expect(mockMarket).toHaveBeenCalledTimes(1)
  })

  it('AI recommendations button navigates to the expected path', async () => {
    renderNav()
    const aiBtn = screen.getByText(/Ai recommendations/i).closest('button')
    await userEvent.click(aiBtn)
    // Accept either local or sonarcloud path
    const navArg = mockNavigate.mock.calls[0][0]
    expect(['/recommendation', '/airedirect']).toContain(navArg)
  })

  it('cart badge shows count and clicking navigates to cart', async () => {
    renderNav()
    const badge = screen.getByText('2')
    const cartBtn = badge.closest('button')
    expect(cartBtn).toBeInTheDocument()
    await userEvent.click(cartBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/cart')
  })

  it('renders Sign In and navigates to login', async () => {
    renderNav()
    const signInBtn = screen.getByRole('button', { name: /^Sign In$/i })
    await userEvent.click(signInBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('chat system initial message and response flow', async () => {
    renderNav()
    // Open chat via Support assistant button
    const supportBtn = screen.getByText(/Support assistant/i).closest('button')
    await userEvent.click(supportBtn)

    // Check initial bot message
    expect(await screen.findByText(/Hi! How can I help you today\?/i)).toBeInTheDocument()

    // Send a message and check response
    const input = screen.getByPlaceholderText(/Type your message\.{3}/i)
    await userEvent.type(input, 'Hello')
    const sendBtn = screen.getByRole('button', { name: /^Send$/i })
    await userEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Test answer')).toBeInTheDocument()
    })
  })
})
