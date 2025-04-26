import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi, beforeAll } from 'vitest';
import animationData from '../../assets/404animation.json';
import NotFound from '../../components/NotFound';

// Mock Lottie to capture props and render a placeholder
const lottieMock = vi.fn();
vi.mock('react-lottie-player', () => ({
  __esModule: true,
  default: (props) => {
    lottieMock(props);
    return <div data-testid="lottie" />;
  }
}));

describe('NotFound Component', () => {
  beforeAll(() => {
    lottieMock.mockClear();
  });

  test('renders Lottie with correct props', () => {
    render(<NotFound />);
    const lottieEl = screen.getByTestId('lottie');
    expect(lottieEl).toBeInTheDocument();
    expect(lottieMock).toHaveBeenCalledWith({
      loop: true,
      animationData,
      play: true,
      className: 'w-full max-w-md'
    });
  });

  test('displays 404 heading and descriptive text', () => {
    render(<NotFound />);
    const heading = screen.getByRole('heading', { level: 1, name: /404 - Page Not Found/i });
    expect(heading).toHaveTextContent('404 - Page Not Found');
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  test('applies correct layout and background classes', () => {
    render(<NotFound />);
    const heading = screen.getByRole('heading', { level: 1 });
    const innerDiv = heading.parentElement;
    expect(innerDiv).toHaveClass('text-center');
    const outerDiv = innerDiv.parentElement;
    expect(outerDiv).toHaveClass(
      'flex', 'justify-center', 'items-center', 'min-h-screen',
      'bg-gray-100', 'dark:bg-zinc-800'
    );
  });
});
