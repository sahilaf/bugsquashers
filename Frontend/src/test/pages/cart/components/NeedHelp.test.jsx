import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import NeedHelp from '../../../../pages/cart/components/NeedHelp';

// Mock UI components
vi.mock('../../../../components/ui/card', () => ({
  Card: ({ children }) => <div data-testid="Card">{children}</div>,
  CardContent: ({ children }) => <div data-testid="CardContent">{children}</div>
}));
vi.mock('../../../../components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button data-testid="Button" onClick={onClick}>
      {children}
    </button>
  )
}));

describe('NeedHelp component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders help section with heading, text, and button', () => {
    render(<NeedHelp />);

    // Card wrapper and content
    expect(screen.getByTestId('Card')).toBeInTheDocument();
    expect(screen.getByTestId('CardContent')).toBeInTheDocument();

    // Heading and paragraph
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Need Help?');
    expect(screen.getByText(/Our customer service team is available 24\/7/)).toBeInTheDocument();

    // Contact Support button
    const button = screen.getByTestId('Button');
    expect(button).toHaveTextContent('Contact Support');
  });

  it('allows clicking the Contact Support button without errors', () => {
    const { getByTestId } = render(<NeedHelp />);
    const button = getByTestId('Button');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
