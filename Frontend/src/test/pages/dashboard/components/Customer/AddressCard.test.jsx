// src/test/pages/dashboard/components/Customer/AddressCard.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub only the EditAddressDialog import
vi.mock(
  '../../../../../pages/dashboard/components/Customer/EditAddressDialog',
  () => ({
    EditAddressDialog: ({ address, open, onOpenChange, onSave }) => (
      <div data-testid="edit-dialog" data-open={open ? 'true' : 'false'}>
        <button
          data-testid="save-btn"
          onClick={() => {
            onSave({ ...address, street: 'Edited Street' })
            onOpenChange(false)
          }}
        >
          Save
        </button>
      </div>
    ),
  })
)

import { AddressCard } from '../../../../../pages/dashboard/components/Customer/AddressCard'

describe('<AddressCard />', () => {
  const sample = {
    name:    'Home',
    street:  '123 Main St',
    city:    'Testville',
    state:   'TS',
    zip:     '12345',
    country: 'Testland',
  }
  let onEdit, onDelete

  beforeEach(() => {
    onEdit = vi.fn()
    onDelete = vi.fn()
  })

  it('renders all address fields', () => {
    render(<AddressCard address={sample} onEdit={onEdit} onDelete={onDelete} />)

    // Heading with the name
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()

    // Street line
    expect(screen.getByText('123 Main St')).toBeInTheDocument()

    // City, State ZIP (allow flexible whitespace)
    expect(
      screen.getByText(/Testville,\s*TS\s*12345/)
    ).toBeInTheDocument()

    // Country
    expect(screen.getByText('Testland')).toBeInTheDocument()
  })

  it('calls onDelete when the Delete button is clicked', () => {
    render(<AddressCard address={sample} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('toggles the Edit dialog open and closed', () => {
    render(<AddressCard address={sample} onEdit={onEdit} onDelete={onDelete} />)

    const dialog = screen.getByTestId('edit-dialog')
    // initially closed
    expect(dialog).toHaveAttribute('data-open', 'false')

    // open it
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(dialog).toHaveAttribute('data-open', 'true')

    // close it via the stubbed save (we’ll test save next)
  })

  it('calls onEdit with updated address when Save is clicked and closes dialog', () => {
    render(<AddressCard address={sample} onEdit={onEdit} onDelete={onDelete} />)

    // open dialog
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    // click Save in our stub
    fireEvent.click(screen.getByTestId('save-btn'))

    // onEdit should have been called with the modified address
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith({
      ...sample,
      street: 'Edited Street',
    })

    // the stub also calls onOpenChange(false), so dialog should close
    const dialog = screen.getByTestId('edit-dialog')
    expect(dialog).toHaveAttribute('data-open', 'false')
  })
})
