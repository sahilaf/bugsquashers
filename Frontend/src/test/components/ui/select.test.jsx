import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '../../../components/ui/select';

// Prevent scrollIntoView errors from Radix during tests
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Select Component', () => {
  test('renders placeholder in trigger', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveTextContent('Choose an option');
  });

  test('opens dropdown and shows options on trigger click', async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    );
    fireEvent.click(screen.getByTestId('trigger'));
    expect(await screen.findByText('Option A')).toBeInTheDocument();
    expect(await screen.findByText('Option B')).toBeInTheDocument();
  });

  test('selects an item and updates value', async () => {
    render(
      <Select>
        <SelectTrigger data-testid="t">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">First</SelectItem>
          <SelectItem value="2">Second</SelectItem>
        </SelectContent>
      </Select>
    );
    fireEvent.click(screen.getByTestId('t'));
    const firstItem = await screen.findByText('First');
    fireEvent.click(firstItem);
    expect(screen.getByTestId('t')).toHaveTextContent('First');
  });

  test('calls onValueChange callback when an item is selected', async () => {
    const handleChange = vi.fn();
    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">X</SelectItem>
          <SelectItem value="y">Y</SelectItem>
        </SelectContent>
      </Select>
    );
    fireEvent.click(screen.getByTestId('trigger'));
    const yItem = await screen.findByText('Y');
    fireEvent.click(yItem);
    expect(handleChange).toHaveBeenCalledWith('y');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
