import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { ReactElement } from 'react';

// Create a new QueryClient instance for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Mock providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Export test utilities
export * from '@testing-library/react';
export { customRender as render };

// Common mocks
export const mockQueryClient = () => {
  return vi.mock('@/lib/queryClient', () => ({
    queryClient: createTestQueryClient(),
    getQueryFn: vi.fn(() => async () => ({})),
    apiRequest: vi.fn(),
  }));
};

export const mockToast = () => {
  return vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
      toast: vi.fn(),
    }),
  }));
};

export const mockFramerMotion = () => {
  return vi.mock('framer-motion', () => ({
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    },
    AnimatePresence: ({ children }: any) => children,
  }));
};

export const mockAuth = (user = { id: 1, username: 'testuser', email: 'test@example.com' }) => {
  return vi.mock('@/hooks/use-auth', () => ({
    useAuth: () => ({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    }),
    AuthProvider: ({ children }: any) => children,
  }));
};

export const mockRouter = (currentPath = '/dashboard') => {
  return vi.mock('wouter', () => ({
    useLocation: () => [currentPath, vi.fn()],
    Link: ({ children, href, ...props }: any) => (
      <a href={href} {...props}>{children}</a>
    ),
    Route: ({ component: Component, ...props }: any) => Component ? <Component {...props} /> : null,
    Switch: ({ children }: any) => children,
  }));
};