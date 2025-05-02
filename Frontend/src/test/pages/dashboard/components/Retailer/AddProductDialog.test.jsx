// src/test/pages/dashboard/components/Retailer/AddProductDialog.test.jsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Stub dialog components
vi.mock('../../../../../components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }) => (
    <div data-testid="dialog" data-open={open ? 'true' : 'false'}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div data-testid="content">{children}</div>,
  DialogHeader: ({ children }) => <div data-testid="header">{children}</div>,
  DialogTitle: ({ children }) => <h1 data-testid="title">{children}</h1>,
}))

// Stub button, input, label
vi.mock('../../../../../components/ui/button', () => ({
  Button: props => <button {...props} />,
}))
vi.mock('../../../../../components/ui/input', () => ({
  Input: props => <input {...props} />,
}))
vi.mock('../../../../../components/ui/label', () => ({
  Label: props => <label {...props} />,
}))

// --- Updated Select stub exposes data-value ---
vi.mock('../../../../../components/ui/select', () => ({
  Select: ({ value, onValueChange }) => (
    <select
      data-testid="select"
      data-value={value}
      value={value}
      onChange={e => onValueChange(e.target.value)}
    />
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}))

// Stub icons
vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
  X:    () => <span data-testid="icon-x" />,
}))

import AddProductDialog from '../../../../../pages/dashboard/components/Retailer/AddProductDialog'

describe('<AddProductDialog />', () => {
  let onOpenChange, onAddProduct, container

  beforeEach(() => {
    onOpenChange  = vi.fn()
    onAddProduct = vi.fn()
    vi.clearAllMocks()

    const rendered = render(
      <AddProductDialog
        open={true}
        onOpenChange={onOpenChange}
        onAddProduct={onAddProduct}
        shopId="shop-1"
      />
    )
    container = rendered.container
  })

  it('renders dialog title and form fields', () => {
    // Dialog open / title
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('title')).toHaveTextContent('Add New Product')

    // Product Name
    expect(screen.getByLabelText('Product Name*')).toBeInTheDocument()

    // Category select: check our stub’s data-value
    const select = screen.getByTestId('select')
    expect(select).toHaveAttribute('data-value', 'Other')

    // Description field
    expect(screen.getByLabelText('Description')).toBeInTheDocument()

    // Price / Original Price / Quantity
    expect(screen.getByLabelText('Price (Bdt)*')).toBeInTheDocument()
    expect(screen.getByLabelText('Original Price (Bdt)')).toBeInTheDocument()
    expect(screen.getByLabelText('Quantity*')).toBeInTheDocument()

    // Feature input + icon
    expect(
      screen.getByPlaceholderText('Add a key feature')
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('icon-plus')[0]).toBeInTheDocument()

    // Image input + icon
    expect(
      screen.getByPlaceholderText('Enter image URL')
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('icon-plus')[1]).toBeInTheDocument()

    // Organic checkbox
    expect(screen.getByLabelText('Organic Product')).toBeInTheDocument()

    // Cancel & Submit buttons; ensure real submit exists
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument()
  })

  it('handles text and number input changes', () => {
    fireEvent.change(screen.getByLabelText('Product Name*'), {
      target: { name: 'name', value: 'Apple' },
    })
    expect(screen.getByLabelText('Product Name*')).toHaveValue('Apple')

    fireEvent.change(screen.getByLabelText('Price (Bdt)*'), {
      target: { name: 'price', value: '12.34', type: 'number' },
    })
    expect(screen.getByLabelText('Price (Bdt)*')).toHaveValue(12.34)

    fireEvent.change(screen.getByLabelText('Quantity*'), {
      target: { name: 'quantity', value: '5', type: 'number' },
    })
    expect(screen.getByLabelText('Quantity*')).toHaveValue(5)
  })

  it('adds and removes key features up to max 3', () => {
    const featureInput = screen.getByPlaceholderText('Add a key feature')
    const addFeatureBtn = screen.getAllByTestId('icon-plus')[0]

    fireEvent.change(featureInput, { target: { value: 'Fresh' } })
    fireEvent.click(addFeatureBtn)
    expect(screen.getByText('Fresh')).toBeInTheDocument()

    const removeBtns = screen.getAllByTestId('icon-x')
    fireEvent.click(removeBtns[0])
    expect(screen.queryByText('Fresh')).toBeNull()
  })

  it('adds and removes images', () => {
    const imgInput = screen.getByPlaceholderText('Enter image URL')
    const addImgBtn = screen.getAllByTestId('icon-plus')[1]

    fireEvent.change(imgInput, { target: { value: 'http://img.jpg' } })
    fireEvent.click(addImgBtn)
    expect(screen.getByAltText('Product preview 1')).toHaveAttribute(
      'src',
      'http://img.jpg'
    )

    const removeImgBtns = screen.getAllByTestId('icon-x')
    fireEvent.click(removeImgBtns[1])
    expect(screen.queryByAltText('Product preview 1')).toBeNull()
  })

  it('toggles organic checkbox', () => {
    const cb = screen.getByLabelText('Organic Product')
    expect(cb).not.toBeChecked()
    fireEvent.click(cb)
    expect(cb).toBeChecked()
  })

  it('calls onOpenChange(false) when Cancel clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('submits with correct data on Add Product', () => {
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Product Name*'), {
      target: { name: 'name', value: 'Banana' },
    })
    fireEvent.change(screen.getByLabelText('Price (Bdt)*'), {
      target: { name: 'price', value: '10', type: 'number' },
    })
    fireEvent.change(screen.getByLabelText('Quantity*'), {
      target: { name: 'quantity', value: '2', type: 'number' },
    })

    fireEvent.click(container.querySelector('button[type="submit"]'))

    expect(onAddProduct).toHaveBeenCalledTimes(1)
    expect(onAddProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Banana',
        price: 10,
        originalPrice: 10,
        quantity: 2,
      })
    )
  })
})
