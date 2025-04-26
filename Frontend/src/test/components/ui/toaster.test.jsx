import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the useToast hook
vi.mock('../../../hooks/use-toast', () => ({
  useToast: () => ({
    toasts: [
      { id: '1', title: 'Title 1', description: 'Desc 1', action: <button data-testid="action-1">A1</button> },
      { id: '2', title: null, description: 'Desc 2', action: null },
      { id: '3', title: 'Title 3', description: null, action: <span data-testid="action-3">A3</span> },
    ],
  }),
}))

// Mock Toast components
vi.mock('../../../components/ui/toast', () => ({
  ToastProvider: ({ children }) => <div data-testid="provider">{children}</div>,
  Toast: ({ children, ...props }) => <div data-testid={`toast-${props.id}`}>{children}</div>,
  ToastTitle: ({ children }) => <div data-testid="toast-title">{children}</div>,
  ToastDescription: ({ children }) => <div data-testid="toast-description">{children}</div>,
  ToastClose: () => <button data-testid="toast-close">Close</button>,
  ToastViewport: () => <div data-testid="viewport" />,
}))

import { Toaster } from '../../../components/ui/toaster'

describe('Toaster component', () => {
  it('renders ToastProvider and ToastViewport', () => {
    render(<Toaster />)
    expect(screen.getByTestId('provider')).toBeInTheDocument()
    expect(screen.getByTestId('viewport')).toBeInTheDocument()
  })

  it('renders toasts with title, description, action, and close button', () => {
    render(<Toaster />)
    // First toast has title, description, action
    const toast1 = screen.getByTestId('toast-1')
    expect(toast1).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-title')[0]).toHaveTextContent('Title 1')
    expect(screen.getAllByTestId('toast-description')[0]).toHaveTextContent('Desc 1')
    expect(screen.getByTestId('action-1')).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-close')[0]).toBeInTheDocument()

    // Second toast has no title but has description and close
    const toast2 = screen.getByTestId('toast-2')
    expect(toast2).toBeInTheDocument()
    // title should not render for toast2
    expect(screen.queryByTestId('toast-title')).not.toHaveTextContent('Title 2')
    expect(screen.getAllByTestId('toast-description')[1]).toHaveTextContent('Desc 2')
    expect(screen.getAllByTestId('toast-close')[1]).toBeInTheDocument()

    // Third toast has title and no description
    const toast3 = screen.getByTestId('toast-3')
    expect(toast3).toBeInTheDocument()
    expect(screen.getByText('Title 3')).toBeInTheDocument()
    expect(screen.queryByTestId('toast-description')).not.toHaveTextContent('Desc 3')
    expect(screen.getByTestId('action-3')).toBeInTheDocument()
    expect(screen.getAllByTestId('toast-close')[2]).toBeInTheDocument()
  })

  it('handles no toasts gracefully', () => {
    // Mock empty toasts
    vi.mocked(require('../../../hooks/use-toast').useToast).mockReturnValue({ toasts: [] })
    render(<Toaster />)
    // Provider and viewport still render
    expect(screen.getByTestId('provider')).toBeInTheDocument()
    expect(screen.getByTestId('viewport')).toBeInTheDocument()
    // No toast items
    expect(screen.queryByTestId(/^toast-/)).toBeNull()
  })
})
