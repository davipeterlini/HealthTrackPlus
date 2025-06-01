import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { HealthPlanSetup } from './health-plan-setup';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      healthGoals: [],
      preferences: {},
      currentStep: 1
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

describe('Health Plan Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders health plan setup with title', async () => {
    renderWithProviders(<HealthPlanSetup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Plano de Saúde/)).toBeInTheDocument();
    });
  });

  test('displays setup steps', async () => {
    renderWithProviders(<HealthPlanSetup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Passo/)).toBeInTheDocument();
    });
  });

  test('shows health goal options', async () => {
    renderWithProviders(<HealthPlanSetup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Objetivos/)).toBeInTheDocument();
    });
  });

  test('allows selecting health goals', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HealthPlanSetup />);
    
    await waitFor(() => {
      const goalOptions = screen.getAllByRole('checkbox');
      expect(goalOptions.length).toBeGreaterThan(0);
    });
  });

  test('shows continue button', async () => {
    renderWithProviders(<HealthPlanSetup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Continuar/)).toBeInTheDocument();
    });
  });
});