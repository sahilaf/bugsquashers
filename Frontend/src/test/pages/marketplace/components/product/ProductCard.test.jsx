import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductCard } from '../../../../../pages/marketplace/components/product/ProductCard';

// Mock icons from lucide-react
vi.mock('lucide-react', () => ({
  Star: ({ className }) => <svg data-testid="Star" className={className} />, 
  ShoppingCart: () => <svg data-testid="ShoppingCart" />
}));

// Mock UI components
vi.mock('../../../../../components/ui/badge', () => ({
  Badge: ({ children, className }) => <div data-testid="Badge" className={className}>{children}</div>
}));
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => <button data-testid="Button" onClick={onClick}>{children}</button>
}));
vi.mock('../../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>,
  CardFooter: ({ children }) => <div data-testid="CardFooter">{children}</div>
}));

describe('ProductCard', () => {
  const baseProduct = {
    image: 'https://example.com/img.png',
    name: 'Test Product',
    price: '10.00',
    rating: 3
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders image, name, price, stars, and default Add to Cart button', () => {
    render(<ProductCard product={baseProduct} />);

    // Image
    const img = screen.getByRole('img', { name: baseProduct.name });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', baseProduct.image);

    // Name
    expect(screen.getByText(baseProduct.name)).toBeInTheDocument();

    // Price (no salePrice)
    expect(screen.getByText(`$${baseProduct.price}`)).toBeInTheDocument();

    // Stars: total 5
    const stars = screen.getAllByTestId('Star');
    expect(stars).toHaveLength(5);
    // Filled vs unfilled: use classList on SVGAnimatedString
    const filled = stars.filter(s => s.classList.contains('fill-primary'));
    expect(filled).toHaveLength(baseProduct.rating);

    // Button
    expect(screen.getByTestId('Button')).toBeInTheDocument();
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
  });

  it('renders salePrice and original price with strikethrough', () => {
    const product = { ...baseProduct, salePrice: '8.00' };
    render(<ProductCard product={product} />);

    // Sale price
    const sale = screen.getByText(`$${product.salePrice}`);
    expect(sale).toBeInTheDocument();
    expect(sale).toHaveClass('text-red-500');

    // Original price
    const original = screen.getByText(`$${product.price}`);
    expect(original).toBeInTheDocument();
    expect(original).toHaveClass('line-through');
  });

  it('renders badge when provided with correct styling', () => {
    const product = { ...baseProduct, badge: 'Sale' };
    render(<ProductCard product={product} />);

    const badge = screen.getByTestId('Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Sale');
    expect(badge.className).toContain('bg-red-500');
  });

  it('calls alert with correct message when Add to Cart is clicked', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ProductCard product={baseProduct} />);

    fireEvent.click(screen.getByTestId('Button'));
    expect(alertSpy).toHaveBeenCalledWith(`Added ${baseProduct.name} to cart`);
  });

  it('renders badge with primary background for non-Sale values', () => {
    const badgeValue = 'New';
    const product = { ...baseProduct, badge: badgeValue };
    render(<ProductCard product={product} />);

    const badge = screen.getByTestId('Badge');
    expect(badge).toHaveTextContent(badgeValue);
    expect(badge.className).toContain('bg-primary');
  });
});
