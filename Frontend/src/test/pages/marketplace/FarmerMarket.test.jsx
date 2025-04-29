// src/test/pages/marketplace/FarmerMarket.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FarmerMarket from '../../../pages/marketplace/FarmerMarket';
import axios from 'axios';

// Mock the cart context
const mockAddToCart = vi.fn();
vi.mock('../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

vi.mock('axios');

describe('<FarmerMarket />', () => {
  const mockCrops = [
    { _id: '1', supplier: 'Green Farm', name: 'Tomatoes', price: 5 },
    { _id: '2', supplier: 'Green Farm', name: 'Cucumbers', price: 3 },
    { _id: '3', supplier: 'Red Farm',   name: 'Strawberries', price: 8 },
  ];
  const mockCart = { items: [{ id: '1', qty: 2 }] };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    // axios.get never resolves → stays loading
    render(<FarmerMarket />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<FarmerMarket />);
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch crops/i)).toBeInTheDocument();
    });
  });

  it('renders farmers and products on successful fetch', async () => {
    // First call: crops; Second call: cart
    axios.get
      .mockResolvedValueOnce({ data: mockCrops })
      .mockResolvedValueOnce({ data: mockCart });

    render(<FarmerMarket />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull();
    });

    // Should group by supplier: two farmer cards
    expect(screen.getByText('Green Farm')).toBeInTheDocument();
    expect(screen.getByText('Red Farm')).toBeInTheDocument();

    // Under Green Farm: Tomatoes & Cucumbers
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Cucumbers')).toBeInTheDocument();

    // Under Red Farm: Strawberries
    expect(screen.getByText('Strawberries')).toBeInTheDocument();

    // Price tags rendered correctly
    expect(screen.getByText(/\$5/)).toBeInTheDocument();
    expect(screen.getByText(/\$3/)).toBeInTheDocument();
    expect(screen.getByText(/\$8/)).toBeInTheDocument();

    // Buttons exist
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(buttons).toHaveLength(3);
  });

  it('calls addToCart with product id when clicking the first "Add to Cart"', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockCrops })
      .mockResolvedValueOnce({ data: mockCart });

    render(<FarmerMarket />);
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).toBeNull();
    });

    // Grab all Add-to-Cart buttons and click the first one (Tomatoes)
    const buttons = screen.getAllByRole('button', { name: /add to cart/i });
    fireEvent.click(buttons[0]);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });
});
