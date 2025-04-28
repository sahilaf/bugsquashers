// src/test/pages/dashboard/components/Customer/EditAddressDialog.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub AddressDialog so we can inspect its props and children
vi.mock(
  '../../../../../components/ui/dialog',
  () => ({
    Dialog: ({ open, onOpenChange, children }) => (
      <div data-testid="dialog" data-open={open ? 'true' : 'false'}>
        {children}
      </div>
    ),
    DialogContent: ({ children }) => <div data-testid="content">{children}</div>,
    DialogHeader: ({ children }) => <div data-testid="header">{children}</div>,
    DialogTitle: ({ children }) => <h1 data-testid="title">{children}</h1>,
  })
)

// Stub AddressForm to simulate form submission
vi.mock(
  '../../../../../components/ui/input',
  () => ({ Input: props => <input {...props} /> })
)
vi.mock(
  '../../../../../components/ui/label',
  () => ({ Label: props => <label {...props} /> })
)
vi.mock(
  '../../../../../components/ui/button',
  () => ({ Button: props => <button {...props} /> })
)
vi.mock(
  '../../../../../pages/dashboard/components/Customer/AddressForm',
  () => ({
    AddressForm: ({ address, onSubmit, buttonText }) => (
      <form data-testid="form" onSubmit={e => { e.preventDefault(); onSubmit({ ...address, name: 'Edited' }) }}>
        <button type="submit">{buttonText}</button>
      </form>
    ),
  })
)

// Import the component under test
import { EditAddressDialog } from '../../../../../pages/dashboard/components/Customer/EditAddressDialog'

describe('<EditAddressDialog />', () => {
  const sampleAddress = {
    id:      42,
    name:    'Home',
    street:  '123 Main',
    city:    'Testville',
    state:   'TS',
    zip:     '12345',
    country: 'Countryland',
  }
  let onOpenChange, onSave

  beforeEach(() => {
    onOpenChange = vi.fn()
    onSave       = vi.fn()
  })

  it('renders with given title, open state, and initial address in form', () => {
    render(
      <EditAddressDialog
        address={sampleAddress}
        open={true}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    )
    // Dialog wrapper open
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('data-open', 'true')
    // Title
    expect(screen.getByTestId('title')).toHaveTextContent('Edit Address')
    // Form and buttonText
    const form = screen.getByTestId('form')
    expect(form).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('passes address prop to AddressForm and uses buttonText override', () => {
    render(
      <EditAddressDialog
        address={sampleAddress}
        open={false}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    )
    // Even when closed, children render in our stub
    expect(screen.getByTestId('form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('invokes onSave with updated address and closes dialog on submit', () => {
    render(
      <EditAddressDialog
        address={sampleAddress}
        open={true}
        onOpenChange={onOpenChange}
        onSave={onSave}
      />
    )
    // Submit the form
    fireEvent.submit(screen.getByTestId('form'))
    // onSave called with edited address
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({ ...sampleAddress, name: 'Edited' })
    // onOpenChange called to close dialog
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
