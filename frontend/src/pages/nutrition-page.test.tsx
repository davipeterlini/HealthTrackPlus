import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import NutritionPage from './nutrition-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      meals: [
        { id: 1, name: 'Café da Manhã', type: 'breakfast', calories: 350, date: new Date() },
        { id: 2, name: 'Almoço', type: 'lunch', calories: 650, date: new Date() }
      ],
      totalCalories: 1000,
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

describe('Nutrition Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nutrition page with title', async () => {
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Nutrição')).toBeInTheDocument();
    });
  });

  test('displays nutrition tabs', async () => {
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Atual')).toBeInTheDocument();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
    });
  });

  test('shows add meal button', async () => {
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Adicionar Refeição/)).toBeInTheDocument();
    });
  });

  test('opens add meal modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Refeição/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Adicionar Refeição/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays meal list when available', async () => {
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Café da Manhã')).toBeInTheDocument();
      expect(screen.getByText('Almoço')).toBeInTheDocument();
    });
  });

  test('switches between tabs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Histórico')).toBeInTheDocument();
    });
    
    const historyTab = screen.getByText('Histórico');
    await user.click(historyTab);
    
    await waitFor(() => {
      expect(historyTab).toHaveAttribute('data-state', 'active');
    });
  });

  test('displays calorie tracking information', async () => {
    renderWithProviders(<NutritionPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Calorias/)).toBeInTheDocument();
    });
  });
});