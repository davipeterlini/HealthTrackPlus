import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import MentalPage from './mental-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      mentalHealthData: [
        { id: 1, mood: 'good', stress: 3, anxiety: 2, date: new Date() },
        { id: 2, mood: 'excellent', stress: 1, anxiety: 1, date: new Date() }
      ],
      moodTrend: 'improving',
      stressLevel: 2.5
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

describe('Mental Health Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders mental health page with title', async () => {
    renderWithProviders(<MentalPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Saúde Mental')).toBeInTheDocument();
    });
  });

  test('displays mood tracking section', async () => {
    renderWithProviders(<MentalPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Humor/)).toBeInTheDocument();
    });
  });

  test('shows add mood entry button', async () => {
    renderWithProviders(<MentalPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Registrar Humor/)).toBeInTheDocument();
    });
  });

  test('opens mood entry modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MentalPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Registrar Humor/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Registrar Humor/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays stress and anxiety metrics', async () => {
    renderWithProviders(<MentalPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Estresse/)).toBeInTheDocument();
      expect(screen.getByText(/Ansiedade/)).toBeInTheDocument();
    });
  });
});