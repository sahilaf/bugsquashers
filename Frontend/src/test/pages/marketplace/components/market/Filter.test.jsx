import React from 'react';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { vi } from 'vitest';
import { Filters, AppliedFilters, getInitialFilters } from '../../../../../pages/marketplace/components/market/Filter';

// Mock UI library components
vi.mock('../../../../../components/ui/dialog', () => ({
  Dialog: ({ children }) => <div data-testid="Dialog">{children}</div>,
  DialogTrigger: ({ children }) => <div data-testid="DialogTrigger">{children}</div>,
  DialogContent: ({ children }) => <div data-testid="DialogContent">{children}</div>,
  DialogHeader: ({ children }) => <div data-testid="DialogHeader">{children}</div>,
  DialogTitle: ({ children }) => <div data-testid="DialogTitle">{children}</div>,
}));
vi.mock('../../../../../components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, id }) => (
    <input
      data-testid={id}
      type="checkbox"
      checked={checked}
      onChange={() => onCheckedChange(!checked)}
    />
  ),
}));
vi.mock('../../../../../components/ui/label', () => ({
  Label: ({ htmlFor, children }) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick, className }) => (
    <button data-testid="Button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));
vi.mock('../../../../../components/ui/select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <select
      data-testid="Select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => <div data-testid="SelectTrigger">{children}</div>,
  SelectValue: ({ placeholder }) => <div data-testid="SelectValue">{placeholder}</div>,
  SelectContent: ({ children }) => <div data-testid="SelectContent">{children}</div>,
  SelectItem: ({ value, children }) => <option value={value}>{children}</option>,
}));

describe('getInitialFilters', () => {
  it('returns the correct initial filter object', () => {
    const initial = getInitialFilters();
    expect(initial).toEqual({
      category: [],
      delivery: [],
      rating: '',
      organic: false,
      local: false,
    });
  });
});

describe('Filters component', () => {
  let filters;
  let setFilters;

  beforeEach(() => {
    filters = getInitialFilters();
    setFilters = vi.fn();
  });

  afterEach(() => cleanup());

  it('renders the Filters button without badge when no filters applied', () => {
    render(<Filters filters={filters} setFilters={setFilters} />);
    const trigger = screen.getByTestId('DialogTrigger');
    const button = within(trigger).getByText('Filters');
    expect(button).toBeInTheDocument();
    // No badge inside the trigger
    expect(within(button).queryByText(/\d+/)).toBeNull();
  });

  it('calls setFilters with initial filters when Clear all is clicked', () => {
    render(<Filters filters={filters} setFilters={setFilters} />);
    fireEvent.click(screen.getByText('Clear all'));
    expect(setFilters).toHaveBeenCalledWith(getInitialFilters());
  });

  it('calls setFilters when a category checkbox is toggled', () => {
    filters = { ...getInitialFilters(), category: ['Fruits & Vegetables'] };
    render(<Filters filters={filters} setFilters={setFilters} />);
    fireEvent.click(screen.getByTestId('cat-Fruits & Vegetables'));
    expect(setFilters).toHaveBeenCalled();
  });

  it('calls setFilters when a delivery checkbox is toggled', () => {
    filters = { ...getInitialFilters(), delivery: ['Same Day Delivery'] };
    render(<Filters filters={filters} setFilters={setFilters} />);
    fireEvent.click(screen.getByTestId('del-Same Day Delivery'));
    expect(setFilters).toHaveBeenCalled();
  });

  it('calls setFilters when rating is changed', () => {
    render(<Filters filters={filters} setFilters={setFilters} />);
    fireEvent.change(screen.getByTestId('Select'), { target: { value: '4' } });
    expect(setFilters).toHaveBeenCalled();
  });

  it('calls setFilters when organic and local checkboxes are toggled', () => {
    render(<Filters filters={filters} setFilters={setFilters} />);
    fireEvent.click(screen.getByTestId('organic'));
    expect(setFilters).toHaveBeenCalledWith({ ...filters, organic: true });
    setFilters.mockClear();
    fireEvent.click(screen.getByTestId('local'));
    expect(setFilters).toHaveBeenCalledWith({ ...filters, local: true });
  });
});

describe('AppliedFilters component', () => {
  let filters;
  let setFilters;

  beforeEach(() => {
    setFilters = vi.fn();
  });

  afterEach(() => cleanup());

  it('renders nothing when no filters applied', () => {
    filters = getInitialFilters();
    render(<AppliedFilters filters={filters} setFilters={setFilters} />);
    expect(screen.queryByTestId('AppliedFiltersContainer')).toBeNull();
  });

  it('renders applied filters and handles removal clicks', () => {
    filters = {
      category: ['Bakery'],
      delivery: ['Pickup Available'],
      rating: '3',
      organic: true,
      local: true,
    };
    render(<AppliedFilters filters={filters} setFilters={setFilters} />);
    expect(screen.getByText('Bakery')).toBeInTheDocument();
    expect(screen.getByText('Pickup Available')).toBeInTheDocument();
    expect(screen.getByText('3+ Stars')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
    expect(screen.getByText('Local')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('Button')[0]);
    expect(setFilters).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Clear all'));
    expect(setFilters).toHaveBeenCalledWith(getInitialFilters());
  });
});
