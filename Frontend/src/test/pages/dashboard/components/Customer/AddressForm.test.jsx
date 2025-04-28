// src/test/pages/dashboard/components/Customer/AddressForm.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub UI components
vi.mock('../../../../../components/ui/input', () => ({
  Input: props => <input {...props} />
}))
vi.mock('../../../../../components/ui/label', () => ({
  Label: props => <label {...props} />
}))
vi.mock('../../../../../components/ui/button', () => ({
  Button: props => <button {...props} />
}))

import { AddressForm } from '../../../../../pages/dashboard/components/Customer/AddressForm'

describe('<AddressForm />', () => {
  let onSubmit

  beforeEach(() => {
    onSubmit = vi.fn()
  })

  it('renders the name field and default Save button', () => {
    render(<AddressForm onSubmit={onSubmit} />)

    // Label + input present
    const nameInput = screen.getByLabelText('Full Name')
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue('')

    // Default submit button
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('submits empty formData when nothing is changed', () => {
    const { container } = render(<AddressForm onSubmit={onSubmit} />)
    const form = container.querySelector('form')
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledWith({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    })
  })

  it('updates the name field and submits the updated formData', () => {
    render(<AddressForm onSubmit={onSubmit} />)

    const nameInput = screen.getByLabelText('Full Name')
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Alice' } })
    expect(nameInput).toHaveValue('Alice')

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    })
  })

  it('initializes with provided address prop and submits it unchanged', () => {
    const initial = {
      name: 'Bob',
      street: '1 Road',
      city: 'Townsville',
      state: 'TS',
      zip: '00001',
      country: 'Countryland'
    }
    render(<AddressForm address={initial} onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Full Name')).toHaveValue('Bob')
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSubmit).toHaveBeenCalledWith(initial)
  })

  it('uses custom buttonText when passed in', () => {
    render(<AddressForm onSubmit={onSubmit} buttonText="Add Address" />)
    expect(
      screen.getByRole('button', { name: 'Add Address' })
    ).toBeInTheDocument()
  })
})
