// src/test/pages/dashboard/components/Retailer/ShopDetails.test.jsx
import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- MOCK AuthContext ---
vi.mock('../../../../../pages/auth/AuthContext', () => ({
  useAuth: () => ({ userId: 'firebase-uid-123' }),
}));

// --- STUB ResizeObserver (Radix use-size) ---
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterAll(() => {
  delete global.ResizeObserver;
});
afterEach(() => {
  vi.restoreAllMocks();
});

// --- IMPORT COMPONENT UNDER TEST (5 levels up) ---
import ShopDetails from '../../../../../pages/dashboard/components/Retailer/ShopDetails';

describe('ShopDetails.jsx', () => {
  it('shows spinner on initial load', () => {
    // never-resolving fetch to keep loading
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    render(<ShopDetails />);
    expect(screen.getByText('Loading shop information...')).toBeInTheDocument();
  });

  it('shows error if first fetch fails', async () => {
    // getuserid fails
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'oops' }),
    });

    render(<ShopDetails />);
    await waitFor(() => {
      expect(
        screen.getByText(
          'Failed to load shop information. Please try again.'
        )
      ).toBeInTheDocument();
    });
  });

  it('enters create mode when no shop exists', async () => {
    // getuserid OK → then shopResponse success:false
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: 'mongodb-user-1' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, data: null }),
      });

    render(<ShopDetails />);
    await waitFor(() => {
      expect(screen.getByText('Create Your Shop')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Complete the form below to create your shop profile'
        )
      ).toBeInTheDocument();
    });
  });

  it('loads existing shop, allows edit, cancel, and save updates', async () => {
    const demoShop = {
      _id: 'shop-42',
      name: 'My Farm Shop',
      location: { coordinates: [-74.0059, 40.7128] },
      category: 'Fruits',
      isOrganicCertified: true,
      isLocalFarm: false,
    };

    // 1) getuserid, 2) get shop data, 3+) save
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: 'mongodb-user-1' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: demoShop }),
      })
      .mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: demoShop }),
      });

    render(<ShopDetails />);

    // wait until the display (disabled inputs) appear
    await waitFor(() => {
      expect(screen.getByText('Shop Information')).toBeInTheDocument();
    });

    // **UPDATED LINES**: inputs hold the values, not text nodes
    expect(screen.getByDisplayValue('My Farm Shop')).toBeInTheDocument();
    expect(screen.getByDisplayValue('40.7128')).toBeInTheDocument();

    // click Edit
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

    // change the shop name
    const nameInput = screen.getByPlaceholderText('Enter your shop name');
    fireEvent.change(nameInput, { target: { value: 'Updated Shop' } });
    expect(nameInput).toHaveValue('Updated Shop');

    // click Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      // after save, form resets, we can check new display value
      expect(screen.getByDisplayValue('Updated Shop')).toBeInTheDocument();
    });

    // ensure we called fetch three times
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
