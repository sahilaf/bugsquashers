import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import EmptyCart from '../../../../pages/cart/components/EmptyCart';

// Mock icons
vi.mock('lucide-react', () => ({
  ShoppingBag: (props) => <svg data-testid="ShoppingBag" {...props} />,
  ArrowLeft: (props) => <svg data-testid="ArrowLeft" {...props} />,
}));

// Mock UI components
vi.mock('../../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="Button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));
vi.mock('../../../../components/ui/card', () => ({
  Card: ({ children, ...props }) => (
    <div data-testid="Card" {...props}>
      {children}
    </div>
  ),
}));

describe('EmptyCart component', () => {
  afterEach(() => cleanup());

  it('renders the empty cart page with all elements', () => {
    const mockNavigate = vi.fn();
    render(<EmptyCart navigate={mockNavigate} />);

    // Page title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Shopping Cart');

    // Card wrapper
    expect(screen.getByTestId('Card')).toBeInTheDocument();

    // Icons and messages
    expect(screen.getByTestId('ShoppingBag')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText("Looks like you haven't added anything to your cart yet.")).toBeInTheDocument();

    // Continue Shopping button
    const button = screen.getByTestId('Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Continue Shopping');
  });

  it('calls navigate with "/market" when Continue Shopping is clicked', () => {
    const mockNavigate = vi.fn();
    render(<EmptyCart navigate={mockNavigate} />);
    fireEvent.click(screen.getByTestId('Button'));
    expect(mockNavigate).toHaveBeenCalledWith('/market');
  });
});
