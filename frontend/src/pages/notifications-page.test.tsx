import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import NotificationsPage from './notifications-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      notifications: [
        { id: 1, title: 'Lembrete de Medicamento', message: 'Hora de tomar Vitamina D', read: false, createdAt: new Date() },
        { id: 2, title: 'Meta Atingida', message: 'Você completou 10.000 passos hoje!', read: true, createdAt: new Date() }
      ],
      unreadCount: 1
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

describe('Notifications Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders notifications page with title', async () => {
    renderWithProviders(<NotificationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Notificações')).toBeInTheDocument();
    });
  });

  test('displays notification list', async () => {
    renderWithProviders(<NotificationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Lembrete de Medicamento')).toBeInTheDocument();
      expect(screen.getByText('Meta Atingida')).toBeInTheDocument();
    });
  });

  test('shows unread notification count', async () => {
    renderWithProviders(<NotificationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/não lidas/)).toBeInTheDocument();
    });
  });

  test('allows marking notifications as read', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsPage />);
    
    await waitFor(() => {
      const markReadButton = screen.getByText(/Marcar como lida/);
      expect(markReadButton).toBeInTheDocument();
    });
  });
});