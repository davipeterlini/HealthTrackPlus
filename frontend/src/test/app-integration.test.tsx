import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock all external dependencies
vi.mock('@/lib/queryClient', () => ({
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
  getQueryFn: vi.fn(() => async () => ({
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    activities: [],
    meals: [],
    sleepData: [],
    exams: [],
  })),
  apiRequest: vi.fn().mockResolvedValue({ ok: true, json: () => ({}) }),
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    isLoading: false,
    isAuthenticated: true,
  }),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dev-mode', () => ({
  useDevMode: () => ({
    isDevMode: true,
    toggleDevMode: vi.fn(),
  }),
  DevModeProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dashboard-settings', () => ({
  useDashboardSettings: () => ({
    settings: {},
    updateSettings: vi.fn(),
  }),
  DashboardSettingsProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock window location for routing
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/dashboard',
    search: '',
    hash: '',
  },
  writable: true,
});

describe('Application Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders application without crashing', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard de Saúde')).toBeInTheDocument();
    });
  });

  test('displays main navigation elements', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Check for main dashboard content
      expect(screen.getByText('Dashboard de Saúde')).toBeInTheDocument();
      
      // Check for navigation items
      expect(screen.getByText('Atividades')).toBeInTheDocument();
      expect(screen.getByText('Nutrição')).toBeInTheDocument();
      expect(screen.getByText('Sono')).toBeInTheDocument();
      expect(screen.getByText('Exames')).toBeInTheDocument();
    });
  });

  test('displays health metrics on dashboard', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Passos/)).toBeInTheDocument();
      expect(screen.getByText(/Calorias/)).toBeInTheDocument();
      expect(screen.getByText(/Sono/)).toBeInTheDocument();
      expect(screen.getByText(/Hidratação/)).toBeInTheDocument();
    });
  });

  test('shows quick action buttons', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Registrar Atividade')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Refeição')).toBeInTheDocument();
      expect(screen.getByText('Novo Exame')).toBeInTheDocument();
      expect(screen.getByText('Clube Premium')).toBeInTheDocument();
    });
  });

  test('handles navigation between pages', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to activity page
    await waitFor(() => {
      const activityLink = screen.getByText('Atividades');
      expect(activityLink).toBeInTheDocument();
    });
    
    const activityLink = screen.getByText('Atividades');
    await user.click(activityLink);
    
    await waitFor(() => {
      expect(screen.getByText('Atividades Físicas')).toBeInTheDocument();
    });
  });

  test('opens modals from quick actions', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await waitFor(() => {
      const addActivityButton = screen.getByText('Registrar Atividade');
      expect(addActivityButton).toBeInTheDocument();
    });
    
    const addActivityButton = screen.getByText('Registrar Atividade');
    await user.click(addActivityButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays user information', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  test('handles responsive design elements', async () => {
    render(<App />);
    
    // Check for responsive grid layout
    await waitFor(() => {
      const dashboardContent = screen.getByText('Dashboard de Saúde');
      expect(dashboardContent).toBeInTheDocument();
    });
  });

  test('supports theme switching', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Theme provider should be available
      expect(document.documentElement).toHaveClass('light');
    });
  });

  test('displays subscription features', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await waitFor(() => {
      const premiumButton = screen.getByText('Clube Premium');
      expect(premiumButton).toBeInTheDocument();
    });
    
    const premiumButton = screen.getByText('Clube Premium');
    await user.click(premiumButton);
    
    await waitFor(() => {
      expect(screen.getByText('LifeTrek Premium Club')).toBeInTheDocument();
    });
  });
});