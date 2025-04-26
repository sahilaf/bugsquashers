import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';

describe('Input Component', () => {
  afterEach(cleanup);

  it('renders with default props', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');

    expect(input).toBeInTheDocument();
    // DOM property 'type' falls back to 'text'
    expect(input.type).toBe('text');
    // Check default classes contain key tokens
    expect(input.className).toContain('flex');
    expect(input.className).toContain('rounded-full');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('custom-class');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input.type).toBe('email');

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input.type).toBe('password');
  });

  it('forwards ref correctly', () => {
    let refValue = null;
    const refCallback = (el) => { refValue = el; };
    render(<Input ref={refCallback} data-testid="input" />);

    expect(refValue).toBeInstanceOf(HTMLInputElement);
    expect(refValue).toBe(screen.getByTestId('input'));
  });

  it('passes additional props', () => {
    render(<Input placeholder="Enter text" disabled data-testid="input" />);
    const input = screen.getByTestId('input');

    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toBeDisabled();
  });

  const validTypes = [
    'text', 'password', 'email', 'number', 'date',
    'time', 'search', 'tel', 'url', 'file'
  ];

  validTypes.forEach(type => {
    it(`accepts valid type "${type}"`, () => {
      render(<Input type={type} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.type).toBe(type);
    });
  });
});
