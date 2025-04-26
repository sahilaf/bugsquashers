import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InfiniteMovingCards } from '../../../components/ui/infinite-moving-cards';

// Mock data
const mockItems = [
  {
    name: 'John Doe',
    quote: 'Excellent product!',
    avatar: '/john.jpg',
    title: 'Farmer',
    rating: 4,
  },
  {
    name: 'Jane Smith',
    quote: 'Life changing platform',
    title: 'Retailer',
    rating: 5,
  },
];

describe('InfiniteMovingCards', () => {
  it('renders correct number of duplicated items', () => {
    render(<InfiniteMovingCards items={mockItems} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockItems.length * 2);
  });

  it('applies correct animation direction', () => {
    const { container } = render(
      <InfiniteMovingCards items={mockItems} direction="right" />
    );
    expect(container.firstChild).toHaveStyle({
      '--animation-direction': 'reverse',
    });
  });

  it('applies correct animation speed', () => {
    const { container } = render(
      <InfiniteMovingCards items={mockItems} speed="fast" />
    );
    expect(container.firstChild).toHaveStyle({
      '--animation-duration': '20s',
    });
  });

  it('applies pause on hover class', () => {
    render(
      <InfiniteMovingCards 
        items={mockItems} 
        pauseOnHover={true} 
        className="test-class" 
      />
    );
    const scroller = screen.getByRole('list');
    expect(scroller).toHaveClass('hover:[animation-play-state:paused]');
    expect(scroller.parentElement).toHaveClass('test-class');
  });

  it('displays correct star ratings', () => {
    render(<InfiniteMovingCards items={mockItems} />);
    
    // Get all stars using their SVG element and class combination
    const stars = Array.from(document.getElementsByClassName('lucide-star'));
    
    // Calculate expected filled stars (4 + 5) * 2 duplicates = 18
    const expectedFilled = (mockItems[0].rating + mockItems[1].rating) * 2;
    const filledStars = stars.filter(star => 
      star.classList.contains('text-yellow-400')
    );
    
    expect(filledStars).toHaveLength(expectedFilled);
  });

  it('shows avatar fallback when image missing', () => {
    render(<InfiniteMovingCards items={[mockItems[1]]} />);
    
    // Use queryAll to handle multiple instances
    const fallbacks = screen.getAllByText('J');
    expect(fallbacks.length).toBeGreaterThan(0);
  });

  it('handles missing optional props', () => {
    render(<InfiniteMovingCards items={[mockItems[1]]} />);
    
    // Use queryAll to handle duplicated items
    const names = screen.getAllByText('Jane Smith');
    const titles = screen.getAllByText('Retailer');
    
    expect(names.length).toBeGreaterThan(0);
    expect(titles.length).toBeGreaterThan(0);
  });
});