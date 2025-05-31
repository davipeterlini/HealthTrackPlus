import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import IntegrationsPage from './integrations-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      integrations: [
        { id: 1, name: 'Google Fit', connected: true, lastSync: new Date() },
        { id: 2, name: 'Apple Health', connected: false, lastSync: null }
      ],
      availableIntegrations: ['Fitbit', 'Samsung Health', 'Garmin']
    })),
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
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

describe('Integrations Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders integrations page with title', async () => {
    renderWithProviders(<IntegrationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Integrações')).toBeInTheDocument();
    });
  });

  test('displays connected integrations', async () => {
    renderWithProviders(<IntegrationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Google Fit')).toBeInTheDocument();
      expect(screen.getByText('Apple Health')).toBeInTheDocument();
    });
  });

  test('shows connection status', async () => {
    renderWithProviders(<IntegrationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Conectado/)).toBeInTheDocument();
      expect(screen.getByText(/Desconectado/)).toBeInTheDocument();
    });
  });

  test('allows connecting new integrations', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IntegrationsPage />);
    
    await waitFor(() => {
      const connectButton = screen.getByText(/Conectar/);
      expect(connectButton).toBeInTheDocument();
    });
  });
});