import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// Adjusted relative path: remove extra 'src/' segment
import { Label } from '../../../components/ui/label'

describe('Label component', () => {
  it('renders the children text', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('forwards htmlFor attribute correctly', () => {
    render(<Label htmlFor="input-id">Linked Label</Label>)
    const labelElement = screen.getByText('Linked Label')
    expect(labelElement).toHaveAttribute('for', 'input-id')
  })

  it('applies additional className', () => {
    render(<Label className="custom-class">Styled Label</Label>)
    const labelElement = screen.getByText('Styled Label')
    expect(labelElement).toHaveClass('custom-class')
  })

  it('renders with default variant classes', () => {
    render(<Label>Default Style</Label>)
    const labelElement = screen.getByText('Default Style')
    // base classes from cva variant
    expect(labelElement).toHaveClass('text-sm', 'font-medium', 'leading-none')
  })
})
