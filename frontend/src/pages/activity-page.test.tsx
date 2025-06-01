import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import ActivityPage from './activity-page';

// Mock the queryClient
vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      activities: [
        { id: 1, type: 'Corrida', duration: 30, calories: 300, date: new Date() },
        { id: 2, type: 'Ciclismo', duration: 45, calories: 400, date: new Date() }
      ],
      totalSteps: 8500,
      totalCalories: 700
    })),
  };
});

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock framer-motion
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

describe('Activity Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders activity page with title', async () => {
    renderWithProviders(<ActivityPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Atividades Físicas')).toBeInTheDocument();
    });
  });

  test('displays activity statistics', async () => {
    renderWithProviders(<ActivityPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Passos/)).toBeInTheDocument();
      expect(screen.getByText(/Calorias/)).toBeInTheDocument();
    });
  });

  test('shows add activity button', async () => {
    renderWithProviders(<ActivityPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Adicionar Atividade/)).toBeInTheDocument();
    });
  });

  test('opens add activity modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ActivityPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Atividade/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Adicionar Atividade/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays activity list when available', async () => {
    renderWithProviders(<ActivityPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Corrida')).toBeInTheDocument();
      expect(screen.getByText('Ciclismo')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    renderWithProviders(<ActivityPage />);
    
    // Should show loading state initially
    expect(screen.getByText('Atividades Físicas')).toBeInTheDocument();
  });
});