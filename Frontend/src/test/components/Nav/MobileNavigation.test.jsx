import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import MobileNavigation from '../../../components/Nav/MobileNavigation';

// Mock useCart to control cartCount
vi.mock('../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ cartCount: 3 }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <span data-testid="icon-cart" />,
  Menu: () => <span data-testid="icon-menu" />,
  BotMessageSquare: () => <span data-testid="icon-bot" />,
}));

// Mock UI components
vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock('../../../components/ui/badge', () => ({
  Badge: ({ children }) => <span data-testid="badge">{children}</span>,
}));
vi.mock('../../../components/ui/sheet', () => ({
  Sheet: ({ children }) => <div>{children}</div>,
  SheetTrigger: ({ children }) => <div>{children}</div>,
  SheetContent: ({ children }) => <div>{children}</div>,
}));
// Mock ThemeToggle
vi.mock('../../../components/Nav/ThemeToggle', () => ({
  __esModule: true,
  default: ({ showText }) => <button data-testid="theme-toggle">{showText ? 'Theme' : null}</button>,
}));

describe('MobileNavigation', () => {
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

  it('renders cart icon with badge and navigates to cart on click', () => {
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

    // Find cart button via its icon test ID
    const cartBtn = screen.getByTestId('icon-cart').closest('button');
    expect(cartBtn).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('3');
    fireEvent.click(cartBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it('opens support sheet and sends message fallback', async () => {
    // mock fetch to reject
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));

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

    // open support sheet
    const supportBtn = screen.getByRole('button', { name: /support/i });
    fireEvent.click(supportBtn);

    // send message via Enter
    const input = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    const sendBtn = screen.getByText(/Send/i);
    fireEvent.click(sendBtn);

    const botMsg = await screen.findByText(/Failed to fetch support response/i);
    expect(botMsg).toBeInTheDocument();
  });

  it('opens navigation menu sheet and handles nav buttons', () => {
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

    // open menu
    const menuBtn = screen.getAllByRole('button').find(btn => btn.querySelector('[data-testid="icon-menu"]'));
    fireEvent.click(menuBtn);

    // Home nav
    const homeBtn = screen.getByText(/Home/i);
    fireEvent.click(homeBtn);
    expect(mockHome).toHaveBeenCalled();

    // Market nav
    const marketBtn = screen.getByText(/Market/i);
    fireEvent.click(marketBtn);
    expect(mockMarket).toHaveBeenCalled();

    // Recommendations nav
    const recBtn = screen.getByText(/Ai recommendations/i);
    fireEvent.click(recBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/recommendation');

    // Dashboard nav
    const dashBtn = screen.getByRole('button', { name: /Dashboard/i });
    fireEvent.click(dashBtn);
    expect(mockDashboard).toHaveBeenCalled();
  });

  it('renders ThemeToggle and login/logout button based on user', () => {
    // when no user
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
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    const signInBtn = screen.getByText(/Sign In/i);
    fireEvent.click(signInBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // when user present
    rerender(
      <MobileNavigation
        user={{ uid: 'u1' }}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );
    const logoutBtn = screen.getByText(/Log out/i);
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });
});
