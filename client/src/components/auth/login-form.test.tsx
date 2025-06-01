import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { LoginForm } from './login-form';

// Mock the API request
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn()
}));

describe('LoginForm Component', () => {
  it('renders login form fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('handles form submission with valid data', async () => {
    const mockApiRequest = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: 1, username: 'testuser' })
    });
    
    vi.doMock('@/lib/queryClient', () => ({
      apiRequest: mockApiRequest
    }));

    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/login', {
        username: 'testuser',
        password: 'password123'
      });
    });
  });
});