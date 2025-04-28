// File: src/test/pages/cart/PaymentFailed.test.jsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentFailed from "../../../pages/cart/PaymentFailed";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

// Mock the router’s useNavigate and the icon component
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("lucide-react", () => ({ AlertCircle: vi.fn(() => <svg data-testid="AlertCircle" />) }));

describe("PaymentFailed Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders all elements correctly", () => {
    render(<PaymentFailed />);

    // Container and card
    expect(screen.getByText("Payment Failed")).toBeInTheDocument();

    // Icon
    expect(screen.getByTestId("AlertCircle")).toBeInTheDocument();

    // Paragraphs
    expect(
      screen.getByText(
        /We were unable to process your payment\. Your order has not been confirmed\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please try again or use a different payment method\./i)
    ).toBeInTheDocument();

    // Buttons
    expect(screen.getByRole("button", { name: /Return to Cart/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
  });

  it("navigates to /cart when Return to Cart is clicked", () => {
    render(<PaymentFailed />);
    fireEvent.click(screen.getByRole("button", { name: /Return to Cart/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("navigates to /checkout when Try Again is clicked", () => {
    render(<PaymentFailed />);
    fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });
});
