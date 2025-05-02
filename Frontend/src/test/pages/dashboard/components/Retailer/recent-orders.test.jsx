import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import { RecentOrders } from '../../../../../pages/dashboard/components/Retailer/recent-orders';
import { useAuth } from '../../../../../pages/auth/AuthContext';
import useShopDetails from '../../../../../hooks/use-shop';

// Mock external modules
vi.mock('axios');
vi.mock('../../../../../pages/auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../../../../hooks/use-shop', () => ({ __esModule: true, default: vi.fn() }));

describe('RecentOrders Component', () => {
  const mockUserId = 'user123';
  const mockShop = { _id: 'shop123' };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ userId: mockUserId });
  });

  it('should display loading message when shop details are loading', () => {
    useShopDetails.mockReturnValue({ shop: {}, loading: true, error: null });
    render(<RecentOrders />);
    expect(screen.getByText(/Loading orders.../i)).toBeInTheDocument();
  });

  it('should display error message when shop details failed to load', () => {
    useShopDetails.mockReturnValue({ shop: {}, loading: false, error: 'Error' });
    render(<RecentOrders />);
    expect(screen.getByText(/Failed to load shop details/i)).toBeInTheDocument();
  });

  it('should display "No orders found." when API returns empty array', async () => {
    useShopDetails.mockReturnValue({ shop: mockShop, loading: false, error: null });
    axios.get.mockResolvedValue({ data: [] });

    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText(/No orders found\./i)).toBeInTheDocument();
    });
  });

  it('should render orders returned by API', async () => {
    useShopDetails.mockReturnValue({ shop: mockShop, loading: false, error: null });
    const orders = [
      {
        _id: 'order1',
        shopName: 'Test Shop',
        status: 'Delivered',
        payment: 'Paid',
        total: 150,
        items: [
          { name: 'Apple', quantity: 3, price: 50 }
        ],
      },
    ];
    axios.get.mockResolvedValue({ data: orders });

    render(<RecentOrders />);
    await waitFor(() => {
      // Check item details
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText(/Test Shop/i)).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/Bdt 50/)).toBeInTheDocument();
      expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
      expect(screen.getByText(/Paid/i)).toBeInTheDocument();
      expect(screen.getByText(/Bdt 150/)).toBeInTheDocument();
    });
  });
});
