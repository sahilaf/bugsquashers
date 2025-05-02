import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// Import the hooks and components to mock
import useShopDetails from '../../../../../hooks/use-shop';
import { useToast } from '../../../../../hooks/use-toast';
import { useAuth } from '../../../../../pages/auth/AuthContext';
import { AddProductDialog } from '../../../../../pages/dashboard/components/Retailer/AddProductDialog';
import ProductInventory from '../../../../../pages/dashboard/components/Retailer/ProductInventory';

// Mock the Plus icon
vi.mock('lucide-react', () => ({ Plus: () => <span data-testid="plus-icon" /> }));
// Mock hooks and dialog
vi.mock('../../../../../hooks/use-shop');
vi.mock('../../../../../hooks/use-toast');
vi.mock('../../../../../pages/auth/AuthContext');
vi.mock('../../../../../pages/dashboard/components/Retailer/AddProductDialog');

describe('<ProductInventory />', () => {
  const mockToast = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    // Default hook mocks
    useAuth.mockReturnValue({ userId: 'user1' });
    useToast.mockReturnValue({ toast: mockToast });
  });

  it('shows loading state when shop is loading', () => {
    useShopDetails.mockReturnValue({ shop: null, loading: true, error: null });
    render(<ProductInventory />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('shows error message when shopError is present', () => {
    useShopDetails.mockReturnValue({ shop: null, loading: false, error: 'Network error' });
    render(<ProductInventory />);
    expect(screen.getByText(/Error loading shop: Network error/i)).toBeInTheDocument();
  });

  it('shows "No shop found" when no shop data', () => {
    useShopDetails.mockReturnValue({ shop: null, loading: false, error: null });
    render(<ProductInventory />);
    expect(screen.getByText(/No shop found/i)).toBeInTheDocument();
  });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  it('renders "No products found" when API returns empty array', async () => {
    useShopDetails.mockReturnValue({ shop: { _id: 'shop1' }, loading: false, error: null });
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    render(<ProductInventory />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/api/products?shop=shop1`));
    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it('renders products table with correct values and status badges', async () => {
    useShopDetails.mockReturnValue({ shop: { _id: 'shop1' }, loading: false, error: null });
    const products = [
      { _id: 'p1', name: 'Product A', price: 100, quantity: 0 },
      { _id: 'p2', name: 'Product B', price: 50.5, quantity: 5 },
      { _id: 'p3', name: 'Product C', price: 20, quantity: 20 },
    ];
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => products });

    render(<ProductInventory />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Table headers
    ['Name', 'Price (Bdt)', 'Quantity', 'Status'].forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    // Each product row
    products.forEach(prod => {
      expect(screen.getByText(prod.name)).toBeInTheDocument();
      expect(screen.getByText(prod.price.toFixed(2))).toBeInTheDocument();
      expect(screen.getByText(String(prod.quantity))).toBeInTheDocument();
      const status = prod.quantity === 0
        ? 'Out of Stock'
        : prod.quantity <= 10
        ? 'Low Stock'
        : 'In Stock';
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it('opens AddProductDialog when "Add Product" button is clicked', async () => {
    useShopDetails.mockReturnValue({ shop: { _id: 'shop1' }, loading: false, error: null });
    // Mock dialog implementation
    AddProductDialog.mockImplementation(({ open }) => <div data-testid="add-dialog" data-open={open} />);
    // Mock fetch so that initial loading completes
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });

    render(<ProductInventory />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));
    expect(screen.getByTestId('add-dialog')).toHaveAttribute('data-open', 'true');
  });

  it('handles fetch failure and shows error toast', async () => {
    useShopDetails.mockReturnValue({ shop: { _id: 'shop1' }, loading: false, error: null });
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Fail' }) });

    render(<ProductInventory />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Fail',
      variant: 'destructive',
    });
  });

  it('handles invalid JSON response and shows error toast', async () => {
    useShopDetails.mockReturnValue({ shop: { _id: 'shop1' }, loading: false, error: null });
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ nope: true }) });

    render(<ProductInventory />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Invalid products data format',
      variant: 'destructive',
    });
  });
});
