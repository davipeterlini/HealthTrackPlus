import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import SettingsPage from './settings-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      userSettings: {
        theme: 'light',
        language: 'pt',
        notifications: true,
        privacy: 'public'
      }
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

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders settings page with title', async () => {
    renderWithProviders(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Configurações')).toBeInTheDocument();
    });
  });

  test('displays theme settings', async () => {
    renderWithProviders(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tema/)).toBeInTheDocument();
    });
  });

  test('displays language settings', async () => {
    renderWithProviders(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Idioma/)).toBeInTheDocument();
    });
  });

  test('displays notification settings', async () => {
    renderWithProviders(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Notificações/)).toBeInTheDocument();
    });
  });

  test('allows toggling settings', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);
    
    await waitFor(() => {
      const toggles = screen.getAllByRole('switch');
      expect(toggles.length).toBeGreaterThan(0);
    });
  });
});