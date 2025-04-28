// File: src/test/pages/cart/context/CartContex.test.jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../../../pages/cart/context/CartContex";
import { useAuth } from "../../../../pages/auth/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

// 1) Mock useAuth so we can simulate logged‐in / logged‐out
vi.mock("../../../../pages/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// 2) Mock axios and toast
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// Helper wrapper for our hook
const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if used outside provider", () => {
    // We don't care about the exact message here, just that it errors
    expect(() => useCart()).toThrow();
  });

  it("initial fetchCart with no uid clears cartItems", async () => {
    useAuth.mockReturnValue({ userId: null });
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.fetchCart();
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetchCart success sets items", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockResolvedValue({ data: { items: [{ id: 1, quantity: 2 }] } });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.fetchCart();
    });

    expect(result.current.cartItems).toEqual([{ id: 1, quantity: 2 }]);
    expect(result.current.error).toBeNull();
  });

  it("fetchCart 404 error toasts and sets error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockRejectedValue({ response: { status: 404 } });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.fetchCart();
    });

    expect(toast.error).toHaveBeenCalledWith("Cart not found");
    expect(result.current.error).toBe("Cart not found");
  });

  it("addToCart with no uid error", async () => {
    useAuth.mockReturnValue({ userId: null });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart("prod1");
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to add items to cart");
  });

  it("addToCart with invalid id error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    // Neutralize fetchCart in useEffect
    axios.get.mockResolvedValue({ data: { items: [] } });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(null);
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid product");
  });

  it("addToCart success toasts and calls fetchCart", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockResolvedValue({ data: { items: [] } });
    axios.post.mockResolvedValue({ data: { items: [{ id: "prod1", quantity: 1 }] } });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart("prod1");
    });

    expect(toast.success).toHaveBeenCalledWith("Item added to cart");
  });

  it("removeFromCart with no uid error", async () => {
    useAuth.mockReturnValue({ userId: null });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.removeFromCart("prod1");
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to remove items");
  });

  it("clearCart with no uid error", async () => {
    useAuth.mockReturnValue({ userId: null });

    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.clearCart();
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to clear cart");
  });
});
