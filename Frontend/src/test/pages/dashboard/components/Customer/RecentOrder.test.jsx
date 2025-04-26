import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import RecentOrders from '../../../../../pages/dashboard/components/Customer/RecentOrder';
import axios from 'axios';
import { useAuth } from '../../../../../pages/auth/AuthContext';

// Mock axios and AuthContext
vi.mock('axios');
vi.mock('../../../../../pages/auth/AuthContext');

describe('RecentOrders Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ userId: '123' });
  });

  it('displays loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<RecentOrders />);
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Loading orders...')).not.toBeInTheDocument();
    });
  });

  it('shows default error message when no specific error', async () => {
    const error = new Error();
    axios.get.mockRejectedValueOnce(error);
    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load orders')).toBeInTheDocument();
    });
  });

  it('displays no orders found when empty', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText('No orders found')).toBeInTheDocument();
    });
  });

  it('filters orders by customerId', async () => {
    const mockOrders = [
      { 
        _id: '1', 
        customerId: '123', 
        orderId: 'ORD1', 
        date: '2023-10-01', 
        shopName: 'Shop A', 
        items: [], 
        total: 50, 
        payment: 'Credit Card', 
        status: 'Delivered' 
      },
      { 
        _id: '2', 
        customerId: '456', 
        orderId: 'ORD2', 
        date: '2023-10-02', 
        shopName: 'Shop B', 
        items: [], 
        total: 75, 
        payment: 'PayPal', 
        status: 'Processing' 
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText('ORD1')).toBeInTheDocument();
      expect(screen.queryByText('ORD2')).not.toBeInTheDocument();
    });
  });

  it('displays 3 orders when fullList is false', async () => {
    const mockOrders = Array.from({ length: 5 }, (_, i) => ({
      _id: String(i),
      customerId: '123',
      orderId: `ORD${i}`,
      date: '2023-10-01',
      shopName: `Shop ${i}`,
      items: [],
      total: 50,
      payment: 'Credit Card',
      status: 'Delivered',
    }));
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<RecentOrders fullList={false} />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 3 data rows
      expect(rows).toHaveLength(4);
    });
  });

  it('displays all orders when fullList is true', async () => {
    const mockOrders = Array.from({ length: 5 }, (_, i) => ({
      _id: String(i),
      customerId: '123',
      orderId: `ORD${i}`,
      date: '2023-10-01',
      shopName: `Shop ${i}`,
      items: [],
      total: 50,
      payment: 'Credit Card',
      status: 'Delivered',
    }));
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<RecentOrders fullList={true} />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 5 data rows
      expect(rows).toHaveLength(6);
    });
  });

  it('correctly formats order total', async () => {
    const mockOrder = {
      _id: '1',
      customerId: '123',
      orderId: 'ORD1',
      date: '2023-10-01',
      shopName: 'Shop A',
      items: [],
      total: 100.50,
      payment: 'Credit Card',
      status: 'Delivered',
    };
    axios.get.mockResolvedValueOnce({ data: [mockOrder] });
    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText('$100.50')).toBeInTheDocument();
    });
  });

  it('shows "No items" when order has no items', async () => {
    const mockOrder = {
      _id: '1',
      customerId: '123',
      orderId: 'ORD1',
      date: '2023-10-01',
      shopName: 'Shop A',
      items: [],
      total: 50,
      payment: 'Credit Card',
      status: 'Delivered',
    };
    axios.get.mockResolvedValueOnce({ data: [mockOrder] });
    render(<RecentOrders />);
    await waitFor(() => {
      expect(screen.getByText('No items')).toBeInTheDocument();
    });
  });

  it('applies correct status styles', async () => {
    const statuses = ['Delivered', 'Processing', 'Shipped', 'Cancelled'];
    const mockOrders = statuses.map((status, i) => ({
      _id: String(i),
      customerId: '123',
      orderId: `ORD${i}`,
      date: '2023-10-01',
      shopName: `Shop ${i}`,
      items: [],
      total: 50,
      payment: 'Credit Card',
      status,
    }));
    axios.get.mockResolvedValueOnce({ data: mockOrders });
    render(<RecentOrders fullList={true} />);
    await waitFor(() => {
      statuses.forEach((status) => {
        const badge = screen.getByText(status);
        expect(badge).toHaveClass(
          status === 'Delivered' ? 'bg-green-100' :
          status === 'Processing' ? 'bg-yellow-100' :
          status === 'Shipped' ? 'bg-blue-100' :
          'bg-red-100'
        );
      });
    });
  });
});