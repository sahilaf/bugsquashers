import React from 'react';
import { render, screen, cleanup, within } from '@testing-library/react';
import { vi } from 'vitest';
import LoadingCart from '../../../../pages/cart/components/LoadingCart';

// Mock UI components
vi.mock('../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>
}));
vi.mock('../../../../components/ui/skeleton', () => ({
  Skeleton: (props) => <div data-testid="Skeleton" {...props} />
}));

// Mock uuid to produce predictable keys
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'unique-id')
}));

describe('LoadingCart component', () => {
  afterEach(() => cleanup());

  it('renders the shopping cart header', () => {
    render(<LoadingCart />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Shopping Cart');
  });

  it('renders two cards with loading skeletons', () => {
    render(<LoadingCart />);

    // Two Card wrappers
    const cards = screen.getAllByTestId('Card');
    expect(cards).toHaveLength(2);

    // Two CardContent sections
    const contents = screen.getAllByTestId('CardContent');
    expect(contents).toHaveLength(2);

    // First section: 3 rows * 5 skeletons each = 15
    const firstSkel = within(contents[0]).getAllByTestId('Skeleton');
    expect(firstSkel).toHaveLength(15);

    // Second section: 4 skeleton lines
    const secondSkel = within(contents[1]).getAllByTestId('Skeleton');
    expect(secondSkel).toHaveLength(4);

    // Total skeleton count matches sum
    const allSkel = screen.getAllByTestId('Skeleton');
    expect(allSkel.length).toBe(firstSkel.length + secondSkel.length);
  });
});
