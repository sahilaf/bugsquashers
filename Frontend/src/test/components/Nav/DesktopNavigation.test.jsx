import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import DesktopNavigation from '../../../components/Nav/DesktopNavigation';

// Mock useCart to control cartCount
vi.mock('../../../pages/cart/context/CartContex', () => ({
  useCart: () => ({ cartCount: 2 }),
}));

// Mock lucide-react icons to render simple placeholders
vi.mock('lucide-react', () => ({
  User: () => <span data-testid="icon-user" />,
  Settings: () => <span data-testid="icon-settings" />,
  Package: () => <span data-testid="icon-package" />,
  LogOut: () => <span data-testid="icon-logout" />,
  ShoppingCart: () => <span data-testid="icon-cart" />,
  Brain: () => <span data-testid="icon-brain" />,
  BotMessageSquare: () => <span data-testid="icon-bot" />,
  House: () => <span data-testid="icon-house" />,
  Store: () => <span data-testid="icon-store" />
}));

// Mock ThemeToggle to avoid complexity (must return __esModule + default)
vi.mock('../../../components/Nav/ThemeToggle', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => <button data-testid="theme-toggle" />,
  };
});

// Mock UI components where needed
vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));
vi.mock('../../../components/ui/badge', () => ({
  Badge: ({ children }) => <span data-testid="badge">{children}</span>,
}));
vi.mock('../../../components/ui/avatar', () => ({
  Avatar: ({ children }) => <div>{children}</div>,
  AvatarFallback: ({ children }) => <div>{children}</div>,
  AvatarImage: () => <img alt="avatar" />
}));
vi.mock('../../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...props }) => <div role="menuitem" {...props}>{children}</div>,
  DropdownMenuSeparator: () => <hr />
}));
vi.mock('../../../components/ui/sheet', () => ({
  Sheet: ({ children }) => <div>{children}</div>,
  SheetTrigger: ({ children }) => <div>{children}</div>,
  SheetContent: ({ children }) => <div>{children}</div>,
  SheetHeader: ({ children }) => <div>{children}</div>,
  SheetTitle: ({ children }) => <h2>{children}</h2>
}));

describe('DesktopNavigation', () => {
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

  it('renders Sign In when no user and navigates to login on click', () => {
    render(
      <DesktopNavigation
        user={null}
        userData={{}}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    const signInBtn = screen.getByText(/Sign In/i);
    expect(signInBtn).toBeInTheDocument();
    fireEvent.click(signInBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders navigation buttons and badge count', () => {
    render(
      <DesktopNavigation
        user={null}
        userData={{}}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    // Home button
    fireEvent.click(screen.getByText(/Home/i));
    expect(mockHome).toHaveBeenCalled();

    // Market button
    fireEvent.click(screen.getByText(/Market/i));
    expect(mockMarket).toHaveBeenCalled();

    // AI recommendations button
    fireEvent.click(screen.getByText(/Ai recommendations/i));
    expect(mockNavigate).toHaveBeenCalledWith('/recommendation');

    // Cart button should show badge with count 2
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('2');
  });

  it('shows support assistant sheet and handles send message', async () => {
    render(
      <DesktopNavigation
        user={null}
        userData={{}}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    // Open support assistant via its visible text, filtering to button element
    const supportBtn = screen.getByText(/Support assistant/i, { selector: 'button' });
    expect(supportBtn).toBeInTheDocument();
    fireEvent.click(supportBtn);

    // since sheet content is always rendered, check input/send
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    const sendBtn = screen.getByText(/Send/i);
    fireEvent.click(sendBtn);

    // Bot response fallback after mock fetch
    const botMsg = await screen.findByText(/Failed to fetch support response/i);
    expect(botMsg).toBeInTheDocument();
  });

  it('renders user dropdown and menu items when user is present', () => {
    const user = { uid: '123' };
    const userData = { displayName: 'Test User', email: 'test@example.com', role: 'Admin' };

    render(
      <DesktopNavigation
        user={user}
        userData={userData}
        navigate={mockNavigate}
        handleLogout={mockLogout}
        handleDashboardClick={mockDashboard}
        handleMarketClick={mockMarket}
        handleHomeClick={mockHome}
        loading={false}
      />
    );

    // Dropdown trigger should show avatar fallback initial 'T'
    const avatars = screen.getAllByText('T');
    fireEvent.click(avatars[0]);

    // Dashboard item
    const dashItem = screen.getByText(/Dashboard/i);
    fireEvent.click(dashItem);
    expect(mockDashboard).toHaveBeenCalled();

    // Profile settings item
    const profileItem = screen.getByText(/Profile Settings/i);
    fireEvent.click(profileItem);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');

    // My Orders item
    const ordersItem = screen.getByText(/My Orders/i);
    fireEvent.click(ordersItem);
    expect(mockNavigate).toHaveBeenCalledWith('/orders');

    // Logout
    const logoutItem = screen.getByText(/Log out/i);
    fireEvent.click(logoutItem);
    expect(mockLogout).toHaveBeenCalled();
  });
});
