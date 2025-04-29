// src/test/components/Nav/ThemeToggle.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../../components/Nav/ThemeToggle';

// Mock lucide-react icons to render identifiable placeholders
vi.mock('lucide-react', () => ({
  __esModule: true,
  Moon: () => <span data-testid="icon-moon" />,
  Sun: () => <span data-testid="icon-sun" />,
}));

// Mock your UI Button so we can render its children directly
vi.mock('../../../components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, onClick, ...props }) => (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ThemeToggle', () => {
  const originalClassList = document.documentElement.classList;
  let setItemSpy;

  beforeEach(() => {
    // Clear localStorage and reset <html> classes
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    // Spy on localStorage.setItem
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to light theme (Moon icon) and no text when showText is false', () => {
    render(<ThemeToggle />);

    // Should show the Moon icon
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    // No Sun icon
    expect(screen.queryByTestId('icon-sun')).toBeNull();
    // No text rendered
    expect(screen.queryByText(/Dark|Light/)).toBeNull();
    // localStorage.setItem called with initial theme
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'light');
    // document should not have 'dark' class
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles to dark theme (Sun icon) and adds .dark class & persists', () => {
    render(<ThemeToggle />);

    // Click to toggle
    fireEvent.click(screen.getByRole('button'));

    // Now should show Sun icon
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-moon')).toBeNull();
    // .dark class applied
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // localStorage.setItem updated to dark
    expect(setItemSpy).toHaveBeenLastCalledWith('theme', 'dark');
  });

  it('respects showText prop: displays "Dark" or "Light" next to icon', () => {
    render(<ThemeToggle showText />);

    // Initially light theme → shows "Dark" as label (meaning click will go dark)
    expect(screen.getByText('Dark')).toBeInTheDocument();
    // Toggle to dark
    fireEvent.click(screen.getByRole('button'));
    // Now label flips to "Light"
    expect(screen.getByText('Light')).toBeInTheDocument();
  });

  it('reads initial theme from localStorage if present', () => {
    // Pre-populate localStorage with dark
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);

    // Should pick up dark immediately: Sun icon + dark class
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // And persist again via useEffect
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
  });

  it('toggles back to light theme on second click', () => {
    render(<ThemeToggle />);

    // 1st click → dark
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // 2nd click → back to light
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(setItemSpy).toHaveBeenLastCalledWith('theme', 'light');
  });
});
