import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import MobileNavigation from "../../../components/Nav/MobileNavigation";

// Mock useCart to control cartCount
vi.mock("../../../pages/cart/context/CartContex", () => ({
  useCart: () => ({ cartCount: 3 }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ShoppingCart: () => <span data-testid="icon-cart" />,
  Menu: () => <span data-testid="icon-menu" />,
  BotMessageSquare: () => <span data-testid="icon-bot" />,
}));

// Mock UI components
vi.mock("../../../components/ui/button", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock("../../../components/ui/badge", () => ({
  Badge: ({ children }) => <span data-testid="badge">{children}</span>,
}));
vi.mock("../../../components/ui/sheet", () => ({
  Sheet: ({ children }) => <div>{children}</div>,
  SheetTrigger: ({ children }) => <div>{children}</div>,
  SheetContent: ({ children }) => <div>{children}</div>,
}));
// Mock ThemeToggle
vi.mock("../../../components/Nav/ThemeToggle", () => ({
  __esModule: true,
  default: ({ showText }) => (
    <button data-testid="theme-toggle">{showText ? "Theme" : null}</button>
  ),
}));

describe("MobileNavigation", () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();
  const mockDashboard = vi.fn();
  const mockMarket = vi.fn();
  const mockHome = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders cart icon with badge and navigates to cart on click", () => {
    render(
      <MobileNavigation
        user={null}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    const cartBtn = screen.getByTestId("icon-cart").closest("button");
    expect(cartBtn).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toHaveTextContent("3");
    fireEvent.click(cartBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("opens support sheet and sends message fallback", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("fail"));

    render(
      <MobileNavigation
        user={null}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    const supportBtn = screen.getByRole("button", { name: /support/i });
    fireEvent.click(supportBtn);

    const input = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(input, { target: { value: "Hi" } });
    fireEvent.keyDown(input, { key: "Enter" });

    const sendBtn = screen.getByText(/Send/i);
    fireEvent.click(sendBtn);

    const botMsg = await screen.findByText(
      "⚠️ Sorry, I'm having trouble connecting. Please try again later."
    );
    expect(botMsg).toBeInTheDocument();

    global.fetch.mockRestore();
  });

  it("opens navigation menu sheet and handles nav buttons", () => {
    render(
      <MobileNavigation
        user={null}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    const menuBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector('[data-testid="icon-menu"]'));
    fireEvent.click(menuBtn);

    // Home nav
    fireEvent.click(screen.getByText(/Home/i));
    expect(mockHome).toHaveBeenCalled();

    // Market nav
    fireEvent.click(screen.getByText(/Market/i));
    expect(mockMarket).toHaveBeenCalled();

    // Recommendations nav
    const recBtn = screen.getByText(/Ai recommendations/i);
    fireEvent.click(recBtn);
    const recNavArg = mockNavigate.mock.calls[0][0];
    expect(["/recommendation", "/airedirect"]).toContain(recNavArg);

    // Dashboard nav
    fireEvent.click(screen.getByRole("button", { name: /Dashboard/i }));
    expect(mockDashboard).toHaveBeenCalled();
  });

  it("renders ThemeToggle and login/logout button based on user", () => {
    const { rerender } = render(
      <MobileNavigation
        user={null}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Sign In/i));
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    rerender(
      <MobileNavigation
        user={{ uid: "u1" }}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );
    fireEvent.click(screen.getByText(/Log out/i));
    expect(mockLogout).toHaveBeenCalled();
  });
});
