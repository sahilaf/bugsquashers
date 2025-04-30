// File: src/test/pages/cart/Checkout.test.jsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Checkout from "../../../pages/cart/Checkout";
import { useCart } from "../../../pages/cart/context/CartContex";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";

// Mock external hooks & modules
vi.mock("../../../pages/cart/context/CartContex", () => ({ useCart: vi.fn() }));
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("react-hot-toast", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("firebase/auth", () => ({ getAuth: vi.fn() }));

describe("Checkout Component", () => {
  const mockNavigate = vi.fn();
  const mockClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // default cart context
    useCart.mockReturnValue({
      cartItems: [
        { productId: { _id: "p1", name: "Prod1", price: 10, shop: "s", shopName: "S" }, quantity: 2 },
        { productId: { _id: "p2", name: "Prod2", price: 5, shop: "s", shopName: "S" }, quantity: 1 },
      ],
      loading: false,
      clearCart: mockClearCart,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders loading state", () => {
    useCart.mockReturnValue({ cartItems: [], loading: true, clearCart: mockClearCart });
    render(<Checkout />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to /cart when not loading and cart is empty", () => {
    useCart.mockReturnValue({ cartItems: [], loading: false, clearCart: mockClearCart });
    render(<Checkout />);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("renders inputs and order summary with correct totals", () => {
    render(<Checkout />);
    // Check that all input fields are present
    [
      /Full Name/i,
      /Email/i,
      /Address/i,
      /City/i,
      /State/i,
      /Zip Code/i,
      /Phone Number/i
    ].forEach((labelRegex) => {
      expect(screen.getByLabelText(labelRegex)).toBeInTheDocument();
    });

    // Subtotal=25 (10*2 + 5*1), Shipping=5.99, Tax=2.00, Total=32.99
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    expect(screen.getByText("$5.99")).toBeInTheDocument();
    expect(screen.getByText("$2.00")).toBeInTheDocument();
    expect(screen.getByText("$32.99")).toBeInTheDocument();
  });

  it("updates customer state on input change", () => {
    render(<Checkout />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: "Alice" } });
    expect(nameInput).toHaveValue("Alice");
  });

  it("shows validation error when required fields are missing", async () => {
    render(<Checkout />);
    const button = screen.getByRole("button", { name: /Place Order/i });
    await act(() => fireEvent.click(button));
    expect(toast.error).toHaveBeenCalledWith("Please fill in all required fields");
  });

  it("shows auth error when user not authenticated", async () => {
    render(<Checkout />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Addr" } });

    getAuth.mockReturnValue({ currentUser: null });

    const button = screen.getByRole("button", { name: /Place Order/i });
    await act(() => fireEvent.click(button));
    expect(toast.error).toHaveBeenCalledWith("User not authenticated");
  });

  it("handles successful checkout", async () => {
    render(<Checkout />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Addr" } });

    const fakeUser = { getIdToken: vi.fn().mockResolvedValue("tok") };
    getAuth.mockReturnValue({ currentUser: fakeUser });

    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    const button = screen.getByRole("button", { name: /Place Order/i });
    await act(() => fireEvent.click(button));
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    expect(fakeUser.getIdToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/api/orders/create`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer tok" }),
      })
    );
    expect(toast.success).toHaveBeenCalledWith("Order placed successfully!");
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/orderconfirmation");
  });

  it("handles failed checkout response", async () => {
    render(<Checkout />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Addr" } });

    getAuth.mockReturnValue({ currentUser: { getIdToken: vi.fn().mockResolvedValue("tok") } });
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ message: "Bad" }) });

    const button = screen.getByRole("button", { name: /Place Order/i });
    await act(() => fireEvent.click(button));
    expect(toast.error).toHaveBeenCalledWith("Bad");
  });

  it("handles network error during checkout", async () => {
    render(<Checkout />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Addr" } });

    getAuth.mockReturnValue({ currentUser: { getIdToken: vi.fn() } });
    global.fetch = vi.fn().mockRejectedValue(new Error("fail"));

    const button = screen.getByRole("button", { name: /Place Order/i });
    await act(() => fireEvent.click(button));
    expect(toast.error).toHaveBeenCalledWith("Order processing failed");
  });

  it("disables button while processing", async () => {
    render(<Checkout />);
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Addr" } });

    getAuth.mockReturnValue({ currentUser: { getIdToken: vi.fn().mockResolvedValue("tok") } });
    global.fetch = vi.fn().mockImplementation(() =>
      new Promise(res => setTimeout(() => res({ ok: true, json: () => Promise.resolve({}) }), 50))
    );

    const button = screen.getByRole("button", { name: /Place Order/i });
    act(() => fireEvent.click(button));
    expect(button).toBeDisabled();
    await act(() => new Promise(r => setTimeout(r, 60)));
    expect(button).not.toBeDisabled();
  });
});
