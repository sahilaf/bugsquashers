import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import CartItem from '../../../../pages/cart/components/CartItem';
import { toast } from 'react-hot-toast';

// Mock external dependencies
vi.mock('react-hot-toast', () => ({ toast: { info: vi.fn() } }));
vi.mock('lucide-react', () => ({
  Trash2: (props) => <svg data-testid="Trash2" {...props} />,
  Plus: (props) => <svg data-testid="Plus" {...props} />,
  Minus: (props) => <svg data-testid="Minus" {...props} />,
  Tag: (props) => <svg data-testid="Tag" {...props} />,
  Leaf: (props) => <svg data-testid="Leaf" {...props} />,
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

const sampleProduct = {
  _id: '1',
  name: 'Test Product',
  images: ['img1'],
  isOrganic: true,
  category: 'Cat',
  sku: 'SKU',
  keyFeatures: ['f1', 'f2'],
  price: 10,
  originalPrice: 15,
  discountPercentage: 33,
};

describe('CartItem', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('returns null and warns if productId is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <CartItem
        item={{}}
        index={0}
        cartLength={1}
        updateQuantity={vi.fn()}
        removeFromCart={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('renders full item details and handles actions', () => {
    const updateQuantity = vi.fn();
    const removeFromCart = vi.fn();

    render(
      <CartItem
        item={{ productId: sampleProduct, quantity: 3 }}
        index={0}
        cartLength={2}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    );

    // Image, name, category, SKU
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img1');
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Cat')).toBeInTheDocument();
    expect(screen.getByText('SKU: SKU')).toBeInTheDocument();

    // Key features
    expect(screen.getByText('f1')).toBeInTheDocument();
    expect(screen.getByText('f2')).toBeInTheDocument();

    // Prices
    expect(screen.getByText('$30.00')).toBeInTheDocument(); // 10 * 3
    expect(screen.getByText('$10.00 each')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getByText('33% OFF')).toBeInTheDocument();

    // Organic badge
    expect(screen.getByText('Organic')).toBeInTheDocument();

    // Quantity controls
    fireEvent.click(screen.getByTestId('Minus'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 2);
    fireEvent.click(screen.getByTestId('Plus'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 4);

    // Remove button and toast
    fireEvent.click(screen.getByText('Remove'));
    expect(removeFromCart).toHaveBeenCalledWith('1');
    expect(toast.info).toHaveBeenCalledWith(
      'Item Removed',
      expect.objectContaining({ description: 'Test Product removed from cart' })
    );

    // Separator should appear since index < cartLength - 1
    expect(screen.getByTestId('Separator')).toBeInTheDocument();
  });

  it('does not render separator for last item', () => {
    render(
      <CartItem
        item={{ productId: sampleProduct, quantity: 1 }}
        index={1}
        cartLength={2}
        updateQuantity={vi.fn()}
        removeFromCart={vi.fn()}
      />
    );
    expect(screen.queryByTestId('Separator')).toBeNull();
  });
});
