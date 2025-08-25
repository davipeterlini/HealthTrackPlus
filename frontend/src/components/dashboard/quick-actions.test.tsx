import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { QuickActions } from './quick-actions';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({})),
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

describe('Quick Actions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders quick action buttons', async () => {
    renderWithProviders(<QuickActions />);
    
    await waitFor(() => {
      expect(screen.getByText('Registrar Atividade')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Refeição')).toBeInTheDocument();
      expect(screen.getByText('Novo Exame')).toBeInTheDocument();
      expect(screen.getByText('Clube Premium')).toBeInTheDocument();
    });
  });

  test('opens modals when action buttons are clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<QuickActions />);
    
    await waitFor(() => {
      const activityButton = screen.getByText('Registrar Atividade');
      expect(activityButton).toBeInTheDocument();
    });
    
    const activityButton = screen.getByText('Registrar Atividade');
    await user.click(activityButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('displays action icons', async () => {
    renderWithProviders(<QuickActions />);
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});