import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Sidebar } from './sidebar';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({})),
  };
});

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}));

vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', vi.fn()],
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation menu', async () => {
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Atividades')).toBeInTheDocument();
      expect(screen.getByText('Nutrição')).toBeInTheDocument();
    });
  });

  test('displays user information', async () => {
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  test('shows all navigation links', async () => {
    renderWithProviders(<Sidebar />);
    
    const expectedLinks = [
      'Dashboard', 'Atividades', 'Nutrição', 'Sono', 
      'Saúde Mental', 'Hidratação', 'Medicamentos',
      'Saúde da Mulher', 'Jejum', 'Exames', 'Vídeos'
    ];
    
    for (const linkText of expectedLinks) {
      await waitFor(() => {
        expect(screen.getByText(linkText)).toBeInTheDocument();
      });
    }
  });

  test('handles navigation clicks', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    
    await waitFor(() => {
      const activityLink = screen.getByText('Atividades');
      expect(activityLink).toBeInTheDocument();
    });
    
    const activityLink = screen.getByText('Atividades');
    await user.click(activityLink);
  });
});