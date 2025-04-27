import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Stub Radix Toast Primitives ────────────────────────────────────────────────
vi.mock('@radix-ui/react-toast', () => {
  const React = require('react');
  return {
    Provider: ({ children }) => <>{children}</>,
    Root: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-root="" ref={ref} {...props}>{children}</div>
    )),
    Viewport: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-viewport="" ref={ref} {...props}>{children}</div>
    )),
    Title: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-title="" ref={ref} {...props}>{children}</div>
    )),
    Description: React.forwardRef(({ children, ...props }, ref) => (
      <div data-radix-description="" ref={ref} {...props}>{children}</div>
    )),
    Action: React.forwardRef(({ children, ...props }, ref) => (
      <button data-radix-action="" ref={ref} {...props}>{children}</button>
    )),
    Close: React.forwardRef(({ children, ...props }, ref) => (
      <button data-radix-close="" ref={ref} {...props}>{children}</button>
    )),
  };
});

// ─── Now import your components ─────────────────────────────────────────────────
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from '../../../components/ui/toast';

describe('Toast UI components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('ToastProvider renders its children', () => {
    render(
      <ToastProvider>
        <div>InsideProvider</div>
      </ToastProvider>
    );
    expect(screen.getByText('InsideProvider')).toBeInTheDocument();
  });

  it('ToastViewport applies the fixed class and merges custom className', () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport className="custom-viewport" />
      </ToastProvider>
    );
    const vp = container.querySelector('[data-radix-viewport]');
    expect(vp).toBeInTheDocument();
    expect(vp).toHaveClass('fixed');
    expect(vp).toHaveClass('custom-viewport');
  });

  it('Toast renders default variant and merges className', () => {
    const { container } = render(
      <ToastProvider>
        <Toast className="my-toast">Hello</Toast>
      </ToastProvider>
    );
    const root = container.querySelector('[data-radix-root]');
    // default variant → border & bg-background
    expect(root).toHaveClass('bg-background');
    expect(root).toHaveClass('my-toast');
    expect(root).toHaveTextContent('Hello');
  });

  it('Toast renders destructive variant', () => {
    const { container } = render(
      <ToastProvider>
        <Toast variant="destructive">Warning</Toast>
      </ToastProvider>
    );
    const root = container.querySelector('[data-radix-root]');
    expect(root).toHaveClass('bg-destructive');
    expect(root).toHaveTextContent('Warning');
  });

  it('ToastTitle renders with the correct classes', () => {
    render(
      <ToastProvider>
        <ToastTitle className="title-class">My Title</ToastTitle>
      </ToastProvider>
    );
    const title = screen.getByText('My Title');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('title-class');
    expect(title).toHaveAttribute('data-radix-title', '');
  });

  it('ToastDescription renders with the correct classes', () => {
    render(
      <ToastProvider>
        <ToastDescription className="desc-class">My Desc</ToastDescription>
      </ToastProvider>
    );
    const desc = screen.getByText('My Desc');
    expect(desc).toHaveClass('opacity-90');
    expect(desc).toHaveClass('desc-class');
    expect(desc).toHaveAttribute('data-radix-description', '');
  });

  it('ToastAction renders a button and responds to clicks', () => {
    const onClick = vi.fn();
    render(
      <ToastProvider>
        <Toast>
          <ToastAction className="action-class" onClick={onClick}>
            Do It
          </ToastAction>
        </Toast>
      </ToastProvider>
    );
    const btn = screen.getByRole('button', { name: 'Do It', hidden: true });
    expect(btn).toHaveClass('action-class');
    expect(btn).toHaveAttribute('data-radix-action', '');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('ToastClose renders a close button with icon and calls onClick', () => {
    const onClick = vi.fn();
    render(
      <ToastProvider>
        <ToastClose className="close-class" onClick={onClick} />
      </ToastProvider>
    );
    const btn = screen.getByRole('button', { hidden: true });
    expect(btn).toHaveClass('close-class');
    expect(btn).toHaveAttribute('toast-close', '');
    expect(btn).toHaveAttribute('data-radix-close', '');
    // there should be an <svg> icon inside
    expect(btn.querySelector('svg')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});
