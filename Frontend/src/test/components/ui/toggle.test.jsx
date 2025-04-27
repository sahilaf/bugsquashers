import React, { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Toggle } from '../../../components/ui/toggle'

describe('Toggle component', () => {
  it('forwards ref and renders a button element', () => {
    const ref = createRef()
    render(<Toggle ref={ref} data-testid="toggle" />)
    const btn = ref.current
    expect(btn).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByTestId('toggle')).toBe(btn)
  })

  it('applies disabled prop correctly', () => {
    render(<Toggle disabled data-testid="toggle-disabled" />)
    const btn = screen.getByTestId('toggle-disabled')
    expect(btn).toBeDisabled()
  })

  it('merges custom className and applies variant/size via toggleVariants', () => {
    render(
      <Toggle
        variant="outline"
        size="lg"
        className="custom-class"
        data-testid="toggle-variant"
      />
    )
    const btn = screen.getByTestId('toggle-variant')
    expect(btn).toHaveClass('custom-class')
    // toggleVariants should add data attributes for variant/size, here we ensure classList is not empty
    expect(btn.className.split(' ').length).toBeGreaterThan(1)
  })

  it('toggles pressed state in uncontrolled mode with defaultPressed', () => {
    render(<Toggle defaultPressed data-testid="toggle-press" />)
    const btn = screen.getByTestId('toggle-press')
    // initial state is "on"
    expect(btn).toHaveAttribute('data-state', 'on')
    // click to toggle off
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('data-state', 'off')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(
      <Toggle value="on" onPressedChange={() => {}} onClick={handleClick} data-testid="toggle-click" />
    )
    const btn = screen.getByTestId('toggle-click')
    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('renders all variant and size combinations without error', () => {
    const variants = ['default', 'outline']
    const sizes = ['default', 'sm', 'lg']
    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const key = `${variant}-${size}`
        render(
          <Toggle
            variant={variant}
            size={size}
            data-testid={`toggle-${key}`}
          />
        )
        expect(screen.getByTestId(`toggle-${key}`)).toBeInTheDocument()
      })
    })
  })
})
