import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import FarmerDashCards from '../../../../../pages/dashboard/components/Farmer/FarmerDashCards';

// Reset mocks before each test
beforeEach(() => {
  vi.restoreAllMocks();
});

describe('FarmerDashCards Component', () => {
  it('should display loading state initially', () => {
    render(<FarmerDashCards />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render statistics after successful fetch', async () => {
    // Freeze Date.now for consistent calculations
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-04-15T00:00:00Z').valueOf());

    const nowISO = new Date(Date.now()).toISOString();
    const orders = [
      { date: nowISO, price: '100', crop: 'Wheat' },
      { date: nowISO, price: '200', crop: 'Barley' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(orders) })
    );

    render(<FarmerDashCards />);

    // Check total revenue
    const revenue = await screen.findByText('$300');
    expect(revenue).toBeInTheDocument();

    // Check trends: should find two occurrences of '+100.0%'
    // Check trends: should find two occurrences of '+100%'
    const trendElements = await screen.findAllByText(/\+100%/);
    expect(trendElements.length).toBeGreaterThanOrEqual(2);

    // Check total orders
    const totalOrders = await screen.findByText('2');
    expect(totalOrders).toBeInTheDocument();

    // Check top selling crop
    const topCrop = await screen.findByText('Wheat');
    expect(topCrop).toBeInTheDocument();

    // Static card titles
    ['Total Revenue', 'Total Orders', 'Top Selling Crop', 'New Customers'].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

    render(<FarmerDashCards />);

    const errorMessage = await screen.findByText('Failed to load data from the server.');
    expect(errorMessage).toBeInTheDocument();
  });
});
