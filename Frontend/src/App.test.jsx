import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import PropTypes from "prop-types";

// ---------------------------------------------------
// Global variable for the current user role in tests.
// ProtectedRoute and Authcontext mocks will use this value.
let mockedUserRole = "User";

// ---------------------------------------------------
// MOCK AUTH CONTEXT
// Instead of importing the real auth module, we create a mock
// that returns the current value of `mockedUserRole`.
vi.mock("./pages/auth/Authcontext", () => {
  const MockAuthProvider = ({ children }) => <>{children}</>;
  MockAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  return {
    AuthProvider: MockAuthProvider,
    useAuth: () => ({ userRole: mockedUserRole }),
  };
});
// ---------------------------------------------------
// MOCK COMPONENTS
// Replace implementations with simple identifiable elements.
vi.mock("./components/nav/Nav", () => ({
  default: () => <div data-testid="nav">Nav</div>,
}));

vi.mock("./pages/home/Home", () => ({
  default: () => <div data-testid="home">Home Page</div>,
}));

vi.mock("./pages/auth/Login", () => ({
  LoginForm: () => <div data-testid="login">Login Form</div>,
}));

vi.mock("./pages/auth/Signup", () => ({
  default: () => <div data-testid="signup">Signup Page</div>,
}));

vi.mock("./pages/marketplace/ProductDetail", () => ({
  ProductDetail: () => <div data-testid="product-detail">Product Detail</div>,
}));

vi.mock("./pages/cart/Cart", () => ({
  default: () => <div data-testid="cart">Cart</div>,
}));

vi.mock("./pages/marketplace/Marketplace", () => ({
  default: () => <div data-testid="marketplace">Marketplace</div>,
}));

vi.mock("./pages/admin/Admin", () => ({
  default: () => <div data-testid="admin">Admin Dashboard</div>,
}));

vi.mock("./pages/dashboard/Customer", () => ({
  default: () => <div data-testid="customer">Customer Dashboard</div>,
}));

vi.mock("./pages/dashboard/RetailerDash", () => ({
  default: () => <div data-testid="retailer">Retailer Dashboard</div>,
}));

vi.mock("./pages/dashboard/DeliveryDash", () => ({
  default: () => <div data-testid="delivery">Delivery Dashboard</div>,
}));

vi.mock("./pages/dashboard/FarmerDash", () => ({
  default: () => <div data-testid="farmer">Farmer Dashboard</div>,
}));

vi.mock("./components/NotFound", () => ({
  default: () => <div data-testid="not-found">404 Not Found</div>,
}));

// ---------------------------------------------------
// MOCK PROTECTED ROUTE
// Our mock ProtectedRoute uses the already mocked auth context via the global variable.
vi.mock("./components/ProtectedRoute", () => ({
  default: ({ allowedRoles, children }) => {
    // Use the mockedUserRole variable directly.
    return allowedRoles.includes(mockedUserRole)
      ? children
      : <div>Access Denied</div>;
  },
}));

// ---------------------------------------------------
// HELPER FUNCTION
// This helper sets the desired role and route in the browser history before importing App.
const renderWithRole = async ({ route = "/", userRole = "User" } = {}) => {
  // Set the global mocked role.
  mockedUserRole = userRole;
  // Set the current route.
  window.history.pushState({}, "Test", route);
  // Reset modules to ensure mocks are applied fresh.
  vi.resetModules();
  const { default: App } = await import("./App");
  return render(<App />);
};

// ---------------------------------------------------
// MAIN TEST SUITE
describe("App Routing", () => {
  afterEach(() => {
    cleanup();
    // Reset modules to avoid cross-test contamination.
    vi.resetModules();
    // Reset the role to default "User" after each test.
    mockedUserRole = "User";
  });

  it('renders Home page at the "/" route and shows Nav', async () => {
    window.history.pushState({}, "Test", "/");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("home")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
  });

  it('renders Login page at "/login" and hides Nav', async () => {
    window.history.pushState({}, "Test", "/login");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("login")).toBeInTheDocument();
    expect(screen.queryByTestId("nav")).toBeNull();
  });

  it('renders Signup page at "/signup" and hides Nav', async () => {
    window.history.pushState({}, "Test", "/signup");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("signup")).toBeInTheDocument();
    expect(screen.queryByTestId("nav")).toBeNull();
  });

  it('renders Product Detail page at "/product/:productId"', async () => {
    window.history.pushState({}, "Test", "/product/123");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("product-detail")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
  });
  

  it('renders Marketplace page at "/market"', async () => {
    window.history.pushState({}, "Test", "/market");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("marketplace")).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
  });

  it('renders 404 Not Found for an unknown route', async () => {
    window.history.pushState({}, "Test", "/unknown/route");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  it('renders Customer Dashboard at "/customerdash" for role "User"', async () => {
    window.history.pushState({}, "Test", "/customerdash");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByTestId("customer")).toBeInTheDocument();
  });

  it('renders Admin Dashboard at "/admin" for role "Admin"', async () => {
    await renderWithRole({ route: "/admin", userRole: "Admin" });
    expect(screen.getByTestId("admin")).toBeInTheDocument();
  });

  it('navigates to the proper dashboard via "/dashboard" based on userRole', async () => {
    // For role "Shopkeeper", the DashboardRedirect should navigate to the retailer dashboard.
    await renderWithRole({ route: "/dashboard", userRole: "Shopkeeper" });
    expect(screen.getByTestId("retailer")).toBeInTheDocument();
  });

  it('renders Access Denied if role is not allowed on a protected route', async () => {
    window.history.pushState({}, "Test", "/admin");
    const { default: App } = await import("./App");
    render(<App />);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });
});
