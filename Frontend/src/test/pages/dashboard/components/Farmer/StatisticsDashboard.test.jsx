import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatisticsDashboard from '../../../../../pages/dashboard/components/Farmer/StatisticsDashboard';
import { vi } from 'vitest';

// Mock global fetch and Date.now
beforeEach(() => {
  global.fetch = vi.fn();
  vi.spyOn(Date, 'now').mockReturnValue(new Date(2025, 3, 15).getTime());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('StatisticsDashboard', () => {
  it('renders loading state initially', () => {
    global.fetch.mockReturnValue(new Promise(() => {}));

    render(<StatisticsDashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders statistics correctly after successful fetch', async () => {
    const mockOrders = [
      { date: '2025-02-10', price: '100', crop: 'Wheat' },
      { date: '2025-03-05', price: '200', crop: 'Wheat' },
      { date: '2025-04-01', price: '50', crop: 'Rice' },
    ];
    global.fetch.mockResolvedValue({ json: async () => mockOrders });

    render(<StatisticsDashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check headers
    ['Monthly Sales', 'Revenue for the last 3 months', 'Crop Distribution', 'Sales distribution by crop type', 'Customer Demographics'].forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    // Monthly Sales content
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('Apr')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();

        // Style-based bar height for Mar
    const monthWrapper = screen.getByText('Mar').parentElement;
    const barDiv = monthWrapper.querySelector('div[style]');
    expect(barDiv).not.toBeNull();
    expect(barDiv).toHaveStyle('height: 20%');

    // Crop Distribution percentages
    expect(screen.getByText('Wheat')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('Rice')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();

    // Customer Demographics content
    expect(screen.getByText('Customer data visualization coming soon')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('Network Error'));

    render(<StatisticsDashboard />);

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Main sections still render
    ['Monthly Sales', 'Crop Distribution', 'Customer Demographics'].forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    // No data displayed
    expect(screen.queryByText('Feb')).toBeNull();
    expect(screen.queryByText('$')).toBeNull();
    expect(screen.queryByText('%')).toBeNull();
  });
});
