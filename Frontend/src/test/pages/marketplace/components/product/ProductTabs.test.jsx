// src/test/pages/marketplace/components/product/ProductTabs.test.jsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductTabs } from '../../../../../../src/pages/marketplace/components/product/ProductTabs';

// Testing the ProductTabs component

describe('ProductTabs Component', () => {
  beforeEach(() => {
    render(<ProductTabs />);
  });

  it('renders all tab triggers', () => {
    const detailsTab = screen.getByRole('tab', { name: /details/i });
    const shippingTab = screen.getByRole('tab', { name: /shipping/i });
    const returnsTab = screen.getByRole('tab', { name: /returns/i });

    expect(detailsTab).toBeInTheDocument();
    expect(shippingTab).toBeInTheDocument();
    expect(returnsTab).toBeInTheDocument();
  });

  it('shows details content by default', () => {
    const detailsContent = screen.getByText(/our organic apples are grown without pesticides/i);
    expect(detailsContent).toBeVisible();

    const shippingContent = screen.queryByText(/we ship all orders within 2-3 business days/i);
    const returnsContent = screen.queryByText(/return it within 30 days for a full refund/i);
    expect(shippingContent).not.toBeInTheDocument();
    expect(returnsContent).not.toBeInTheDocument();
  });

  it('shows shipping content when Shipping tab is clicked', async () => {
    const user = userEvent.setup();
    const shippingTab = screen.getByRole('tab', { name: /shipping/i });
    await user.click(shippingTab);

    const shippingContent = await screen.findByText(/we ship all orders within 2-3 business days/i);
    expect(shippingContent).toBeVisible();

    // Ensure other content is hidden
    expect(screen.queryByText(/our organic apples are grown without pesticides/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/return it within 30 days for a full refund/i)).not.toBeInTheDocument();
  });

  it('shows returns content when Returns tab is clicked', async () => {
    const user = userEvent.setup();
    const returnsTab = screen.getByRole('tab', { name: /returns/i });
    await user.click(returnsTab);

    const returnsContent = await screen.findByText(/return it within 30 days for a full refund/i);
    expect(returnsContent).toBeVisible();

    // Ensure other content is hidden
    expect(screen.queryByText(/our organic apples are grown without pesticides/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/we ship all orders within 2-3 business days/i)).not.toBeInTheDocument();
  });
});
