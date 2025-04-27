import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductGallery } from '../../../../../pages/marketplace/components/product/ProductGallery';

// Mock icons from lucide-react
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <svg data-testid="ChevronLeft" />,  
  ChevronRight: () => <svg data-testid="ChevronRight" />
}));

// Mock UI components
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="Button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}));
vi.mock('../../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>
}));

describe('ProductGallery', () => {
  const productSingle = { name: 'Single Product', images: ['only.png'] };
  const productMulti = { name: 'Test Product', images: ['img1.png', 'img2.png', 'img3.png'] };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders single image without navigation controls or bullets', () => {
    render(<ProductGallery product={productSingle} />);
    const img = screen.getByRole('img', { name: productSingle.name });
    expect(img).toHaveAttribute('src', 'only.png');

    expect(screen.queryByRole('button', { name: 'Previous image' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next image' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Show image/ })).toBeNull();
  });

  it('renders multiple images with working navigation and bullets', () => {
    render(<ProductGallery product={productMulti} />);
    const getImageSrc = () => screen.getByRole('img', { name: productMulti.name }).getAttribute('src');

    // Initial
    expect(getImageSrc()).toBe('img1.png');

    const prevBtn = screen.getByRole('button', { name: 'Previous image' });
    const nextBtn = screen.getByRole('button', { name: 'Next image' });
    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    const bullets = screen.getAllByRole('button', { name: /Show image/ });
    expect(bullets).toHaveLength(3);
    expect(bullets[0]).toHaveAttribute('aria-current', 'true');

    // prev wrap: index 0 -> 2
    fireEvent.click(prevBtn);
    expect(getImageSrc()).toBe('img3.png');
    expect(bullets[2]).toHaveAttribute('aria-current', 'true');

    // next wrap: index 2 -> 0
    fireEvent.click(nextBtn);
    expect(getImageSrc()).toBe('img1.png');
    expect(bullets[0]).toHaveAttribute('aria-current', 'true');

    // next non-wrap: 0 -> 1
    fireEvent.click(nextBtn);
    expect(getImageSrc()).toBe('img2.png');
    expect(bullets[1]).toHaveAttribute('aria-current', 'true');

    // prev non-wrap: 1 -> 0
    fireEvent.click(prevBtn);
    expect(getImageSrc()).toBe('img1.png');
    expect(bullets[0]).toHaveAttribute('aria-current', 'true');

    // direct bullet nav: 0 -> 2
    fireEvent.click(bullets[2]);
    expect(getImageSrc()).toBe('img3.png');
    expect(bullets[2]).toHaveAttribute('aria-current', 'true');
  });
});
