import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '../../../components/ui/separator';

describe('Separator Component', () => {
  test('renders separator element', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toBeInTheDocument();
  });

  test('default orientation is horizontal with correct classes', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('h-[1px]');
    expect(sep).toHaveClass('w-full');
  });

  test('vertical orientation applies vertical classes', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('w-[1px]');
    expect(sep).toHaveClass('h-full');
  });

  test('accepts custom className prop', () => {
    render(<Separator className="custom-class" data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('custom-class');
  });

  test('decorative prop does not set aria-hidden attribute', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).not.toHaveAttribute('aria-hidden');

    render(<Separator decorative={false} data-testid="sep2" />);
    const sep2 = screen.getByTestId('sep2');
    expect(sep2).not.toHaveAttribute('aria-hidden');
  });
});
