import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Prepare spies and stubs
const mockUnsubscribe = vi.fn()
const mockOnAuthStateChanged = vi.fn()
const mockGetDoc = vi.fn()
const mockDoc = vi.fn()

// Mock firebase/auth module
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (authInstance, callback) => mockOnAuthStateChanged(authInstance, callback),
  getAuth: () => ({}),
}))

// Mock firebase/firestore module
vi.mock('firebase/firestore', () => ({
  doc: (db, collection, uid) => mockDoc(db, collection, uid),
  getDoc: (docRef) => mockGetDoc(docRef),
  getFirestore: () => ({}),
}))

// Import the context under test
import { AuthProvider, useAuth } from '../../../pages/auth/AuthContext'

// Consumer to read context values
function Consumer() {
  const { user, userId, userRole, loading, roleLoading } = useAuth()
  return (
    <div data-testid="consumer">
      <span data-testid="user">{user ? 'U' : 'null'}</span>
      <span data-testid="uid">{userId || 'null'}</span>
      <span data-testid="role">{userRole || 'null'}</span>
      <span data-testid="load">{loading ? 'true' : 'false'}</span>
      <span data-testid="rload">{roleLoading ? 'true' : 'false'}</span>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // default behavior: no user
    mockOnAuthStateChanged.mockImplementation((authInst, cb) => {
      cb(null)
      return mockUnsubscribe
    })
  })

  it('provides null user and finishes loading when no user', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('load').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('uid').textContent).toBe('null')
    expect(screen.getByTestId('role').textContent).toBe('null')
    expect(screen.getByTestId('rload').textContent).toBe('true')
  })

  it('fetches and sets role when user signs in and doc exists', async () => {
    const mockUser = { uid: 'abc123' }
    mockOnAuthStateChanged.mockImplementationOnce((authInst, cb) => {
      cb(mockUser)
      return mockUnsubscribe
    })
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ role: 'admin' }) })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('load').textContent).toBe('false'))
    await waitFor(() => expect(screen.getByTestId('rload').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('U')
    expect(screen.getByTestId('uid').textContent).toBe('abc123')
    expect(screen.getByTestId('role').textContent).toBe('admin')
  })

  it('handles missing Firestore doc by setting role to null', async () => {
    const mockUser = { uid: 'noDoc' }
    mockOnAuthStateChanged.mockImplementationOnce((authInst, cb) => {
      cb(mockUser)
      return mockUnsubscribe
    })
    mockGetDoc.mockResolvedValueOnce({ exists: () => false })

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('load').textContent).toBe('false'))
    await waitFor(() => expect(screen.getByTestId('rload').textContent).toBe('false'))
    expect(screen.getByTestId('role').textContent).toBe('null')
  })

  it('handles error in getDoc by setting role to null', async () => {
    const mockUser = { uid: 'errUser' }
    mockOnAuthStateChanged.mockImplementationOnce((authInst, cb) => {
      cb(mockUser)
      return mockUnsubscribe
    })
    mockGetDoc.mockRejectedValueOnce(new Error('fail'))

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByTestId('load').textContent).toBe('false'))
    await waitFor(() => expect(screen.getByTestId('rload').textContent).toBe('false'))
    expect(screen.getByTestId('role').textContent).toBe('null')
  })

  it('throws when useAuth is used outside of AuthProvider', () => {
    expect(() => render(<Consumer />)).toThrow()
  })
})