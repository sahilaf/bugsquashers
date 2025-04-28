// src/test/pages/dashboard/components/Customer/AddAddressDialog.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mock AddressDialog (5 levels up to src/pages/dashboard/...) ---
vi.mock(
  '../../../../../pages/dashboard/components/Customer/AddressDialog',
  () => ({
    AddressDialog: ({ title, open, onOpenChange, children }) => (
      <div
        data-testid="dialog"
        data-open={open ? 'true' : 'false'}
        data-title={title}
      >
        {children}
      </div>
    ),
  })
)

// --- Mock AddressForm (same depth) ---
vi.mock(
  '../../../../../pages/dashboard/components/Customer/AddressForm',
  () => ({
    AddressForm: ({ onSubmit }) => (
      <button
        data-testid="form-submit"
        onClick={() =>
          onSubmit({ street: '123 Main St', city: 'Testville' })
        }
      >
        Submit
      </button>
    ),
  })
)

// Now import the component under test (5 ups)
import { AddAddressDialog } from '../../../../../pages/dashboard/components/Customer/AddAddressDialog'

describe('<AddAddressDialog />', () => {
  let onAdd, onOpenChange

  beforeEach(() => {
    onAdd = vi.fn()
    onOpenChange = vi.fn()
  })

  it('renders AddressDialog with correct props', () => {
    render(
      <AddAddressDialog
        open={true}
        onOpenChange={onOpenChange}
        onAdd={onAdd}
      />
    )
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'true')
    expect(dialog).toHaveAttribute('data-title', 'Add New Address')
  })

  it('calls onAdd with new address + id and then onOpenChange(false)', () => {
    render(
      <AddAddressDialog
        open={false}
        onOpenChange={onOpenChange}
        onAdd={onAdd}
      />
    )
    fireEvent.click(screen.getByTestId('form-submit'))

    // onAdd should be called once with the new address + numeric id
    expect(onAdd).toHaveBeenCalledTimes(1)
    const added = onAdd.mock.calls[0][0]
    expect(added).toMatchObject({
      street: '123 Main St',
      city: 'Testville',
    })
    expect(typeof added.id).toBe('number')

    // then the dialog is closed
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
