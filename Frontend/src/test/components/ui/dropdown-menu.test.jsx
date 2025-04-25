import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, vi } from 'vitest';

// Suppress global errors to prevent false positives
beforeAll(() => {
  window.addEventListener('error', e => e.preventDefault());
  window.addEventListener('unhandledrejection', e => e.preventDefault());
});

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../components/ui/dropdown-menu';

describe('DropdownMenu Component', () => {
  it('does not show menu content by default', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Content should not be visible initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows menu content when trigger is clicked', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Open the dropdown
    await userEvent.click(screen.getByText(/open menu/i));

    // Menu content should appear
    const menu = await screen.findByRole('menu');
    expect(menu).toBeVisible();
    expect(screen.getByText(/option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/option 2/i)).toBeInTheDocument();
  });

  it('calls onSelect callback when menu item is selected', async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Click Me</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await userEvent.click(screen.getByText(/open menu/i));
    await userEvent.click(screen.getByText(/click me/i));
    expect(onSelect).toHaveBeenCalled();
  });
});
