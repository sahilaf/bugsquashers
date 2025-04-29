import React from 'react';
import { render, screen } from '@testing-library/react';
import { TodaysHeroes } from '../../../../../pages/dashboard/components/Retailer/todays-heroes';

describe('TodaysHeroes Component', () => {
  beforeEach(() => {
    render(<TodaysHeroes />);
  });

  it('renders the card title correctly', () => {
    expect(screen.getByText("Today's Heroes")).toBeInTheDocument();
  });

  it('renders all top products with avatar fallbacks and sales counts', () => {
    const products = [
      { name: 'Wireless Earbuds', sales: 42 },
      { name: 'Smart Watch', sales: 38 },
      { name: 'Phone Case', sales: 27 },
    ];

    products.forEach(({ name, sales }) => {
      // Check that there is an avatar fallback initial
      const initial = name.charAt(0);
      expect(screen.getByText(initial)).toBeInTheDocument();
      // Product name
      expect(screen.getByText(name)).toBeInTheDocument();
      // Sales count
      expect(screen.getByText(`${sales} sold`)).toBeInTheDocument();
    });
  });

  it('displays the card description', () => {
    expect(screen.getByText(/Top selling products today/i)).toBeInTheDocument();
  });
});
