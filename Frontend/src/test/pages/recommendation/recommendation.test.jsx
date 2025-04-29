import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Recommendation from '../../../pages/recommendation/Recommendation';
import { useCart } from '../../../pages/cart/context/CartContex';

// Mock useCart hook
const addToCartMock = vi.fn();
vi.mock('../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ addToCart: addToCartMock }),
}));

// Mock child components and libraries
vi.mock('../../../components/Orb', () => ({ default: () => <div data-testid="orb" /> }));
vi.mock('react-simple-typewriter', () => ({
  Typewriter: () => <span data-testid="typewriter" />,
}));
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
}));

describe('Recommendation component', () => {
  beforeEach(() => {
    addToCartMock.mockClear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders form inputs and submit button', () => {
    render(<Recommendation />);
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Find Recommendations/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('orb')).toBeInTheDocument();
    expect(screen.getByTestId('typewriter')).toBeInTheDocument();
  });

  it('displays loading state when submitting form', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) });
    render(<Recommendation />);
    const button = screen.getByRole('button', { name: /Find Recommendations/i });

    fireEvent.change(screen.getByLabelText(/Prompt/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '10' } });
    fireEvent.click(button);

    expect(button).toHaveTextContent(/Searching/i);
    await waitFor(() => expect(button).toHaveTextContent(/Find Recommendations/i));
  });

  it('shows error message on recommendation fetch failure', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Rec error' }) });
    render(<Recommendation />);

    fireEvent.change(screen.getByLabelText(/Prompt/i), { target: { value: 'fail' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Find Recommendations/i }));

    expect(await screen.findByText(/⚠️ Rec error/)).toBeInTheDocument();
  });

  it('displays recommendations and products on successful fetch', async () => {
    const recResponse = {
      ok: true,
      json: async () => ({
        budget_used: '8.50',
        recommendations: 'We recommend X, Y',
        sources: [{ id: '1' }, { id: '2' }, { id: '1' }],
      }),
    };
    const prod1 = { _id: '1', name: 'Prod1', price: 5, originalPrice: 6, images: ['img1'], isOrganic: true, soldCount: 10 };
    const prod2 = { _id: '2', name: 'Prod2', price: 3, originalPrice: 0, image: 'img2', soldCount: 0 };
    const prodResponse = { ok: true, json: async () => prod1 };
    const prodResponse2 = { ok: true, json: async () => prod2 };

    global.fetch
      .mockResolvedValueOnce(recResponse)
      .mockResolvedValueOnce(prodResponse)
      .mockResolvedValueOnce(prodResponse2);

    render(<Recommendation />);
    fireEvent.change(screen.getByLabelText(/Prompt/i), { target: { value: 'ok' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /Find Recommendations/i }));

    expect(await screen.findByText(/Budget Used: 8.50/)).toBeInTheDocument();
    expect(screen.getByText(/We recommend X, Y/)).toBeInTheDocument();
    expect(await screen.findByText(/Prod1/)).toBeInTheDocument();
    expect(await screen.findByText(/Prod2/)).toBeInTheDocument();
  });

  it('calls addToCart when clicking cart button', async () => {
    const recResponse = { ok: true, json: async () => ({ budget_used: '1', recommendations: '', sources: [{ id: '1' }] }) };
    const prod1 = { _id: '1', name: 'P1', price: 1, originalPrice: 0, images: ['img'], isOrganic: false, soldCount: 0 };
    const prodResponse = { ok: true, json: async () => prod1 };

    global.fetch
      .mockResolvedValueOnce(recResponse)
      .mockResolvedValueOnce(prodResponse);

    render(<Recommendation />);
    fireEvent.change(screen.getByLabelText(/Prompt/i), { target: { value: 'a' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Find Recommendations/i }));

    const addButton = await screen.findByRole('button', { name: /Add to cart/i });
    fireEvent.click(addButton);
    expect(addToCartMock).toHaveBeenCalledWith('1');
  });
});
