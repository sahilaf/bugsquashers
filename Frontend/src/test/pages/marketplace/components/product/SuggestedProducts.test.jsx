// src/test/pages/marketplace/components/product/SuggestedProducts.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock ProductCard to simplify tests and avoid deep rendering
vi.mock('../../../../../../src/pages/marketplace/components/product/ProductCard', () => ({
  ProductCard: ({ product }) => <div data-testid="product-card">{product.name}</div>,
}));

import { SuggestedProducts } from '../../../../../../src/pages/marketplace/components/product/SuggestedProducts';

describe('SuggestedProducts Component', () => {
  const products = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ];

  beforeEach(() => {
    // Reset mocks and stub alert
    vi.clearAllMocks();
    vi.stubGlobal('alert', vi.fn());
    render(<SuggestedProducts products={products} />);
  });

  it('renders the section heading', () => {
    const heading = screen.getByRole('heading', { name: /you may also like/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders previous and next buttons and handles click events', async () => {
    const buttons = screen.getAllByRole('button');
    const [prevBtn, nextBtn] = buttons;

    await userEvent.click(prevBtn);
    expect(alert).toHaveBeenCalledWith('Previous products');

    await userEvent.click(nextBtn);
    expect(alert).toHaveBeenCalledWith('Next products');
  });

  it('renders correct number of ProductCard components', () => {
    const cards = screen.getAllByTestId('product-card');
    expect(cards).toHaveLength(products.length);
    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });
});
