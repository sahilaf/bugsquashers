// src/test/components/ui/progress.test.jsx

import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Progress } from '../../../components/ui/progress'

describe('Progress component', () => {
  it('renders the root and indicator elements', () => {
    render(<Progress data-testid="prog-root" />)

    // Root
    const root = screen.getByTestId('prog-root')
    expect(root).toBeInTheDocument()
    expect(root).toHaveClass('relative', 'h-4', 'w-full', 'overflow-hidden', 'rounded-full', 'bg-secondary')

    // Indicator (first child)
    const indicator = root.firstChild
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveClass('h-full', 'flex-1', 'bg-primary', 'transition-all')
  })

  it('applies correct transform style for given value', () => {
    render(<Progress data-testid="prog-root" value={75} />)

    const indicator = screen.getByTestId('prog-root').firstChild
    // 100 - 75 = 25 → translateX(-25%)
    expect(indicator).toHaveStyle({ transform: 'translateX(-25%)' })
  })

  it('defaults to 0 value (translateX(-100%)) when no value provided', () => {
    render(<Progress data-testid="prog-root" />)

    const indicator = screen.getByTestId('prog-root').firstChild
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('merges custom className and indicatorClassName', () => {
    render(
      <Progress
        data-testid="prog-root"
        className="custom-root"
        indicatorClassName="custom-indicator"
        value={50}
      />
    )

    const root = screen.getByTestId('prog-root')
    expect(root).toHaveClass('custom-root')

    const indicator = root.firstChild
    expect(indicator).toHaveClass('custom-indicator')
  })

  it('forwards ref to the root element', () => {
    const ref = createRef()
    render(<Progress ref={ref} data-testid="prog-root" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toBe(screen.getByTestId('prog-root'))
  })
})
