import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatisticsDashboard } from '../../../../../pages/dashboard/components/Retailer/StatisticsDashboard';

describe('StatisticsDashboard', () => {
  beforeEach(() => {
    render(<StatisticsDashboard />);
  });

  it('renders the heading and overview tab by default', () => {
    expect(screen.getByRole('heading', { name: /Statistics/i })).toBeInTheDocument();
    // Overview StatCards
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('New Customers')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    // Charts in overview
    expect(screen.getByText(/Sales trend chart would appear here/i)).toBeInTheDocument();
    expect(screen.getByText(/Best performing products by sales volume/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer acquisition chart would appear here/i)).toBeInTheDocument();
    expect(screen.getByText(/Category sales chart would appear here/i)).toBeInTheDocument();
  });

  it('allows switching to Sales tab', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Sales/i }));
    expect(screen.getByText(/Sales trend chart would appear here/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Sales Performance/i })).toBeInTheDocument();
  });

  it('allows switching to Products tab', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Products/i }));
    expect(screen.getByText(/Product performance chart would appear here/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Product Performance/i })).toBeInTheDocument();
  });

  it('allows switching to Customers tab', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /Customers/i }));
    expect(screen.getByText(/Customer demographics chart would appear here/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Customer Demographics/i })).toBeInTheDocument();
  });

  it('StatCard displays correct values and trend classes', () => {
    // Total Revenue: up trend
    const revenueChange = screen.getByText('+20.1%');
    expect(revenueChange).toHaveClass('text-green-500');
    // Conversion Rate: down trend
    const conversionChange = screen.getByText('-0.4%');
    expect(conversionChange).toHaveClass('text-red-500');
  });

  it('SalesChart has a View Detailed Report button', () => {
    const button = screen.getByRole('button', { name: /View Detailed Report/i });
    expect(button).toBeInTheDocument();
  });

  it('TopProducts lists all products and has View All Products button', () => {
    expect(screen.getByText('Wireless Earbuds')).toBeInTheDocument();
    expect(screen.getByText('Smart Watch')).toBeInTheDocument();
    expect(screen.getByText('Bluetooth Speaker')).toBeInTheDocument();
    expect(screen.getByText('Phone Case')).toBeInTheDocument();
    expect(screen.getByText('Laptop Sleeve')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /View All Products/i });
    expect(button).toBeInTheDocument();
  });

  it('CustomerAcquisition has a View Customer Details button', () => {
    const button = screen.getByRole('button', { name: /View Customer Details/i });
    expect(button).toBeInTheDocument();
  });

  it('SalesByCategory has a View Category Analysis button', () => {
    const button = screen.getByRole('button', { name: /View Category Analysis/i });
    expect(button).toBeInTheDocument();
  });
});
