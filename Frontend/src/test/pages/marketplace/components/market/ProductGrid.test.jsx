import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { vi } from 'vitest';
import ProductGrid from '../../../../../pages/marketplace/components/market/ProductGrid';

// Capture the mock so we can assert against it later
const addToCartMock = vi.fn();

// Mock dependencies
vi.mock('../../../../../components/ui/badge', () => ({
  Badge: ({ children }) => <div data-testid="Badge">{children}</div>
}));
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="Button" onClick={onClick} {...props}>{children}</button>
  )
}));
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <svg data-testid="ShoppingCart" />,  
  ArrowRight: () => <svg data-testid="ArrowRight" />
}));
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a data-testid="Link" href={to}>{children}</a>
}));
vi.mock('../../../../../components/ui/scroll-area', () => ({
  ScrollArea: ({ children }) => <div data-testid="ScrollArea">{children}</div>
}));
vi.mock('../../../../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }) => (
    <select data-testid="Select" value={value} onChange={e => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => <div data-testid="SelectTrigger">{children}</div>,
  SelectValue: ({ placeholder }) => <div data-testid="SelectValue">{placeholder}</div>,
  SelectContent: ({ children }) => <div data-testid="SelectContent">{children}</div>,
  SelectItem: ({ value, children }) => <option value={value}>{children}</option>
}));

// Replace useCart so it returns our captured mock
vi.mock('../../../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ addToCart: addToCartMock })
}));

const sampleShops = [
  {
    _id: 's1', name: 'Shop1',
    products: [
      {
        _id: 'p1', name: 'Prod1',
        price: 1.23, originalPrice: 2.00,
        images: ['i1'], isOrganic: true, soldCount: 5
      }
    ]
  },
  { _id: 's2', name: 'Shop2', products: [] }
];

describe('ProductGrid', () => {
  afterEach(() => cleanup());

  it('renders shop count and sort header', () => {
    render(
      <ProductGrid
        shops={sampleShops}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText('Showing 2 shops')).toBeInTheDocument();
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('renders products in scroll area when available', () => {
    render(
      <ProductGrid
        shops={[sampleShops[0]]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    const scroll = screen.getByTestId('ScrollArea');
    expect(within(scroll).getByText('Prod1')).toBeInTheDocument();
    expect(within(scroll).getByTestId('Badge')).toBeInTheDocument();
  });

  it('shows no products message when none available', () => {
    render(
      <ProductGrid
        shops={[sampleShops[1]]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText('No products available for this shop')).toBeInTheDocument();
  });

  it('shows no shops found when shops array is empty', () => {
    render(
      <ProductGrid
        shops={[]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    expect(screen.getByText('No shops found matching your criteria')).toBeInTheDocument();
  });

  it('calls addToCart when cart button clicked', () => {
    render(
      <ProductGrid
        shops={[sampleShops[0]]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );
    // Click the <Button> so the onClick handler is invoked
    fireEvent.click(screen.getByTestId('Button'));
    expect(addToCartMock).toHaveBeenCalledWith('p1');
  });

  it('renders pagination controls and handles page changes correctly', () => {
    const onPageChange = vi.fn();
    render(
      <ProductGrid
        shops={sampleShops}
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
      />
    );

    // Click specific page number
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);

    // Click Next (enabled since currentPage < totalPages)
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(2);

    // "Previous" is disabled at page 1, so clicking should NOT invoke callback
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledTimes(2);
  });
});
