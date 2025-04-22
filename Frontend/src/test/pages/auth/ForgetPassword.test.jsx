import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ForgetPassword from '../../../pages/auth/ForgetPassword';
import * as firebaseAuth from 'firebase/auth';
import * as reactRouterDom from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  sendPasswordResetEmail: vi.fn(),
  getAuth: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ForgetPassword Component', () => {
  const mockNavigate = vi.fn();
  const mockAuth = {};

  beforeEach(() => {
    vi.clearAllMocks();
    firebaseAuth.getAuth.mockReturnValue(mockAuth);
    reactRouterDom.useNavigate.mockImplementation(() => mockNavigate);
  });

  test('renders email input and submit button', () => {
    render(<ForgetPassword />);
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send reset email/i })
    ).toBeInTheDocument();
  });

  test('calls sendPasswordResetEmail and navigates on success', async () => {
    firebaseAuth.sendPasswordResetEmail.mockResolvedValue({});

    const { container } = render(<ForgetPassword />);
    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const form = container.querySelector('form');

    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.submit(form);

    await waitFor(() => {
      // Assert the function was called
      expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalled();
      // Check the email argument
      const calledArgs = firebaseAuth.sendPasswordResetEmail.mock.calls[0];
      expect(calledArgs[1]).toBe('test@example.com');
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Password reset email sent! Check your inbox',
        { position: 'bottom-right' }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(
        screen.getByRole('button', { name: /send reset email/i })
      ).toBeEnabled();
    });
  });

  test('displays error toast on invalid email', async () => {
    firebaseAuth.sendPasswordResetEmail.mockRejectedValue({ code: 'auth/invalid-email' });
    const { container } = render(<ForgetPassword />);

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const form = container.querySelector('form');

    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email address',
        { position: 'bottom-right' }
      );
    });

    expect(
      screen.getByRole('button', { name: /send reset email/i })
    ).toBeEnabled();
  });

  test('displays error toast on user not found', async () => {
    firebaseAuth.sendPasswordResetEmail.mockRejectedValue({ code: 'auth/user-not-found' });
    render(<ForgetPassword />);

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const submitButton = screen.getByRole('button', { name: /send reset email/i });

    await userEvent.type(emailInput, 'unknown@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No account found with this email',
        { position: 'bottom-right' }
      );
    });
    expect(
      submitButton
    ).toBeEnabled();
  });

  test('displays generic error toast on other errors', async () => {
    firebaseAuth.sendPasswordResetEmail.mockRejectedValue({ code: 'auth/unknown-error' });
    render(<ForgetPassword />);

    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const submitButton = screen.getByRole('button', { name: /send reset email/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to send reset email. Please try again.',
        { position: 'bottom-right' }
      );
    });
    expect(
      submitButton
    ).toBeEnabled();
  });
});
