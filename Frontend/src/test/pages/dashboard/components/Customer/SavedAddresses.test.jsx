// src/test/pages/dashboard/components/Customer/SavedAddresses.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Stub UI Card components ---
vi.mock('../../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="card-title">{children}</h2>,
  CardContent: ({ children }) => <div data-testid="card-content">{children}</div>,
}))

// --- Stub AddressCard ---
vi.mock(
  '../../../../../pages/dashboard/components/Customer/AddressCard',
  () => ({
    AddressCard: ({ address, onEdit, onDelete }) => (
      <div data-testid={`address-${address.id}`}>
        <span>{address.name}</span>
        <button
          data-testid={`edit-${address.id}`}
          onClick={() =>
            onEdit({ ...address, name: address.name + ' Edited' })
          }
        >
          Edit
        </button>
        <button
          data-testid={`delete-${address.id}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    ),
  })
)

// --- Stub AddAddressDialog ---
vi.mock(
  '../../../../../pages/dashboard/components/Customer/AddAddressDialog',
  () => ({
    AddAddressDialog: ({ open, onOpenChange, onAdd }) => (
      <div data-testid="add-dialog" data-open={open ? 'true' : 'false'}>
        <button
          data-testid="add-btn"
          onClick={() =>
            onAdd({
              id: 3,
              name: 'New Name',
              street: '789 Pine Rd',
              city: 'Newcity',
              state: 'NC',
              zip: '55555',
              country: 'USA',
            })
          }
        >
          Add
        </button>
      </div>
    ),
  })
)

// Now import the component under test
import { SavedAddresses } from '../../../../../pages/dashboard/components/Customer/SavedAddresses'

describe('<SavedAddresses />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and initial two addresses', () => {
    render(<SavedAddresses />)

    // Card and header elements
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-title')).toHaveTextContent('Saved Addresses')

    // Two initial AddressCard stubs
    expect(screen.getByTestId('address-1')).toHaveTextContent('John Doe')
    expect(screen.getByTestId('address-2')).toHaveTextContent('Jane Smith')
  })

  it('shows the AddAddressDialog closed initially', () => {
    render(<SavedAddresses />)
    const addDialog = screen.getByTestId('add-dialog')
    expect(addDialog).toHaveAttribute('data-open', 'false')
  })

  it('adds a new address when Add button is clicked', () => {
    render(<SavedAddresses />)
    // click the stubbed Add button
    fireEvent.click(screen.getByTestId('add-btn'))
    // new AddressCard stub should appear
    expect(screen.getByTestId('address-3')).toHaveTextContent('New Name')
  })

  it('edits an existing address when Edit button is clicked', () => {
    render(<SavedAddresses />)
    // click Edit on the first address
    fireEvent.click(screen.getByTestId('edit-1'))
    expect(screen.getByTestId('address-1')).toHaveTextContent('John Doe Edited')
    // second address remains unchanged
    expect(screen.getByTestId('address-2')).toHaveTextContent('Jane Smith')
  })

  it('deletes an address when Delete button is clicked', () => {
    render(<SavedAddresses />)
    // delete the second address
    fireEvent.click(screen.getByTestId('delete-2'))
    // first remains
    expect(screen.getByTestId('address-1')).toBeInTheDocument()
    // second should be gone
    expect(screen.queryByTestId('address-2')).toBeNull()
  })
})
