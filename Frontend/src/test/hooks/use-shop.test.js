import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useShopDetails from '../../hooks/use-shop';

// Mock global fetch before each test
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useShopDetails hook', () => {
  it('sets error when no userId is provided', async () => {
    const { result } = renderHook(() => useShopDetails(null));
    await waitFor(() => {
      expect(result.current.error).toBe('User ID is required');
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.shop).toBeNull();
  });

  it('fetches and formats shop details successfully', async () => {
    // 1st fetch: get ownerId
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: 'owner123' }),
      })
      // 2nd fetch: get shop data
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'shop1',
            name: 'Test Shop',
            location: { coordinates: [100.123456, 50.654321] },
            category: 'Grocery',
            rating: 4.256,
            isOrganicCertified: true,
          },
        }),
      });

    const { result } = renderHook(() => useShopDetails('user1'));
    await waitFor(() => !result.current.loading);

    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.shop).toEqual({
      _id: 'shop1',
      name: 'Test Shop',
      location: '50.6543, 100.1235',
      category: 'Grocery',
      rating: '4.3',
      isCertified: true,
    });
  });

  it('handles user fetch error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'User fetch error' }),
    });

    const { result } = renderHook(() => useShopDetails('user1'));
    await waitFor(() => !result.current.loading);

    expect(result.current.error).toBe('User fetch error');
    expect(result.current.shop).toBeNull();
  });

  it('handles missing ownerId from user response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, userId: null }),
    });

    const { result } = renderHook(() => useShopDetails('user1'));
    await waitFor(() => !result.current.loading);

    expect(result.current.error).toBe('Could not retrieve user ID');
    expect(result.current.shop).toBeNull();
  });

  it('handles shop fetch error response', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: 'owner123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Shop fetch error' }),
      });

    const { result } = renderHook(() => useShopDetails('user1'));
    await waitFor(() => !result.current.loading);

    expect(result.current.error).toBe('Shop fetch error');
    expect(result.current.shop).toBeNull();
  });

  it('defaults category to "Unknown" and rating to "0.0" when missing', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, userId: 'owner123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'shop2',
            name: 'Edge Shop',
            location: { coordinates: [10, 20] },
            // category missing
            rating: null,
            // isOrganicCertified missing => false
          },
        }),
      });

    const { result } = renderHook(() => useShopDetails('user1'));
    await waitFor(() => !result.current.loading);

    expect(result.current.shop).toEqual({
      _id: 'shop2',
      name: 'Edge Shop',
      location: '20.0000, 10.0000',
      category: 'Unknown',
      rating: '0.0',
      isCertified: false,
    });
  });

});
