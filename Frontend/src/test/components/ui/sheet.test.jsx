import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactDOM from 'react-dom';
import { vi, beforeAll, afterEach } from 'vitest';
import {
  Sheet,
  SheetTrigger,
  SheetOverlay,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from '../../../components/ui/sheet';

// Stub createPortal and scrollIntoView for Radix dialogs
beforeAll(() => {
  ReactDOM.createPortal = node => node;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  // Cleanup DOM between render calls
  document.body.innerHTML = '';
});

describe('Sheet Component Suite', () => {
  it('renders overlay with custom className when open', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetOverlay data-testid="ov" className="custom-ov" />
        </SheetContent>
      </Sheet>
    );
    const ov = screen.getByTestId('ov');
    expect(ov).toHaveClass('bg-black/80');
    expect(ov).toHaveClass('custom-ov');
  });

  it('renders Title and Description with custom className within content', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle data-testid="st" className="ctitle">Hello</SheetTitle>
          <SheetDescription data-testid="sd" className="cdesc">Desc</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const st = screen.getByTestId('st');
    const sd = screen.getByTestId('sd');
    expect(st).toHaveTextContent('Hello');
    expect(st).toHaveClass('ctitle');
    expect(sd).toHaveTextContent('Desc');
    expect(sd).toHaveClass('cdesc');
  });

  it('renders trigger and does not show content initially', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
        <SheetContent>
          <div>Body</div>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
  });

  it('opens sheet on trigger click and displays overlay, close button and content', async () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open</SheetTrigger>
        <SheetContent data-testid="content">Content</SheetContent>
      </Sheet>
    );
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('content')).toBeVisible();
    // Overlay should be in document
    const overlay = document.querySelector('[class*="bg-black/80"]');
    expect(overlay).toBeInTheDocument();
    // Close button exists
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it('closes sheet when close button is clicked', async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent data-testid="ct">X</SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('Open'));
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('ct')).not.toBeInTheDocument();
  });

  it('renders header and footer and responds to side variants', async () => {
    render(
      <Sheet>
        <SheetTrigger>O</SheetTrigger>
        <SheetContent side="top" data-testid="c1">
          <SheetHeader data-testid="hdr">Hdr</SheetHeader>
          <SheetFooter data-testid="ftr">Ftr</SheetFooter>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('O'));
    expect(screen.getByTestId('hdr')).toHaveTextContent('Hdr');
    expect(screen.getByTestId('ftr')).toHaveTextContent('Ftr');
    // side top
    expect(screen.getByTestId('c1')).toHaveClass('top-0');

    // Test default side (right)
    render(
      <Sheet>
        <SheetTrigger>R</SheetTrigger>
        <SheetContent data-testid="c2">X</SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('R'));
    expect(screen.getByTestId('c2')).toHaveClass('right-0');

    // Test bottom side
    render(
      <Sheet>
        <SheetTrigger>B</SheetTrigger>
        <SheetContent side="bottom" data-testid="c3">Y</SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByTestId('c3')).toHaveClass('bottom-0');

    // Test left side
    render(
      <Sheet>
        <SheetTrigger>L</SheetTrigger>
        <SheetContent side="left" data-testid="c4">Z</SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('L'));
    expect(screen.getByTestId('c4')).toHaveClass('left-0');
  });

  it('renders hidden title and description when not provided', async () => {
    render(
      <Sheet>
        <SheetTrigger>G</SheetTrigger>
        <SheetContent>
          <div />
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByText('G'));
    // Hidden title and description via VisuallyHidden should exist
    expect(screen.getByText('Sheet')).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});
