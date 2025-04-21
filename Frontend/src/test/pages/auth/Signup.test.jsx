import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Signup from '../../../pages/auth/Signup';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Mock Firebase app
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  getIdToken: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  doc: vi.fn(),
  getFirestore: vi.fn(() => ({})),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  Link: ({ children }) => children,
}));

// Mock useAuth from AuthContext
const mockSetUser = vi.fn();
const mockSetUserRole = vi.fn();
vi.mock('../../../pages/auth/AuthContext', () => ({
  useAuth: () => ({ setUser: mockSetUser, setUserRole: mockSetUserRole }),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the signup form with all fields', () => {
    render(<Signup />);
    
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows users to input data into the form fields', async () => {
    render(<Signup />);
    
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    
    expect(fullNameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  test('shows error when passwords do not match', async () => {
    render(<Signup />);
    
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password456');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match', expect.any(Object));
    });
  });

  test('shows error when fields are empty', async () => {
    render(<Signup />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fill in all fields', expect.any(Object));
    });
  });

  test('successful signup navigates to home page', async () => {
    const mockUser = { uid: '123' };
    const mockToken = 'mock-token';
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    firebaseAuth.getIdToken.mockResolvedValue(mockToken);
    firebaseFirestore.setDoc.mockResolvedValue();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    
    render(<Signup />);
    
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockSetUserRole).toHaveBeenCalledWith('User');
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error when email is already in use', async () => {
    firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });
    
    render(<Signup />);
    
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email is already in use. Please use a different email.', expect.any(Object));
    });
  });
});