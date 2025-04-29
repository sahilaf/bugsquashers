import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import OrdersDashboard from '../../../../../pages/dashboard/components/Farmer/OrdersDashboard';

// Mock alert
beforeEach(() => {
  global.fetch = vi.fn();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('OrdersDashboard Component', () => {
  it('shows loading state initially', async () => {
    // Mock fetch to pending state
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });

    render(<OrdersDashboard />);
    // Spinner and loading text should appear
    expect(screen.getByText('Loading orders...')).toBeInTheDocument();

    // Wait for fetch to resolve
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it('renders empty state when no orders returned', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });

    render(<OrdersDashboard />);
    // Wait for fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText('No orders found.')).toBeInTheDocument();
    expect(screen.queryByText('Loading orders...')).not.toBeInTheDocument();
  });

  it('renders orders table when data is returned', async () => {
    const mockOrders = [
      { id: '1', crop: 'Wheat', quantity: 10, price: 100, date: '2025-04-01', address: 'Farm A', status: 'Delivered', paymentStatus: 'Paid' },
      { id: '2', crop: 'Rice', quantity: 5, price: 50, date: '2025-04-02', address: 'Farm B', status: 'Processing', paymentStatus: 'Pending' }
    ];
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockOrders });

    render(<OrdersDashboard />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check that rows are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Wheat')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('2025-04-01')).toBeInTheDocument();
    expect(screen.getByText('Farm A')).toBeInTheDocument();
    // Badge texts
    expect(screen.getByText('Delivered')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Rice')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('2025-04-02')).toBeInTheDocument();
    expect(screen.getByText('Farm B')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();

    // Footer count
    expect(screen.getByText('Showing 2 of 2 orders')).toBeInTheDocument();
  });

  it('handles API error and displays error message', async () => {
    global.fetch.mockRejectedValue(new Error('Network Error'));

    render(<OrdersDashboard />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText('Failed to fetch orders. Please try again.')).toBeInTheDocument();
    // Loading spinner should be gone
    expect(screen.queryByText('Loading orders...')).not.toBeInTheDocument();
  });

  it('refresh button calls fetchOrders and is disabled while loading', async () => {
    // First call returns empty
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });

    render(<OrdersDashboard />);
    const refreshButton = screen.getByRole('button', { name: '' });
    // Disabled initially
    expect(refreshButton).toBeDisabled();

    // Wait for initial load
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(refreshButton).not.toBeDisabled();

    // Click to refresh
    fireEvent.click(refreshButton);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('cancel order button triggers alert with correct id', async () => {
    const mockOrders = [ { id: '42', crop: 'Corn', quantity: 2, price: 20, date: '2025-04-03', address: 'Farm C', status: 'Pending', paymentStatus: 'Paid' } ];
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockOrders });

    render(<OrdersDashboard />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const cancelButton = screen.getByRole('button', { name: /Cancel Order/i });
    fireEvent.click(cancelButton);
    expect(window.alert).toHaveBeenCalledWith('Viewing order 42');
  });

  it('renders default badge variant for unknown status', async () => {
    const mockOrders = [ { id: '99', crop: 'Barley', quantity: 3, price: 30, date: '2025-04-04', address: 'Farm D', status: 'Unknown', paymentStatus: null } ];
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockOrders });

    render(<OrdersDashboard />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
