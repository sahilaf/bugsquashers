import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute"; // adjust the path if needed
import { useAuth } from "../../pages/auth/AuthContext";

// Mock the useAuth hook
vi.mock("../../pages/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute", () => {
  it("shows loading when auth or role is loading", () => {
    useAuth.mockReturnValue({ loading: true, roleLoading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["admin"]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("redirects to login if user is not authenticated", () => {
    useAuth.mockReturnValue({ user: null, userRole: "", loading: false, roleLoading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute allowedRoles={["admin"]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("redirects to 404 if user role is not allowed", () => {
    useAuth.mockReturnValue({ user: { uid: "123" }, userRole: "user", loading: false, roleLoading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <ProtectedRoute allowedRoles={["admin"]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("renders children if user is authenticated and role is allowed", () => {
    useAuth.mockReturnValue({ user: { uid: "123" }, userRole: "admin", loading: false, roleLoading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["admin"]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});
