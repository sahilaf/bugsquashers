// src/test/pages/cart/Cart.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// Mock react-router-dom to provide a navigateMock
vi.mock('react-router-dom', () => {
  const navigate = vi.fn();
  return {
    __esModule: true,
    useNavigate: () => navigate,
    navigateMock: navigate,
  };
});

// Mock react-hot-toast with inlined mocks
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'react-hot-toast';
import { navigateMock } from 'react-router-dom';
import * as CartContex from '../../../pages/cart/context/CartContex';
import Cart from '../../../pages/cart/Cart';

// Mock UI and child components
vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));
vi.mock('../../../components/ui/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
}));
vi.mock('../../../pages/cart/components/LoadingCart', () => ({ default: () => <div>LoadingCart</div> }));
vi.mock('../../../pages/cart/components/ErrorCart', () => ({ default: ({ error }) => <div>ErrorCart: {error}</div> }));
vi.mock('../../../pages/cart/components/EmptyCart', () => ({ default: () => <div>EmptyCart</div> }));
vi.mock('../../../pages/cart/components/NeedHelp', () => ({ default: () => <div>NeedHelp</div> }));
vi.mock('../../../pages/cart/components/OrderSummary', () => ({
  default: ({ subtotal, total, handleCheckout }) => (
    <div data-testid="order-summary">
      Summary {subtotal}-{total}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  ),
}));
vi.mock('../../../pages/cart/components/CartItem', () => ({
  default: ({ item }) => <div data-testid="cart-item">{item.productId.name}-qty{item.quantity}</div>,
}));

// Shared stubs for context methods
const fetchCartStub = vi.fn();
const updateQuantityStub = vi.fn();
const removeFromCartStub = vi.fn();
const addToCartStub = vi.fn();

// Helper to spy on useCart return
const mockUseCart = (overrides) => {
  vi.spyOn(CartContex, 'useCart').mockReturnValue({
    loading: false,
    error: '',
    cartItems: [],
    fetchCart: fetchCartStub,
    updateQuantity: updateQuantityStub,
    removeFromCart: removeFromCartStub,
    addToCart: addToCartStub,
    ...overrides,
  });
};

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseCart({ loading: true });
    render(<Cart />);
    expect(screen.getByText('LoadingCart')).toBeInTheDocument();
    expect(fetchCartStub).toHaveBeenCalled();
  });

  it('renders error when no items', () => {
    mockUseCart({ loading: false, error: 'Fetch failed', cartItems: [] });
    render(<Cart />);
    expect(screen.getByText('ErrorCart: Fetch failed')).toBeInTheDocument();
  });

  it('renders empty cart when no error and no items', () => {
    mockUseCart({ loading: false, error: '', cartItems: [] });
    render(<Cart />);
    expect(screen.getByText('EmptyCart')).toBeInTheDocument();
  });

  it('renders items and summary, and navigates on checkout', async () => {
    const items = [{ productId: { _id: '1', name: 'Item1', price: 10 }, quantity: 2 }];
    // subtotal=20, shipping=5.99, tax=1.6, total=27.59
    mockUseCart({ cartItems: items });
    render(<Cart />);
    expect(screen.getByText(/shopping cart/i)).toBeInTheDocument();
    expect(screen.getByTestId('cart-item')).toHaveTextContent('Item1-qty2');
    expect(screen.getByTestId('order-summary')).toHaveTextContent('Summary 20-27.59');

    await userEvent.click(screen.getByText('Checkout'));
    expect(navigateMock).toHaveBeenCalledWith('/checkout');
  });

  it('clears cart and shows success toast', async () => {
    const items = [
      { productId: { _id: '1', name: 'Item1', price: 10 }, quantity: 1 },
      { productId: { _id: '2', name: 'Item2', price: 5 }, quantity: 1 },
    ];
    mockUseCart({ cartItems: items });
    render(<Cart />);

    await userEvent.click(screen.getByText(/clear cart/i));
    expect(removeFromCartStub).toHaveBeenCalledTimes(2);
    expect(removeFromCartStub).toHaveBeenCalledWith('1');
    expect(removeFromCartStub).toHaveBeenCalledWith('2');
    expect(toast.success).toHaveBeenCalledWith('Cart Cleared', expect.objectContaining({ description: expect.any(String) }));
  });

  it('handles clear cart error and shows error toast', async () => {
    const items = [{ productId: { _id: '1', name: 'Item1', price: 10 }, quantity: 1 }];
    removeFromCartStub.mockRejectedValue(new Error('fail'));
    mockUseCart({ cartItems: items });
    render(<Cart />);

    await userEvent.click(screen.getByText(/clear cart/i));
    expect(toast.error).toHaveBeenCalledWith('Error Clearing Cart', expect.objectContaining({ description: expect.any(String) }));
  });

  it('shows inline error and retry button when error with items', async () => {
    const items = [{ productId: { _id: '1', name: 'Item1', price: 10 }, quantity: 1 }];
    mockUseCart({ error: 'Item not found', cartItems: items });
    render(<Cart />);

    expect(screen.getByText('Item not found')).toBeInTheDocument();
    await userEvent.click(screen.getByText(/try adding the item again/i));
    expect(addToCartStub).toHaveBeenCalledWith('1');
  });
});
