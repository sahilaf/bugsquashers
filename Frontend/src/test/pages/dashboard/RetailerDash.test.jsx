import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RetailerDash from '../../../pages/dashboard/RetailerDash';
import { vi } from 'vitest';

// Mock window.matchMedia for use-mobile hook
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Mock child components
vi.mock('../../../pages/dashboard/components/Retailer/Overview', () => ({
  __esModule: true,
  default: () => <div>OverviewComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/ShopDetails', () => ({
  __esModule: true,
  default: () => <div>ShopDetailsComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/StatisticsDashboard', () => ({
  __esModule: true,
  StatisticsDashboard: () => <div>StatisticsDashboardComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/ProductInventory', () => ({
  __esModule: true,
  default: () => <div>ProductInventoryComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/recent-orders', () => ({
  __esModule: true,
  RecentOrders: () => <div>RecentOrdersComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/PurchaseHistory', () => ({
  __esModule: true,
  default: () => <div>PurchaseHistoryComponent</div>,
}));
vi.mock('../../../pages/dashboard/components/Retailer/Review', () => ({
  __esModule: true,
  ReviewsDashboard: () => <div>ReviewsDashboardComponent</div>,
}));

describe('RetailerDash Component', () => {
  beforeEach(() => {
    render(<RetailerDash />);
  });

  it('renders Overview section by default', () => {
    expect(screen.getByText('OverviewComponent')).toBeInTheDocument();
  });

  it('has all sidebar menu items', () => {
    const labels = [
      'Overview', 'Shop detail', 'Statistics',
      'Products', 'Orders', 'Purchase history', 'Reviews'
    ];
    labels.forEach(label => {
      expect(screen.getAllByRole('button', { name: label }).length).toBeGreaterThan(0);
    });
  });

  it('switches to Shop detail section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Shop detail' })[0]);
    expect(screen.getByText('ShopDetailsComponent')).toBeInTheDocument();
  });

  it('switches to Statistics section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Statistics' })[0]);
    expect(screen.getByText('StatisticsDashboardComponent')).toBeInTheDocument();
  });

  it('switches to Products section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Products' })[0]);
    expect(screen.getByText('ProductInventoryComponent')).toBeInTheDocument();
  });

  it('switches to Orders section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Orders' })[0]);
    expect(screen.getByText('RecentOrdersComponent')).toBeInTheDocument();
  });

  it('switches to Purchase history section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Purchase history' })[0]);
    expect(screen.getByText('PurchaseHistoryComponent')).toBeInTheDocument();
  });

  it('switches to Reviews section', async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: 'Reviews' })[0]);
    expect(screen.getByText('ReviewsDashboardComponent')).toBeInTheDocument();
  });
});
