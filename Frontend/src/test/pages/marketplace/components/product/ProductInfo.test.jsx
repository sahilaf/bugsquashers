import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductInfo } from '../../../../../pages/marketplace/components/product/ProductInfo';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Star: ({ className }) => <svg data-testid="Star" className={className} />,  
  ShoppingCart: () => <svg data-testid="ShoppingCart" />
}));

// Mock UI components
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button data-testid="Button" onClick={onClick}>{children}</button>
  )
}));
vi.mock('../../../../../components/ui/input', () => ({
  Input: ({ value, onChange }) => (
    <input data-testid="Input" value={value} onChange={onChange} />
  )
}));

// Mock ProductTabs
vi.mock('../../../../../pages/marketplace/components/product/ProductTabs', () => ({
  ProductTabs: () => <div data-testid="ProductTabs" />
}));

// Mock useCart context
const addToCartMock = vi.fn().mockResolvedValue();
const confirmPaymentMock = vi.fn().mockResolvedValue(true);
vi.mock('../../../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ addToCart: addToCartMock, confirmPayment: confirmPaymentMock })
}));

describe('ProductInfo', () => {
  const baseProduct = {
    _id: 'p1',
    name: 'Test Product',
    description: 'Fantastic product description',
    price: 20.5,
    originalPrice: 30.0,
    keyFeatures: ['Feature A', 'Feature B'],
    soldCount: 10,
    isOrganic: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(cleanup);

  it('renders all product info elements', () => {
    render(<ProductInfo product={baseProduct} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(baseProduct.name);

    const stars = screen.getAllByTestId('Star');
    expect(stars).toHaveLength(5);
    expect(stars.filter(s => s.classList.contains('fill-primary'))).toHaveLength(4);
    expect(stars.filter(s => s.classList.contains('fill-muted'))).toHaveLength(1);

    expect(screen.getByText(`(4.5 stars) • ${baseProduct.soldCount} sold`)).toBeInTheDocument();

    expect(screen.getByText(`$${baseProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`$${baseProduct.originalPrice.toFixed(2)}`)).toHaveClass('line-through');

    expect(screen.getByText(baseProduct.description)).toBeInTheDocument();
    baseProduct.keyFeatures.forEach(feat => {
      expect(screen.getByText(feat)).toBeInTheDocument();
    });

    expect(screen.getByText('Certified Organic Product')).toBeInTheDocument();
    expect(screen.getByTestId('ProductTabs')).toBeInTheDocument();
  });

  it('quantity input enforces numeric value and resets correctly', () => {
    render(<ProductInfo product={baseProduct} />);
    const input = screen.getByTestId('Input');

    // initial quantity should be string '1'
    expect(input).toHaveValue('1');

    // change to '5'
    fireEvent.change(input, { target: { value: '5' } });
    expect(input).toHaveValue('5');

    // change to '0' => resets to '1'
    fireEvent.change(input, { target: { value: '0' } });
    expect(input).toHaveValue('1');

    // invalid => resets to '1'
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('1');
  });

  it('calls addToCart correct number of times on Add to cart', async () => {
    render(<ProductInfo product={baseProduct} />);
    fireEvent.click(screen.getByRole('button', { name: /Add to cart/i }));
    await waitFor(() => expect(addToCartMock).toHaveBeenCalledTimes(1));
    expect(addToCartMock).toHaveBeenCalledWith(baseProduct._id);
  });

  it('buy now flow adds to cart, confirms payment, and redirects', async () => {
    render(<ProductInfo product={baseProduct} />);
    fireEvent.click(screen.getByRole('button', { name: /Buy now/i }));
    await waitFor(() => {
      expect(addToCartMock).toHaveBeenCalledTimes(1);
      expect(confirmPaymentMock).toHaveBeenCalled();
      expect(window.location.href).toBe('/order-confirmation');
    });
  });

  it('handles addToCart errors gracefully', async () => {
    addToCartMock.mockRejectedValueOnce(new Error('Add fail'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ProductInfo product={baseProduct} />);
    fireEvent.click(screen.getByRole('button', { name: /Add to cart/i }));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to add to cart:', expect.any(Error));
    });
  });

  it('handles buy now errors gracefully', async () => {
    addToCartMock.mockRejectedValueOnce(new Error('Add fail'));
    confirmPaymentMock.mockRejectedValueOnce(new Error('Pay fail'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ProductInfo product={baseProduct} />);
    fireEvent.click(screen.getByRole('button', { name: /Buy now/i }));
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Buy now failed:', expect.any(Error));
    });
  });
});
