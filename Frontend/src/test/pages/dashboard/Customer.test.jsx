import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CustomerDashboard from '../../../pages/dashboard/Customer';
import { useAuth } from '../../../pages/auth/AuthContext';
import useShopDetails from '../../../hooks/use-shop';

// Mock external dependencies and child components
vi.mock('axios');
vi.mock('../../../pages/auth/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../../../hooks/use-shop', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../../pages/dashboard/components/Customer/RecentOrder', () => ({ __esModule: true, default: () => <div>RecentOrdersComponent</div> }));
vi.mock('../../../pages/dashboard/components/Customer/SavedAddresses', () => ({ __esModule: true, SavedAddresses: () => <div>SavedAddressesComponent</div> }));

describe('CustomerDashboard Component', () => {
  beforeEach(() => {
    // Stub authentication
    useAuth.mockReturnValue({ userId: 'user123' });
    // Stub shop details hook
    useShopDetails.mockReturnValue({ shop: { _id: 'shop123' }, loading: false, error: null });
    // Stub orders API
    axios.get.mockResolvedValue({ data: [] });
    // Stub user data fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ fullName: 'John Doe', email: 'john@example.com', phone: '12345' }) })
    );
  });

  it('renders the main dashboard cards', () => {
    render(<CustomerDashboard />);
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('Saved Addresses')).toBeInTheDocument();
    expect(screen.getByText('Account Age')).toBeInTheDocument();
  });

  it('shows RecentOrders and AccountOverview in the Overview tab', async () => {
    render(<CustomerDashboard />);
    // RecentOrders stub
    expect(screen.getByText('RecentOrdersComponent')).toBeInTheDocument();
    // AccountOverview displays fetched user name
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  });

  it('navigates between tabs correctly', async () => {
    render(<CustomerDashboard />);
    const user = userEvent.setup();

    // Switch to Orders tab
    await user.click(screen.getByRole('tab', { name: /Orders/i }));
    expect(screen.getByText('RecentOrdersComponent')).toBeInTheDocument();

    // Switch to Account tab
    await user.click(screen.getByRole('tab', { name: /Account/i }));
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Switch to Addresses tab
    await user.click(screen.getByRole('tab', { name: /Addresses/i }));
    expect(screen.getByText('SavedAddressesComponent')).toBeInTheDocument();
  });
});
