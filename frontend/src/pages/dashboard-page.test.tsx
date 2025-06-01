import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import DashboardPage from './dashboard-page';

// Mock the API request
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn().mockResolvedValue({
    json: () => Promise.resolve({
      totalSteps: 8500,
      totalCalories: 420,
      avgSleep: 7.5,
      waterIntake: 2.1,
      weeklyProgress: {
        steps: [7500, 8200, 7800, 9100, 8500, 7900, 8600],
        calories: [380, 420, 410, 450, 420, 400, 440]
      }
    })
  })
}));

describe('Dashboard Page', () => {
  it('renders dashboard with loading state initially', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard de Saúde')).toBeInTheDocument();
  });

  it('displays health metrics after loading', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('8,500')).toBeInTheDocument(); // steps
      expect(screen.getByText('420')).toBeInTheDocument(); // calories
    });
  });

  it('shows quick action cards', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Registrar Atividade')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Refeição')).toBeInTheDocument();
      expect(screen.getByText('Novo Exame')).toBeInTheDocument();
    });
  });
});