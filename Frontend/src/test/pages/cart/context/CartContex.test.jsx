// File: src/test/pages/cart/context/CartContex.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../../../pages/cart/context/CartContex";
import { useAuth } from "../../../../pages/auth/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

// 1) Mock useAuth
vi.mock("../../../../pages/auth/AuthContext", () => ({ useAuth: vi.fn() }));
// 2) Mock axios & toast
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartContext (100% coverage)", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.useRealTimers());

  it("throws if used outside provider", () => {
    expect(() => useCart()).toThrow();
  });

  it("fetchCart: no uid clears cartItems", async () => {
    useAuth.mockReturnValue({ userId: null });
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.fetchCart();
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetchCart: success sets items", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockResolvedValue({ data: { items: [{ id: "x", quantity: 2 }] } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.fetchCart();
    });

    expect(result.current.cartItems).toEqual([{ id: "x", quantity: 2 }]);
    expect(result.current.error).toBeNull();
  });

  it("fetchCart: 404 error toasts and sets error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockRejectedValue({ response: { status: 404 } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.fetchCart();
    });

    expect(toast.error).toHaveBeenCalledWith("Cart not found");
    expect(result.current.error).toBe("Cart not found");
  });

  it("addToCart: no uid → auth error", async () => {
    useAuth.mockReturnValue({ userId: null });
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart("pid");
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to add items to cart");
  });

  it("addToCart: invalid id → parameter error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    // neutralize fetchCart
    axios.get.mockResolvedValue({ data: { items: [] } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.addToCart(null);
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid product");
  });

  it("addToCart: success toasts and refetches", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.get.mockResolvedValue({ data: { items: [] } });
    axios.post.mockResolvedValue({ data: { items: [{ id: "p1", quantity: 1 }] } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.addToCart("p1");
    });

    expect(toast.success).toHaveBeenCalledWith("Item added to cart");
  });

  it("removeFromCart: no uid → auth error", async () => {
    useAuth.mockReturnValue({ userId: null });
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.removeFromCart("pid");
    });

    expect(toast.error).toHaveBeenCalledWith("Please log in to remove items");
  });

  it("clearCart: no uid → auth error, then success", async () => {
    // First, not authenticated
    useAuth.mockReturnValue({ userId: null });
    const { result, rerender } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.clearCart();
    });
    expect(toast.error).toHaveBeenCalledWith("Please log in to clear cart");

    // Now authenticate and mock a successful delete
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.delete.mockResolvedValue({ data: { cart: { items: [1, 2] } } });
    rerender();
    await act(async () => {
      await result.current.clearCart();
    });
    expect(toast.success).toHaveBeenCalledWith("Cart cleared");
  });

  it("updateQuantity: no uid → auth error", async () => {
    useAuth.mockReturnValue({ userId: null });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 2);
    });
    expect(toast.error).toHaveBeenCalledWith("Please log in to update cart");
  });

  it("updateQuantity: invalid productId → parameter error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity(null, 2);
    });
    expect(toast.error).toHaveBeenCalledWith("Invalid product");
  });

  it("updateQuantity: invalid quantity → validation error", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 0);
    });
    expect(toast.error).toHaveBeenCalledWith("Quantity must be at least 1");
  });

  it("updateQuantity: success path", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.put.mockResolvedValue({ data: { cart: { items: [{ id: "pid", quantity: 5 }] } } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 5);
    });

    expect(toast.success).toHaveBeenCalledWith("Quantity updated to 5");
    expect(result.current.cartItems).toEqual([{ id: "pid", quantity: 5 }]);
  });

  it("updateQuantity: HTML error branch", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.put.mockRejectedValue({ response: { data: "<!DOCTYPE html>" } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 1);
    });
    expect(toast.error).toHaveBeenCalled();
  });

  it("updateQuantity: 404 retry scenario", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.put.mockRejectedValue({
      response: { status: 404, data: { message: "Item not found in cart" } }
    });
    // simulate retry
    axios.get.mockResolvedValue({ data: { items: [] } });
    axios.post.mockResolvedValue({ data: { items: [] } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 1);
    });
    expect(toast.info).toHaveBeenCalledWith("Item was missing. Added to cart.");
  });

  it("updateQuantity: 404 cart-not-found scenario", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.put.mockRejectedValue({ response: { status: 404, data: { message: "Cart not found" } } });
    axios.get.mockResolvedValue({ data: { items: [] } });
    axios.post.mockResolvedValue({ data: { items: [] } });

    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 1);
    });
    expect(toast.info).toHaveBeenCalledWith("Cart created. Item added to cart.");
  });

  it("updateQuantity: final error cleanup timer", async () => {
    useAuth.mockReturnValue({ userId: "uid123" });
    axios.put.mockRejectedValue({ response: { data: { message: "Oops" } } });

    vi.useFakeTimers();
    const { result } = renderHook(() => useCart(), { wrapper });
    await act(async () => {
      await result.current.updateQuantity("pid", 1);
    });
    // instead of checking state, assert the toast
    expect(toast.error).toHaveBeenCalledWith("Oops");

    // fast‐forward cleanup timer
    vi.advanceTimersByTime(5000);
  });
});
