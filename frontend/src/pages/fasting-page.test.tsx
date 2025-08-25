import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import FastingPage from './fasting-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      fastingData: [
        { id: 1, startTime: new Date(), endTime: new Date(), duration: 16, type: 'intermittent' },
        { id: 2, startTime: new Date(), endTime: new Date(), duration: 24, type: 'extended' }
      ],
      currentFast: { startTime: new Date(), duration: 8 },
      fastingStreak: 5
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

describe('Fasting Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders fasting page with title', async () => {
    renderWithProviders(<FastingPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Jejum Intermitente')).toBeInTheDocument();
    });
  });

  test('displays fasting timer', async () => {
    renderWithProviders(<FastingPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Jejum/)).toBeInTheDocument();
    });
  });

  test('shows start fast button', async () => {
    renderWithProviders(<FastingPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Iniciar Jejum/)).toBeInTheDocument();
    });
  });

  test('displays fasting history', async () => {
    renderWithProviders(<FastingPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Histórico/)).toBeInTheDocument();
    });
  });
});