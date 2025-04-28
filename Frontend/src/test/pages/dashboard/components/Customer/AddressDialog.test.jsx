// src/test/pages/dashboard/components/Customer/AddressDialog.test.jsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// --- Stub the dialog UI components ---
vi.mock(
  '../../../../../components/ui/dialog',
  () => ({
    Dialog: ({ open, onOpenChange, children }) => (
      <div
        data-testid="dialog"
        data-open={open ? 'true' : 'false'}
        data-has-onopenchange={typeof onOpenChange === 'function' ? 'true' : 'false'}
      >
        {children}
      </div>
    ),
    DialogContent: ({ children }) => <div data-testid="content">{children}</div>,
    DialogHeader: ({ children }) => <div data-testid="header">{children}</div>,
    DialogTitle: ({ children }) => <h1 data-testid="title">{children}</h1>,
  })
)

// Import the component under test
import { AddressDialog } from '../../../../../pages/dashboard/components/Customer/AddressDialog'

describe('<AddressDialog />', () => {
  const mockChange = vi.fn()

  it('renders nothing when open is false except the wrapper', () => {
    render(
      <AddressDialog title="Test Title" open={false} onOpenChange={mockChange}>
        <div data-testid="child">Hello</div>
      </AddressDialog>
    )
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
    expect(dialog).toHaveAttribute('data-has-onopenchange', 'true')
    // children still rendered because we stubbed Dialog to always render children
    expect(screen.getByTestId('child')).toHaveTextContent('Hello')
  })

  it('renders the title inside DialogTitle and wraps children inside content/header', () => {
    render(
      <AddressDialog title="My Address" open={true} onOpenChange={mockChange}>
        <span data-testid="special-child">X</span>
      </AddressDialog>
    )
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    // Title
    expect(screen.getByTestId('title')).toHaveTextContent('My Address')
    // Structure
    expect(screen.getByTestId('header')).toContainElement(screen.getByTestId('title'))
    expect(screen.getByTestId('content')).toContainElement(screen.getByTestId('header'))
    // Child passed through
    expect(screen.getByTestId('content')).toContainElement(screen.getByTestId('special-child'))
  })
})
