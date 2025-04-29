import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Nav from '../../../components/Nav/Nav';
import { useAuth } from '../../../pages/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../pages/auth/Firebase';
import { signOut } from 'firebase/auth';

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000',
  },
  writable: true,
});
// Mock AuthContext
vi.mock('../../../pages/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));
// Mock react-router-dom useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));
// Mock Firebase auth.onAuthStateChanged
vi.mock('../../../pages/auth/Firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
}));
// Mock signOut
vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));
// Stub DesktopNavigation and MobileNavigation
vi.mock('../../../components/Nav/DesktopNavigation', () => ({
  __esModule: true,
  default: props => (
    <div data-testid="desktop-nav"
         data-user={props.user ? 'true' : 'false'}
         data-role={props.userData?.role || ''}
         data-loading={props.loading ? 'true' : 'false'}>
      <button data-testid="logout-btn" onClick={props.handleLogout}>Log out</button>
      <button data-testid="home-btn" onClick={props.handleHomeClick}>Home</button>
      <button data-testid="dashboard-btn" onClick={props.handleDashboardClick}>Dashboard</button>
      <button data-testid="market-btn" onClick={props.handleMarketClick}>Market</button>
    </div>
  )
}));
vi.mock('../../../components/Nav/MobileNavigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mobile-nav" />
}));

describe('Nav component', () => {
  let mockNavigate;

  beforeEach(() => {
    vi.resetAllMocks();
    useAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    auth.onAuthStateChanged.mockImplementation(cb => {
      cb({ getIdToken: () => Promise.resolve('token123') });
      return () => {};
    });
  });

  it('fetches user data and passes correct props to DesktopNavigation', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { role: 'Farmer' } }),
    });

    render(<Nav />);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/user`,
        expect.objectContaining({ headers: expect.any(Object) })
      )
    );

    const desktopNav = await screen.findByTestId('desktop-nav');
    expect(desktopNav).toHaveAttribute('data-user', 'true');
    expect(desktopNav).toHaveAttribute('data-role', 'Farmer');
    expect(desktopNav).toHaveAttribute('data-loading', 'false');
  });

  it('handles logout by calling signOut and navigating to login', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: {} }) });

    render(<Nav />);
    const logoutBtn = await screen.findByTestId('logout-btn');
    fireEvent.click(logoutBtn);

    await waitFor(() => expect(signOut).toHaveBeenCalledWith(auth));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates home when Home button is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: {} }) });

    render(<Nav />);
    const homeBtn = await screen.findByTestId('home-btn');
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to dashboard when Dashboard button is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: { role: 'User' } }) });

    render(<Nav />);
    const dashBtn = await screen.findByTestId('dashboard-btn');
    fireEvent.click(dashBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to correct market based on role and fallback', async () => {
    // Case 1: Farmer
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: { role: 'Farmer' } }) });
    const { unmount } = render(<Nav />);
    const marketBtn = await screen.findByTestId('market-btn');
    fireEvent.click(marketBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/farmermarket');
    unmount();

    // Case 2: No role
    mockNavigate.mockClear();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ user: {} }) });
    render(<Nav />);
    const marketBtn2 = await screen.findByTestId('market-btn');
    fireEvent.click(marketBtn2);
    expect(mockNavigate).toHaveBeenCalledWith('/market');
  });
});
