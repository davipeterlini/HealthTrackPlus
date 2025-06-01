import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import MedicationPage from './medication-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      medications: [
        { id: 1, name: 'Vitamina D', dosage: '1000 UI', frequency: 'daily', time: '08:00' },
        { id: 2, name: 'Ômega 3', dosage: '500mg', frequency: 'twice daily', time: '12:00' }
      ],
      todayReminders: 3,
      missedDoses: 1
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

describe('Medication Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders medication page with title', async () => {
    renderWithProviders(<MedicationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Medicamentos')).toBeInTheDocument();
    });
  });

  test('displays medication list', async () => {
    renderWithProviders(<MedicationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Vitamina D')).toBeInTheDocument();
      expect(screen.getByText('Ômega 3')).toBeInTheDocument();
    });
  });

  test('shows add medication button', async () => {
    renderWithProviders(<MedicationPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Adicionar Medicamento/)).toBeInTheDocument();
    });
  });

  test('opens medication modal when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MedicationPage />);
    
    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar Medicamento/);
      expect(addButton).toBeInTheDocument();
    });
    
    const addButton = screen.getByText(/Adicionar Medicamento/);
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays medication reminders', async () => {
    renderWithProviders(<MedicationPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Lembretes/)).toBeInTheDocument();
    });
  });
});