import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketPlace from '../../../pages/marketplace/Marketplace';

// Mock ProductGrid
vi.mock(
  '../../../pages/marketplace/components/market/ProductGrid',
  () => ({ __esModule: true, default: ({ shops }) => <div data-testid="ProductGrid">{shops.length}</div> })
);
// Mock Filter components and getInitialFilters
vi.mock(
  '../../../pages/marketplace/components/market/Filter',
  () => {
    const React = require('react');
    return {
      __esModule: true,
      default: () => <div data-testid="Filters" />,
      AppliedFilters: ({ filters }) => <div data-testid="AppliedFilters">{filters.category.length}</div>,
      getInitialFilters: () => ({ category: [] }),
    };
  }
);

describe('MarketPlace', () => {
  beforeEach(() => {
    // Reset mocks and storage
    vi.clearAllMocks();
    localStorage.clear();
    // Default navigator mocks
    global.navigator.permissions = {
      query: vi.fn().mockResolvedValue({ state: 'prompt', addEventListener: vi.fn() }),
    };
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn(),
    };
    // Stub fetch to avoid errors
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: [], totalPages: 1, currentPage: 1 }) });
  });

  it('shows location permission prompt initially', () => {
    render(<MarketPlace />);
    expect(screen.getByText('Find local shops')).toBeInTheDocument();
    expect(screen.getByText('How we use location:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find Nearby shops/i })).toBeInTheDocument();
  });

  it('shows loading state after clicking Find Nearby shops when geolocation never responds', () => {
    render(<MarketPlace />);
    fireEvent.click(screen.getByRole('button', { name: /Find Nearby shops/i }));
    expect(screen.getByText('Loading shops...')).toBeInTheDocument();
  });

  it('falls back to showing all farms when location permission is denied', async () => {
    // geolocation.getCurrentPosition calls error callback
    global.navigator.geolocation.getCurrentPosition = (success, error) => error({ code: 1 });
    render(<MarketPlace />);
    fireEvent.click(screen.getByRole('button', { name: /Find Nearby shops/i }));
    // After error, manualLocation becomes truthy and ProductGrid is rendered
    await waitFor(() => screen.getByTestId('ProductGrid'));
    expect(screen.getByTestId('AppliedFilters')).toBeInTheDocument();
    expect(screen.getByTestId('ProductGrid')).toHaveTextContent('0');
  });

  it('renders ProductGrid after successful location fetch', async () => {
    global.navigator.geolocation.getCurrentPosition = (success) => success({ coords: { latitude: 10, longitude: 20 } });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [{ id: 1 }], totalPages: 3, currentPage: 2 }),
    });
    render(<MarketPlace />);
    fireEvent.click(screen.getByRole('button', { name: /Find Nearby shops/i }));
    await waitFor(() => screen.getByTestId('ProductGrid'));
    expect(screen.getByTestId('ProductGrid')).toHaveTextContent('1');
  });

  it('updates searchQuery state when typing in search input', () => {
    render(<MarketPlace />);
    const input = screen.getByPlaceholderText('Search shops...');
    fireEvent.change(input, { target: { value: 'organic' } });
    expect(input.value).toBe('organic');
  });
});
