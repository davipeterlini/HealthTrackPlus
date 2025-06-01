import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import HydrationPage from './hydration-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      hydrationData: [
        { id: 1, amount: 250, type: 'water', time: new Date() },
        { id: 2, amount: 500, type: 'water', time: new Date() }
      ],
      dailyIntake: 750,
      dailyGoal: 2000
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

describe('Hydration Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders hydration page with title', async () => {
    renderWithProviders(<HydrationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Hidratação')).toBeInTheDocument();
    });
  });

  test('displays water intake progress', async () => {
    renderWithProviders(<HydrationPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/ml/)).toBeInTheDocument();
    });
  });

  test('shows add water button', async () => {
    renderWithProviders(<HydrationPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Adicionar Água/)).toBeInTheDocument();
    });
  });

  test('opens water intake modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HydrationPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Água/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Adicionar Água/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});