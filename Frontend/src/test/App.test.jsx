import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock react-router-dom's BrowserRouter to avoid nested Router errors
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <>{children}</>,
  };
});

import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Stub Nav component
vi.mock('../components/Nav/Nav', () => ({ default: () => <div data-testid="nav" /> }));
// Stub authentication context
const mockUseAuth = vi.fn();
vi.mock('../pages/auth/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => mockUseAuth(),
}));
// Stub cart provider
vi.mock('../pages/cart/context/CartContex', () => ({
  CartProvider: ({ children }) => <>{children}</>,
}));
// Stub ProtectedRoute to render children directly
vi.mock('../components/ProtectedRoute', () => ({ default: ({ children }) => <>{children}</> }));

// Stub page components
vi.mock('../pages/home/Home', () => ({ default: () => <div>HomePage</div> }));
vi.mock('../pages/auth/Login', () => ({ LoginForm: () => <div>LoginForm</div> }));
vi.mock('../pages/auth/Signup', () => ({ default: () => <div>SignupPage</div> }));
vi.mock('../pages/auth/ForgetPassword', () => ({ default: () => <div>ForgotPasswordPage</div> }));
vi.mock('../components/NotFound', () => ({ default: () => <div>NotFoundPage</div> }));

vi.mock('../pages/dashboard/Customer', () => ({ default: () => <div>CustomerPage</div> }));
vi.mock('../pages/dashboard/RetailerDash', () => ({ default: () => <div>RetailerDashPage</div> }));
vi.mock('../pages/dashboard/DeliveryDash', () => ({ default: () => <div>DeliveryDashPage</div> }));
vi.mock('../pages/dashboard/FarmerDash', () => ({ default: () => <div>FarmerDashPage</div> }));

vi.mock('../pages/marketplace/ProductDetail', () => ({ ProductDetail: () => <div>ProductDetailPage</div> }));
vi.mock('../pages/marketplace/Marketplace', () => ({ default: () => <div>MarketplacePage</div> }));
vi.mock('../pages/marketplace/FarmerMarket', () => ({ default: () => <div>FarmerMarketPage</div> }));

vi.mock('../pages/cart/Cart', () => ({ default: () => <div>CartPage</div> }));
vi.mock('../pages/cart/OrderComfirmation', () => ({ default: () => <div>OrderConfirmationPage</div> }));
vi.mock('../pages/cart/PaymentFailed', () => ({ default: () => <div>PaymentFailedPage</div> }));
vi.mock('../pages/cart/Checkout', () => ({ default: () => <div>CheckoutPage</div> }));

vi.mock('../pages/recommendation/Recommendation', () => ({ default: () => <div>RecommendationPage</div> }));

// Tests
describe('App Routing and Layout', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders HomePage with Nav on root path "/"', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('HomePage')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders LoginForm without Nav on "/login"', () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('LoginForm')).toBeInTheDocument();
    expect(screen.queryByTestId('nav')).toBeNull();
  });

  test('renders SignupPage without Nav on "/signup"', () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('SignupPage')).toBeInTheDocument();
    expect(screen.queryByTestId('nav')).toBeNull();
  });

  test('renders ForgotPasswordPage with Nav on "/forgetpassword"', () => {
    render(
      <MemoryRouter initialEntries={["/forgetpassword"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('ForgotPasswordPage')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders NotFoundPage without Nav on "/404"', () => {
    render(
      <MemoryRouter initialEntries={["/404"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument();
    expect(screen.queryByTestId('nav')).toBeNull();
  });

  test('renders NotFoundPage with Nav on unknown path', () => {
    render(
      <MemoryRouter initialEntries={["/random"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders CustomerPage for "/customerdash" when userRole is User', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/customerdash"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('CustomerPage')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('redirects from "/dashboard" to CustomerPage for User role', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('CustomerPage')).toBeInTheDocument();
  });

  test('renders RetailerDashPage for "/retailer" when userRole is Shopkeeper', () => {
    mockUseAuth.mockReturnValue({ userRole: 'Shopkeeper' });
    render(
      <MemoryRouter initialEntries={["/retailer"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('RetailerDashPage')).toBeInTheDocument();
  });

  test('redirects from "/marketplace" to FarmerMarketPage for Farmer role', () => {
    mockUseAuth.mockReturnValue({ userRole: 'Farmer' });
    render(
      <MemoryRouter initialEntries={["/marketplace"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('FarmerMarketPage')).toBeInTheDocument();
  });

  test('renders MarketplacePage on "/market"', () => {
    render(
      <MemoryRouter initialEntries={["/market"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('MarketplacePage')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  test('renders ProductDetailPage on "/product/123"', () => {
    render(
      <MemoryRouter initialEntries={["/product/123"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('ProductDetailPage')).toBeInTheDocument();
  });

  test('renders CartPage on "/cart"', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('CartPage')).toBeInTheDocument();
  });

  test('renders RecommendationPage on "/recommendation"', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/recommendation"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('RecommendationPage')).toBeInTheDocument();
  });

  test('renders CheckoutPage on "/checkout"', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('CheckoutPage')).toBeInTheDocument();
  });

  test('renders OrderConfirmationPage on "/orderconfirmation"', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/orderconfirmation"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('OrderConfirmationPage')).toBeInTheDocument();
  });

  test('renders PaymentFailedPage on "/payment-failed"', () => {
    mockUseAuth.mockReturnValue({ userRole: 'User' });
    render(
      <MemoryRouter initialEntries={["/payment-failed"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('PaymentFailedPage')).toBeInTheDocument();
  });
});
