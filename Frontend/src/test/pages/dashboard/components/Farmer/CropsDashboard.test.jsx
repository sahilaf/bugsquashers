import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CropsDashboard from '../../../../../pages/dashboard/components/Farmer/CropsDashboard';

// Mock fetch globally
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

describe('CropsDashboard', () => {
  const dummyCrops = [
    { id: '1', name: 'Apple', category: 'Fruits', price: 2, stock: 50, supplier: 'Supplier A', harvestDate: '2025-04-01', expirationDate: '2025-04-10', image: null },
    { id: '2', name: 'Banana', category: 'Fruits', price: 1, stock: 10, supplier: 'Supplier B', harvestDate: '2025-04-02', expirationDate: '2025-04-12', image: null },
    { id: '3', name: 'Carrot', category: 'Vegetables', price: 1.5, stock: 120, supplier: 'Supplier C', harvestDate: '2025-03-30', expirationDate: '2025-04-15', image: null },
  ];
  let setCrops;
  let onViewAll;

  beforeEach(() => {
    vi.clearAllMocks();
    setCrops = vi.fn();
    onViewAll = vi.fn();
  });

  it('renders crop rows correctly', async () => {
    render(<CropsDashboard crops={dummyCrops} setCrops={setCrops} onViewAll={onViewAll} />);
    // Wait for fetchCrops effect to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check that crop names are in the document
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Carrot')).toBeInTheDocument();
  });

  it('filters crops by search query', async () => {
    render(<CropsDashboard crops={dummyCrops} setCrops={setCrops} onViewAll={onViewAll} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const searchInput = screen.getByPlaceholderText('Search crops...');
    fireEvent.change(searchInput, { target: { value: 'Ban' } });

    // Only Banana should be visible
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Carrot')).not.toBeInTheDocument();
  });

  it('sorts crops by stock when header clicked', async () => {
    render(<CropsDashboard crops={dummyCrops} setCrops={setCrops} onViewAll={onViewAll} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const stockHeader = screen.getByText('Stock');
    // Initial order: Apple(50), Banana(10), Carrot(120)
    let rows = screen.getAllByRole('row');
    // First data row should be Apple
    expect(rows[1]).toHaveTextContent('Apple');

    // Click to sort ascending by stock
    fireEvent.click(stockHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Banana');

    // Click again to sort descending
    fireEvent.click(stockHeader);
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Carrot');
  });

  it('calls onViewAll when View All Crops button clicked', async () => {
    render(<CropsDashboard crops={dummyCrops} setCrops={setCrops} onViewAll={onViewAll} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const viewAllButton = screen.getByText('View All Crops');
    fireEvent.click(viewAllButton);
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('displays no crops message when list is empty', async () => {
    render(<CropsDashboard crops={[]} setCrops={setCrops} onViewAll={onViewAll} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText('No crops found')).toBeInTheDocument();
  });
});
