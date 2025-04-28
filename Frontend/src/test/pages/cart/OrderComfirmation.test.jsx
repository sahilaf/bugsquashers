// File: src/test/pages/cart/OrderConfirmation.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderComfirmation from "../../../pages/cart/OrderComfirmation"; // fixed filename

describe("OrderComfirmation Component", () => {
  it("renders the confirmation heading", () => {
    render(<OrderComfirmation />);
    const heading = screen.getByRole("heading", { name: /Order Confirmation/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders thank-you message and shop-more link", () => {
    render(<OrderComfirmation />);
    const thankYou = screen.getByText(/Thank you for your order!/i);
    expect(thankYou).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Shop more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/market");
  });
});
