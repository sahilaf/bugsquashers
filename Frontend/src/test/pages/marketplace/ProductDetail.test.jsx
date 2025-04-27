import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductDetail } from '../../../pages/marketplace/ProductDetail';

// Mock react-router-dom useParams
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));
import { useParams } from 'react-router-dom';

// Mock sub-components
vi.mock(
  '../../../pages/marketplace/components/product/ProductGallery',
  () => ({
    ProductGallery: ({ product }) => <div data-testid="ProductGallery">{product?.name}</div>,
  })
);
vi.mock(
  '../../../pages/marketplace/components/product/ProductInfo',
  () => ({
    ProductInfo: ({ product }) => <div data-testid="ProductInfo">{product?.category}</div>,
  })
);
vi.mock(
  '../../../pages/marketplace/components/product/ProductReviews',
  () => ({
    ProductReviews: ({ reviews }) => <div data-testid="ProductReviews">{reviews.length}</div>,
  })
);
vi.mock(
  '../../../pages/marketplace/components/product/SuggestedProducts',
  () => ({
    SuggestedProducts: ({ products }) => <div data-testid="SuggestedProducts">{products.length}</div>,
  })
);

describe('ProductDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ productId: '123' });
  });

  it('shows loading state initially', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<ProductDetail />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    render(<ProductDetail />);
    await waitFor(() => screen.getByText(/Error: Product not found/i));
    expect(screen.getByText('Error: Product not found')).toBeInTheDocument();
  });

  it('shows "Product not found" when API returns null', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => null });
    render(<ProductDetail />);
    await waitFor(() => screen.getByText('Product not found'));
    expect(screen.getByText('Product not found')).toBeInTheDocument();
  });

  it('renders all sub-components and breadcrumb on successful fetch', async () => {
    const mockProduct = { name: 'Test Apple', category: 'Fruit' };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockProduct });

    const { container } = render(<ProductDetail />);
    await waitFor(() => screen.getByTestId('ProductGallery'));

    // Breadcrumb: Shop all > Fruit > Test Apple
    expect(screen.getByText('Shop all')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fruit' })).toBeInTheDocument();
    expect(
      screen.getByText('Test Apple', { selector: '.flex.items-center.gap-1.text-sm.mb-4 span' })
    ).toBeInTheDocument();

    // Sub-components
    expect(screen.getByTestId('ProductGallery')).toHaveTextContent('Test Apple');
    expect(screen.getByTestId('ProductInfo')).toHaveTextContent('Fruit');
    expect(screen.getByTestId('ProductReviews')).toHaveTextContent('2');
    expect(screen.getByTestId('SuggestedProducts')).toHaveTextContent('4');
  });
});
