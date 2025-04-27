import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useToast } from '../../../hooks/use-toast'
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from '../../../components/ui/toast'
import { Toaster } from '../../../components/ui/toaster'

// Mock modules
vi.mock('../../../hooks/use-toast', () => ({
  useToast: vi.fn(),
}))
vi.mock('../../../components/ui/toast', () => ({
  ToastProvider: vi.fn(),
  Toast: vi.fn(),
  ToastTitle: vi.fn(),
  ToastDescription: vi.fn(),
  ToastClose: vi.fn(),
  ToastViewport: vi.fn(),
}))

describe('Toaster component', () => {
  beforeEach(() => {
    // Default toasts
    vi.mocked(useToast).mockReturnValue({
      toasts: [
        { id: '1', title: 'Title 1', description: 'Desc 1', action: <button data-testid="action-1">A1</button> },
        { id: '2', title: null, description: 'Desc 2', action: null },
        { id: '3', title: 'Title 3', description: null, action: <span data-testid="action-3">A3</span> },
      ],
    })

    // Mock implementations
    vi.mocked(ToastProvider).mockImplementation(({ children }) => <div data-testid="provider">{children}</div>)
    vi.mocked(Toast).mockImplementation(({ children }) => <div data-testid="toast">{children}</div>)
    vi.mocked(ToastTitle).mockImplementation(({ children }) => <div data-testid="toast-title">{children}</div>)
    vi.mocked(ToastDescription).mockImplementation(({ children }) => <div data-testid="toast-description">{children}</div>)
    vi.mocked(ToastClose).mockImplementation(() => <button data-testid="toast-close">Close</button>)
    vi.mocked(ToastViewport).mockImplementation(() => <div data-testid="viewport" />)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders ToastProvider and ToastViewport', () => {
    render(<Toaster />)
    expect(screen.getByTestId('provider')).toBeInTheDocument()
    expect(screen.getByTestId('viewport')).toBeInTheDocument()
  })

  it('renders toasts with title, description, action, and close button', () => {
    render(<Toaster />)
    // Should render three toast containers
    const toasts = screen.getAllByTestId('toast')
    expect(toasts).toHaveLength(3)

    // First toast
    expect(screen.getByText('Title 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByTestId('action-1')).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-close')[0]).toBeInTheDocument()

    // Second toast
    expect(screen.queryByText('Title 2')).not.toBeInTheDocument()
    expect(screen.getByText('Desc 2')).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-close')[1]).toBeInTheDocument()

    // Third toast
    expect(screen.getByText('Title 3')).toBeInTheDocument()
    expect(screen.queryByText('Desc 3')).not.toBeInTheDocument()
    expect(screen.getByTestId('action-3')).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-close')[2]).toBeInTheDocument()
  })

  it('handles no toasts gracefully', () => {
    vi.mocked(useToast).mockReturnValue({ toasts: [] })
    render(<Toaster />)
    expect(screen.getByTestId('provider')).toBeInTheDocument()
    expect(screen.getByTestId('viewport')).toBeInTheDocument()
    expect(screen.queryAllByTestId('toast')).toHaveLength(0)
  })
})
