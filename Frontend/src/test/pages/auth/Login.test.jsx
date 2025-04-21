// Frontend/src/test/pages/auth/Login.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../../../pages/auth/Login';
import { auth, db } from '../../../pages/auth/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock Firebase configuration
vi.mock('../../../pages/auth/Firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    currentUser: null,
  },
  db: {},
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock Lottie
vi.mock('react-lottie-player', () => ({
  default: vi.fn(() => null),
}));

describe('LoginForm Component', () => {
  const mockUser = {
    uid: 'test-uid',
    getIdToken: vi.fn().mockResolvedValue('mock-token'),
  };

  const mockUserDoc = {
    exists: vi.fn(() => true),
    data: vi.fn(() => ({ role: 'User' })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth state observer
    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
      return vi.fn();
    });

    // Mock successful Firebase login
    signInWithEmailAndPassword.mockResolvedValue({
      user: mockUser,
    });

    // Mock Firestore response
    getDoc.mockResolvedValue(mockUserDoc);
    doc.mockReturnValue('mock-doc-ref');
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  };

  it('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter email and password');
    });
  });

  it('handles successful login', async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(getDoc).toHaveBeenCalledWith('mock-doc-ref');
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  it('handles invalid credentials', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  it('handles user role navigation', async () => {
    mockUserDoc.data.mockReturnValue({ role: 'Admin' });

    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });

    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'adminpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(db, 'users', 'test-uid');
      expect(getDoc).toHaveBeenCalled();
    });
  });
});