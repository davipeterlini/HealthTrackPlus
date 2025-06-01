import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import ExamsPage from './exams-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      exams: [
        { id: 1, name: 'Hemograma Completo', date: new Date(), status: 'completed', results: 'Normal' },
        { id: 2, name: 'Glicemia', date: new Date(), status: 'pending', results: null }
      ],
      upcomingExams: 2,
      recentResults: 3
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

describe('Exams Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders exams page with title', async () => {
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Exames Médicos')).toBeInTheDocument();
    });
  });

  test('displays exam statistics', async () => {
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Exames/)).toBeInTheDocument();
    });
  });

  test('shows add exam button', async () => {
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Novo Exame/)).toBeInTheDocument();
    });
  });

  test('opens exam upload modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Novo Exame/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Novo Exame/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays exam list when available', async () => {
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Hemograma Completo')).toBeInTheDocument();
      expect(screen.getByText('Glicemia')).toBeInTheDocument();
    });
  });

  test('shows exam status indicators', async () => {
    renderWithProviders(<ExamsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('completed')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });
});