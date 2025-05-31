import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import SubscriptionPage from './subscription-page';

// Mock Stripe
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => null,
  useElements: () => null,
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
  loadStripe: vi.fn(),
}));

// Mock the API request
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn().mockResolvedValue({
    json: () => Promise.resolve({
      isActive: false,
      status: 'inactive',
      endDate: null
    })
  })
}));

describe('Subscription Page', () => {
  it('renders subscription plans', async () => {
    render(<SubscriptionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('LifeTrek Premium Club')).toBeInTheDocument();
      expect(screen.getByText('Básico')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Profissional')).toBeInTheDocument();
    });
  });

  it('shows pricing information', async () => {
    render(<SubscriptionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Gratuito')).toBeInTheDocument();
      expect(screen.getByText('R$ 29,90')).toBeInTheDocument();
      expect(screen.getByText('R$ 79,90')).toBeInTheDocument();
    });
  });

  it('displays premium features', async () => {
    render(<SubscriptionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('IA Avançada')).toBeInTheDocument();
      expect(screen.getByText('Monitoramento 360°')).toBeInTheDocument();
      expect(screen.getByText('Conquistas & Metas')).toBeInTheDocument();
    });
  });
});