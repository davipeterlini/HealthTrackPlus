import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import WomensHealthPage from './womens-health-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      cycleData: [
        { id: 1, date: new Date(), phase: 'menstrual', symptoms: ['cramps'], mood: 'tired' },
        { id: 2, date: new Date(), phase: 'ovulation', symptoms: [], mood: 'energetic' }
      ],
      nextPeriod: new Date(),
      cycleLength: 28
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

describe('Womens Health Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders womens health page with title', async () => {
    renderWithProviders(<WomensHealthPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Saúde da Mulher')).toBeInTheDocument();
    });
  });

  test('displays cycle tracking section', async () => {
    renderWithProviders(<WomensHealthPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ciclo/)).toBeInTheDocument();
    });
  });

  test('shows add cycle entry button', async () => {
    renderWithProviders(<WomensHealthPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Registrar Ciclo/)).toBeInTheDocument();
    });
  });

  test('opens cycle entry modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WomensHealthPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Registrar Ciclo/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Registrar Ciclo/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});