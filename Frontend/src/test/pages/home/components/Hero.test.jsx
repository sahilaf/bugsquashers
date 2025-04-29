import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Hero from '../../../../pages/home/components/Hero';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
    p: ({ children }) => <p>{children}</p>,
  },
}));

vi.mock('react-lottie-player', () => ({
  default: () => <div data-testid="lottie-player">Lottie Animation</div>,
}));

vi.mock('../../../../pages/home/components/SplitText', () => ({
  default: () => <div data-testid="split-text">Split Text Component</div>,
}));

vi.mock('lucide-react', () => ({
  ArrowRight: () => <svg data-testid="arrow-right-icon" />,
}));

vi.mock('../../../../../components/ui/button', () => ({
  Button: ({ children, onClick, className }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock the animation data - Note: You also need to correct the import path in Hero.jsx
vi.mock('../../../../assets/Heroanimation.json', () => ({ // Ensure this path matches the actual file name casing
  default: { key: 'mock-animation-data' },
}));


let rafCallbacks = [];
let currentTime = 0;

// Use vi.spyOn to mock performance.now and requestAnimationFrame
const performanceNowSpy = vi.spyOn(global.performance, 'now');
const requestAnimationFrameSpy = vi.spyOn(global, 'requestAnimationFrame');
const fetchMock = vi.fn();


describe('Hero', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];
    currentTime = 0;

    // Mock implementations using the spies
    requestAnimationFrameSpy.mockImplementation((callback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length - 1;
    });
    performanceNowSpy.mockImplementation(() => currentTime);
    global.fetch = fetchMock; // Still need to assign the fetch mock


    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

   afterEach(() => {
      // Restore the original implementations after each test
      performanceNowSpy.mockRestore();
      requestAnimationFrameSpy.mockRestore();
   });


  const triggerNextAnimationFrame = (timeAdvance = 100) => {
    currentTime += timeAdvance;
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach(callback => callback(currentTime));
  };


  test('should render without crashing after mounting', async () => {
    render(<Hero />);
    await waitFor(() => {
      expect(screen.getByText('Welcome to FairBasket')).toBeInTheDocument();
    });
  });

  test('should display initial static text', async () => {
    render(<Hero />);
    await waitFor(() => {
      expect(screen.getByText('Welcome to FairBasket')).toBeInTheDocument();
      expect(screen.getByText(/Use AI-driven budget recommendation products/)).toBeInTheDocument();
    });
  });

  test('should fetch user count and animate', async () => {
    const mockUserCount = 123456;
    fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => Array.from({ length: mockUserCount }, (_, i) => ({ id: i + 1 })),
     });

    render(<Hero />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/users');
    });

    await waitFor(() => {
        triggerNextAnimationFrame();
        return screen.getByText(`${mockUserCount.toLocaleString()}+`);
    }, { timeout: 3000 });
  });


  test('should handle fetch error and use fallback count', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Hero />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/users');
    });

    await waitFor(() => {
      triggerNextAnimationFrame();
      return screen.getByText('500,000+');
    }, { timeout: 3000 });
  });

  test('should navigate to marketplace on "Get Started" button click', async () => {
    render(<Hero />);

    await waitFor(() => {
      const getStartedButton = screen.getByText('Get Started');
      expect(getStartedButton).toBeInTheDocument();
      fireEvent.click(getStartedButton);
      expect(window.location.href).toBe('/marketplace');
    });
  });

  test('should render "Learn More" button', async () => {
    render(<Hero />);
    await waitFor(() => {
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });
  });

  test('should display static stats', async () => {
    render(<Hero />);
    await waitFor(() => {
      expect(screen.getByText('Registered Shops')).toBeInTheDocument();
      expect(screen.getByText('Delivery Agents')).toBeInTheDocument();
      expect(screen.getByText('50,000+')).toBeInTheDocument();
      expect(screen.getByText('20,000+')).toBeInTheDocument();
    });
  });
});