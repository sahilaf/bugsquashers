// src/test/components/ui/radio-group.test.jsx

import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'

describe('RadioGroup & RadioGroupItem', () => {
  it('renders the group and items, and applies custom className', () => {
    render(
      <RadioGroup data-testid="rg" className="my-group">
        <RadioGroupItem data-testid="item-1" value="one" className="item-class" />
        <RadioGroupItem data-testid="item-2" value="two" />
      </RadioGroup>
    )

    const group = screen.getByTestId('rg')
    expect(group).toBeInTheDocument()
    expect(group).toHaveClass('grid', 'gap-2', 'my-group')

    const item1 = screen.getByTestId('item-1')
    const item2 = screen.getByTestId('item-2')
    expect(item1).toBeInTheDocument()
    expect(item1).toHaveClass('item-class')
    expect(item2).toBeInTheDocument()
  })

  it('allows selecting an item and shows its indicator', async () => {
    render(
      <RadioGroup defaultValue="one" data-testid="rg">
        <RadioGroupItem data-testid="item-1" value="one" />
        <RadioGroupItem data-testid="item-2" value="two" />
      </RadioGroup>
    )

    const item1 = screen.getByTestId('item-1')
    const item2 = screen.getByTestId('item-2')

    // By default, item1 is selected
    expect(item1).toHaveAttribute('data-state', 'checked')
    expect(item1.querySelector('svg')).toBeInTheDocument()
    expect(item2).toHaveAttribute('data-state', 'unchecked')

    // Click item2
    await userEvent.click(item2)
    expect(item2).toHaveAttribute('data-state', 'checked')
    expect(item2.querySelector('svg')).toBeInTheDocument()
    expect(item1).toHaveAttribute('data-state', 'unchecked')
  })

  it('respects the disabled prop', () => {
    render(
      <RadioGroup defaultValue="one">
        <RadioGroupItem data-testid="item-1" value="one" disabled />
        <RadioGroupItem data-testid="item-2" value="two" />
      </RadioGroup>
    )

    const item1 = screen.getByTestId('item-1')
    expect(item1).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    expect(item1).toBeDisabled()
  })

  it('forwards ref to the root', () => {
    const ref = createRef()
    render(<RadioGroup ref={ref} data-testid="rg" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toBe(screen.getByTestId('rg'))
  })
})
