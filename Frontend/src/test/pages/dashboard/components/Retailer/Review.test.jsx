import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ReviewsDashboard } from '../../../../../pages/dashboard/components/Retailer/Review';

// Mock all lucide-react icons used in Review.jsx
vi.mock('lucide-react', () => ({
  Star: () => <span data-testid="star-icon" />,  
  MessageSquare: () => <span data-testid="msg-icon" />,
  ThumbsUp: () => <span data-testid="thumb-up" />,
  ThumbsDown: () => <span data-testid="thumb-down" />,
  ArrowRight: () => <span data-testid="arrow-right" />,
}));

describe('<ReviewsDashboard /> integration', () => {
  beforeEach(() => {
    render(<ReviewsDashboard />);
  });

  it('renders header, tabs, and export button', () => {
    // Main heading
    expect(screen.getByRole('heading', { name: /customer reviews/i })).toBeInTheDocument();
    // Export button
    expect(screen.getByRole('button', { name: /export reviews/i })).toBeInTheDocument();
    // Tabs
    ['All Reviews', 'Positive', 'Negative', 'Unanswered'].forEach(tabLabel => {
      expect(screen.getByRole('tab', { name: new RegExp(tabLabel, 'i') })).toBeInTheDocument();
    });
  });

  it('renders summary, distribution, and trends cards', () => {
    expect(screen.getByText(/review summary/i)).toBeInTheDocument();
    expect(screen.getByText(/rating distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/review trends/i)).toBeInTheDocument();
  });

  it('shows all reviews by default and allows filtering to unanswered', async () => {
    // Check default: presence of multiple review titles indicates list rendered
    const reviewTitles = from => [`Excellent product, exceeded expectations!`, `Great product with minor issues`, `Disappointed with durability`, `Perfect for my needs!`, `Doesn't work as advertised`];
    reviewTitles().forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Filter to Unanswered
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /unanswered/i }));

    // Titles that were replied should not appear
    expect(screen.queryByText(/Excellent product, exceeded expectations!/i)).toBeNull();
    expect(screen.queryByText(/Disappointed with durability/i)).toBeNull();
    expect(screen.queryByText(/Doesn't work as advertised/i)).toBeNull();

    // Only unanswered titles
    expect(screen.getByText(/Great product with minor issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfect for my needs!/i)).toBeInTheDocument();

    // Each unreplied card shows Reply button
    const replyButtons = screen.getAllByRole('button', { name: /reply/i });
    expect(replyButtons).toHaveLength(2);
  });

  it('shows load more reviews button at the bottom', () => {
    expect(screen.getByRole('button', { name: /load more reviews/i })).toBeInTheDocument();
  });
});
