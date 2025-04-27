import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductReviewItem } from '../../../../../pages/marketplace/components/product/ProductReviewItem';

// Mock icons from lucide-react
vi.mock('lucide-react', () => ({
  Star: ({ className }) => <svg data-testid="Star" className={className} />,
  ThumbsUp: () => <svg data-testid="ThumbsUp" />,
  MessageSquare: () => <svg data-testid="MessageSquare" />
}));

// Mock UI components
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button data-testid="Button" onClick={onClick}>{children}</button>
  )
}));
vi.mock('../../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>,
  CardFooter: ({ children }) => <div data-testid="CardFooter">{children}</div>
}));
vi.mock('../../../../../components/ui/avatar', () => ({
  Avatar: ({ children }) => <div data-testid="Avatar">{children}</div>,
  AvatarFallback: ({ children }) => <span data-testid="AvatarFallback">{children}</span>
}));

// Spy on window.alert
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('ProductReviewItem', () => {
  const review = {
    authorInitials: 'AB',
    author: 'Alice Bob',
    date: '2025-04-27',
    rating: 3,
    title: 'Great Product',
    content: 'I really liked this product.',
    helpfulCount: 7
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders author info, date, and avatar fallback', () => {
    render(<ProductReviewItem review={review} />);
    expect(screen.getByTestId('AvatarFallback')).toHaveTextContent(review.authorInitials);
    expect(screen.getByText(review.author)).toBeInTheDocument();
    expect(screen.getByText(review.date)).toBeInTheDocument();
  });

  it('renders correct number of stars with filled and unfilled classes', () => {
    render(<ProductReviewItem review={review} />);
    const stars = screen.getAllByTestId('Star');
    expect(stars).toHaveLength(5);
    const filled = stars.filter(s => s.classList.contains('fill-primary'));
    const unfilled = stars.filter(s => s.classList.contains('fill-muted'));
    expect(filled).toHaveLength(review.rating);
    expect(unfilled).toHaveLength(5 - review.rating);
  });

  it('renders title and content', () => {
    render(<ProductReviewItem review={review} />);
    expect(screen.getByText(review.title)).toBeInTheDocument();
    expect(screen.getByText(review.content)).toBeInTheDocument();
  });

  it('renders helpful count with thumbs up icon', () => {
    render(<ProductReviewItem review={review} />);
    expect(screen.getByTestId('ThumbsUp')).toBeInTheDocument();
    expect(screen.getByText(`${review.helpfulCount} people found this helpful`)).toBeInTheDocument();
  });

  it('calls alert on Reply button click', () => {
    render(<ProductReviewItem review={review} />);
    const replyButton = screen.getByRole('button', { name: /Reply/i });
    fireEvent.click(replyButton);
    expect(alertSpy).toHaveBeenCalledWith(`Reply to ${review.author}`);
  });
});
