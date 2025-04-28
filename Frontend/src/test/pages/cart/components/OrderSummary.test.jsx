import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { vi } from 'vitest';
import OrderSummary from '../../../../pages/cart/components/OrderSummary';

// Mock UI components
vi.mock('../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="CardHeader">{children}</div>,
  CardTitle: ({ children }) => <h2 data-testid="CardTitle">{children}</h2>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>,
  CardFooter: ({ children }) => <div data-testid="CardFooter">{children}</div>,
}));
vi.mock('../../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="Button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));
vi.mock('../../../../components/ui/separator', () => ({
  Separator: (props) => <hr data-testid="Separator" {...props} />,  
}));

// Mock icons
vi.mock('lucide-react', () => ({
  CreditCard: (props) => <svg data-testid="CreditCard" {...props} />,
  Truck: (props) => <svg data-testid="Truck" {...props} />,
}));

describe('OrderSummary component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const cartItems = [
    { productId: { _id: 'p1', name: 'Item One', price: 10 }, quantity: 2 },
    { productId: { _id: 'p2', name: 'Item Two', price: 5 }, quantity: 1 },
  ];

  const baseProps = {
    cartItems,
    subtotal: 25,
    shipping: 0,
    tax: 2,
    total: 27,
    handleCheckout: vi.fn(),
  };

  it('renders all summary fields and checkout button', () => {
    render(<OrderSummary {...baseProps} />);

    // Card header and title
    expect(screen.getByTestId('CardHeader')).toBeInTheDocument();
    expect(screen.getByTestId('CardTitle')).toHaveTextContent('Order Summary');

    // Cart items list
    cartItems.forEach(item => {
      expect(screen.getByText(item.productId.name)).toBeInTheDocument();
      expect(screen.getByText(`$${item.productId.price.toFixed(2)} x ${item.quantity}`)).toBeInTheDocument();
    });

    // Separator should appear at least twice
    expect(screen.getAllByTestId('Separator').length).toBeGreaterThanOrEqual(2);

    // Totals
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText(`$${baseProps.subtotal.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Tax (8%)')).toBeInTheDocument();
    expect(screen.getByText(`$${baseProps.tax.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText(`$${baseProps.total.toFixed(2)}`)).toBeInTheDocument();

    // No promo message when shipping is zero
    expect(screen.queryByTestId('Truck')).toBeNull();

    // Checkout button
    const checkoutBtn = screen.getByTestId('Button');
    expect(within(checkoutBtn).getByTestId('CreditCard')).toBeInTheDocument();
    expect(within(checkoutBtn).getByText('Proceed to Checkout')).toBeInTheDocument();

    // Accepted payments text
    expect(screen.getByText('We accept:')).toBeInTheDocument();
    ['Visa', 'MC', 'Amex', 'PayP'].forEach(method => {
      expect(screen.getByText(method)).toBeInTheDocument();
    });
  });

  it('shows free shipping promo message when shipping > 0 and handles checkout click', () => {
    const props = { ...baseProps, shipping: 5, handleCheckout: vi.fn() };
    render(<OrderSummary {...props} />);

    // Promo message appears
    expect(screen.getByTestId('Truck')).toBeInTheDocument();
    expect(screen.getByText(/Add \$10.00 more for free shipping/)).toBeInTheDocument();

    // Trigger checkout
    const button = screen.getByTestId('Button');
    fireEvent.click(button);
    expect(props.handleCheckout).toHaveBeenCalled();
  });
});
