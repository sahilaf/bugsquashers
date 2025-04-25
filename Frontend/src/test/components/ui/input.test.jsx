import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass(cn(
      'flex h-9 w-full rounded-full border-input bg-muted px-3 py-2 text-base shadow-sm',
      'transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none',
      'focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
    ));
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
  });

  it('forwards ref correctly', () => {
    let refValue;
    const refCallback = (el) => { refValue = el };
    render(<Input ref={refCallback} />);
    
    expect(refValue).toBeInstanceOf(HTMLInputElement);
    expect(refValue).toEqual(screen.getByRole('textbox'));
  });

  it('passes additional props', () => {
    render(<Input placeholder="Enter text" disabled />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toBeDisabled();
  });

  const validTypes = [
    'text', 'password', 'email', 'number', 'date',
    'time', 'search', 'tel', 'url', 'file'
  ];

  validTypes.forEach((type) => {
    it(`accepts valid type "${type}"`, () => {
      render(<Input type={type} />);
      expect(screen.getByRole(type === 'search' ? 'searchbox' : 'textbox'))
        .toHaveAttribute('type', type);
    });
  });
});