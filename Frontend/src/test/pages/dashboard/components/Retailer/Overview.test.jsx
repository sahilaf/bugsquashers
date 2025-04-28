import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// ─── Inline mocks (no top-level helpers) ────────────────────────────────────────
vi.mock('../../../../../hooks/use-shop', () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock('../../../../../pages/auth/AuthContext', () => ({
  __esModule: true,
  useAuth: vi.fn(),
}));

vi.mock(
  '../../../../../pages/dashboard/components/Retailer/expected-earnings',
  () => {
    const React = require('react');
    return { ExpectedEarnings: () => <div data-testid="ExpectedEarnings" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/average-monthly-sales',
  () => {
    const React = require('react');
    return { AvgMonthlySales: () => <div data-testid="AvgMonthlySales" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/DailySalesChart',
  () => {
    const React = require('react');
    return { DailySalesChart: () => <div data-testid="DailySalesChart" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/new-customers',
  () => {
    const React = require('react');
    return { NewCustomersChart: () => <div data-testid="NewCustomersChart" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/todays-heroes',
  () => {
    const React = require('react');
    return { TodaysHeroes: () => <div data-testid="TodaysHeroes" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/recent-orders',
  () => {
    const React = require('react');
    return { RecentOrders: () => <div data-testid="RecentOrders" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/discounted-sales',
  () => {
    const React = require('react');
    return { DiscountedSalesChart: () => <div data-testid="DiscountedSalesChart" /> };
  }
);
vi.mock(
  '../../../../../pages/dashboard/components/Retailer/ProductInventory',
  () => {
    const React = require('react');
    return { default: () => <div data-testid="ProductInventory" /> };
  }
);

vi.mock('lucide-react', () => {
  const React = require('react');
  const make = (id) => (props) => <svg data-testid={id} {...props} />;
  return {
    TrendingUp: make('TrendingUp'),
    ShoppingCart: make('ShoppingCart'),
    Star: make('Star'),
    BarChart3: make('BarChart3'),
    MapPin: make('MapPin'),
    Tag: make('Tag'),
    CheckCircle2: make('CheckCircle2'),
    XCircle: make('XCircle'),
    Store: make('Store'),
  };
});

vi.mock('../../../../../components/ui/card', () => {
  const React = require('react');
  return {
    Card: ({ children, ...p }) => <div data-testid="Card" {...p}>{children}</div>,
    CardContent: ({ children, ...p }) => (
      <div data-testid="CardContent" {...p}>{children}</div>
    ),
  };
});

// ─── Component under test ───────────────────────────────────────────────────────
import Overview from '../../../../../pages/dashboard/components/Retailer/Overview';
import useShopDetails from '../../../../../hooks/use-shop';
import { useAuth } from '../../../../../pages/auth/AuthContext';

describe('Overview.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    useAuth.mockReturnValue({ userId: 'u1' });
    useShopDetails.mockReturnValue({ shop: null, loading: true, error: null });

    render(<Overview />);
    expect(screen.getByText('Loading shop details...')).toBeInTheDocument();
  });


  it('renders "No Shop Found" when shop is null', () => {
    useAuth.mockReturnValue({ userId: 'u1' });
    useShopDetails.mockReturnValue({ shop: null, loading: false, error: null });

    render(<Overview />);
    expect(screen.getByText('No Shop Found')).toBeInTheDocument();
    expect(screen.getByTestId('Store')).toBeInTheDocument();
    expect(screen.getByText(/You don't have a shop yet/)).toBeInTheDocument();
  });

  it('renders full dashboard when shop exists', () => {
    useAuth.mockReturnValue({ userId: 'u1' });
    const shop = {
      name: 'Test Shop',
      location: 'Cityville',
      category: 'Produce',
      rating: 4.8,
      isCertified: false,
    };
    useShopDetails.mockReturnValue({ shop, loading: false, error: null });

    render(<Overview />);

    // Header info
    expect(screen.getByText('Test Shop')).toBeInTheDocument();
    expect(screen.getByTestId('MapPin')).toBeInTheDocument();
    expect(screen.getByText('Cityville')).toBeInTheDocument();

    // Category & rating
    expect(screen.getByText('Produce')).toBeInTheDocument();
    expect(screen.getByTestId('Tag')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();

    // There should be exactly two Star icons: one for rating, one in StatCard
    expect(screen.getAllByTestId('Star')).toHaveLength(2);

    // Certification badge (false path)
    expect(screen.getByText('Not Certified')).toBeInTheDocument();
    expect(screen.getByTestId('XCircle')).toBeInTheDocument();

    // Four StatCards titles
    ['Total Revenue', 'Total Orders', 'Average Rating', 'Top Selling Crop'].forEach(
      (t) => expect(screen.getByText(t)).toBeInTheDocument()
    );

    // All nested stubs
    [
      'ExpectedEarnings',
      'AvgMonthlySales',
      'DailySalesChart',
      'DiscountedSalesChart',
      'NewCustomersChart',
      'TodaysHeroes',
      'RecentOrders',
      'ProductInventory',
    ].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });
});
