import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import SleepPage from './sleep-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      sleepData: [
        { id: 1, date: new Date(), duration: 480, quality: 85, bedtime: '22:30', wakeup: '06:30' },
        { id: 2, date: new Date(), duration: 420, quality: 75, bedtime: '23:00', wakeup: '06:00' }
      ],
      averageSleep: 450,
      sleepQuality: 80
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

describe('Sleep Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders sleep page with title', async () => {
    renderWithProviders(<SleepPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Monitoramento do Sono')).toBeInTheDocument();
    });
  });

  test('displays sleep statistics', async () => {
    renderWithProviders(<SleepPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Sono/)).toBeInTheDocument();
    });
  });

  test('shows add sleep record button', async () => {
    renderWithProviders(<SleepPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Registrar Sono/)).toBeInTheDocument();
    });
  });

  test('opens sleep record modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SleepPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Registrar Sono/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Registrar Sono/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays sleep quality metrics', async () => {
    renderWithProviders(<SleepPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Qualidade/)).toBeInTheDocument();
    });
  });
});