import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

// ─── Stub Radix Slider Primitives ───────────────────────────────────────────────
vi.mock('@radix-ui/react-slider', () => {
  const React = require('react');
  return {
    Root: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-slider-root="" ref={ref} {...props}>
        {children}
      </div>
    )),
    Track: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-slider-track="" ref={ref} {...props}>
        {children}
      </div>
    )),
    Range: React.forwardRef((props, ref) => (
      <div data-radix-slider-range="" ref={ref} {...props} />
    )),
    Thumb: React.forwardRef((props, ref) => (
      <div data-radix-slider-thumb="" ref={ref} {...props} />
    )),
  };
});

// ─── Now import your component ─────────────────────────────────────────────────
import { Slider } from '../../../components/ui/slider';
import { cn } from '../../../lib/utils';

describe('Slider component', () => {
  it('renders the slider root, track, range, and thumb with default classes', () => {
    const { container } = render(<Slider data-testid="slider" />);
    // Root
    const root = screen.getByTestId('slider');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('relative', 'flex', 'w-full', 'touch-none', 'select-none', 'items-center');
    // Track
    const track = container.querySelector('[data-radix-slider-track]');
    expect(track).toBeInTheDocument();
    expect(track).toHaveClass('relative', 'h-1.5', 'w-full', 'grow', 'overflow-hidden', 'rounded-full', 'bg-primary/20');
    // Range
    const range = container.querySelector('[data-radix-slider-range]');
    expect(range).toBeInTheDocument();
    expect(range).toHaveClass('absolute', 'h-full', 'bg-primary');
    // Thumb
    const thumb = container.querySelector('[data-radix-slider-thumb]');
    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveClass(
      'block','h-4','w-4','rounded-full','border','border-primary/50',
      'bg-background','shadow','transition-colors','focus-visible:outline-none',
      'focus-visible:ring-1','focus-visible:ring-ring','disabled:pointer-events-none','disabled:opacity-50'
    );
  });

  it('merges custom className onto the root', () => {
    const { container } = render(<Slider className="my-slider" data-testid="root" />);
    const root = screen.getByTestId('root');
    expect(root).toHaveClass('my-slider');
  });

  it('forwards props to the root element', () => {
    render(<Slider data-custom="foo" data-testid="custom-prop" />);
    const root = screen.getByTestId('custom-prop');
    expect(root).toHaveAttribute('data-custom', 'foo');
  });

  it('forwards refs to the root element', () => {
    const ref = createRef();
    render(<Slider ref={ref} data-testid="with-ref" />);
    const root = screen.getByTestId('with-ref');
    expect(ref.current).toBe(root);
  });

  it('uses utility `cn` to concatenate classes', () => {
    // verify that cn merges strings as expected
    expect(cn('a', undefined, 'b')).toBe('a b');
  });
});
