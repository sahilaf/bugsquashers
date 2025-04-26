import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, vi } from 'vitest';

// Polyfills and global error suppression for Vaul Drawer behavior in JSDOM
beforeAll(() => {
  // Suppress unhandled errors to prevent false positives
  window.addEventListener('error', event => {
    event.preventDefault();
  });
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault();
  });

  // matchMedia
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // pointer capture methods
  if (!window.HTMLElement.prototype.setPointerCapture) {
    window.HTMLElement.prototype.setPointerCapture = () => {};
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = () => {};
  }

  // computedStyle.transform always defined
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt, pseudo) => {
    const style = originalGetComputedStyle(elt, pseudo);
    if (style.transform === undefined) {
      Object.defineProperty(style, 'transform', {
        value: '',
        writable: true,
        configurable: true,
      });
    }
    return style;
  };
});

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '../../../components/ui/drawer';

describe('Drawer Component', () => {
  it('renders trigger and hides content by default', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.getByText(/open drawer/i)).toBeInTheDocument();
    expect(screen.queryByText(/test title/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/test description/i)).not.toBeInTheDocument();
  });

  it('opens the drawer when trigger is clicked', async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    await userEvent.click(screen.getByText(/open drawer/i));

    expect(await screen.findByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
  });

  it('closes the drawer when close button is clicked', async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    await userEvent.click(screen.getByText(/open drawer/i));
    expect(await screen.findByText(/test title/i)).toBeInTheDocument();

    // Close the drawer
    await userEvent.click(screen.getByText(/close/i));
    await waitFor(() => {
      // The drawer container should have data-state="closed"
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('data-state', 'closed');
    });
  });
});
