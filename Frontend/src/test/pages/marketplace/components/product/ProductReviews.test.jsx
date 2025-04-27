import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductReviews } from '../../../../../pages/marketplace/components/product/ProductReviews';

// Mock lucide-react Star icon
vi.mock('lucide-react', () => ({
  Star: ({ className }) => <svg data-testid="Star" className={className} />
}));

// Mock UI components
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button data-testid="Button" onClick={onClick}>{children}</button>
  )
}));
vi.mock('../../../../../components/ui/progress', () => ({
  Progress: ({ value }) => <div data-testid="Progress" data-value={value} />
}));

// Mock ProductReviewItem
const reviewSamples = [
  { id: 'r1', author: 'A1', date: '', rating: 5, title: '', content: '', helpfulCount: 0, authorInitials: 'A1' },
  { id: 'r2', author: 'A2', date: '', rating: 4, title: '', content: '', helpfulCount: 0, authorInitials: 'A2' }
];
vi.mock('../../../../../pages/marketplace/components/product/ProductReviewItem', () => ({
  ProductReviewItem: ({ review }) => <div data-testid="ProductReviewItem">{review.id}</div>
}));

describe('ProductReviews', () => {
  const onWriteReviewMock = vi.fn();

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders summary stars and average', () => {
    render(<ProductReviews reviews={reviewSamples} onWriteReview={onWriteReviewMock} />);

    // Heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Customer Reviews');
    // Average value
    expect(screen.getByText('4.5')).toBeInTheDocument();
    // Stars: first 4 filled, last unfilled
    const stars = screen.getAllByTestId('Star');
    expect(stars).toHaveLength(5);
    expect(stars.slice(0,4).every(s => s.classList.contains('fill-primary'))).toBe(true);
    expect(stars[4].classList.contains('fill-muted')).toBe(true);
    // Based on text
    expect(screen.getByText('Based on 20 reviews')).toBeInTheDocument();
  });

  it('renders rating distribution bars correctly', () => {
    render(<ProductReviews reviews={reviewSamples} onWriteReview={onWriteReviewMock} />);
    const progressBars = screen.getAllByTestId('Progress');
    // Expect one bar per ratingData entry (5 entries)
    expect(progressBars).toHaveLength(5);
    // Check data-value attributes
    const expectedValues = [75,15,5,3,2];
    progressBars.forEach((bar, idx) => {
      expect(bar).toHaveAttribute('data-value', expectedValues[idx].toString());
    });
  });

  it('calls onWriteReview when Write a Review clicked', () => {
    render(<ProductReviews reviews={reviewSamples} onWriteReview={onWriteReviewMock} />);
    const writeBtn = screen.getByRole('button', { name: /Write a Review/i });
    fireEvent.click(writeBtn);
    expect(onWriteReviewMock).toHaveBeenCalled();
  });

  it('renders ProductReviewItem for each review', () => {
    render(<ProductReviews reviews={reviewSamples} onWriteReview={onWriteReviewMock} />);
    const items = screen.getAllByTestId('ProductReviewItem');
    expect(items).toHaveLength(reviewSamples.length);
    expect(items.map(item => item.textContent)).toEqual(reviewSamples.map(r => r.id));
  });

  it('shows Load More Reviews button and triggers alert on click', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ProductReviews reviews={reviewSamples} onWriteReview={onWriteReviewMock} />);
    const loadMore = screen.getByRole('button', { name: /Load More Reviews/i });
    fireEvent.click(loadMore);
    expect(alertSpy).toHaveBeenCalledWith('Loading more reviews');
  });
});
