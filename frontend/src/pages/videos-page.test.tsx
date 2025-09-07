import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import VideosPage from './videos-page';

vi.mock('@/lib/queryClient', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queryClient')>();
  return {
    ...actual,
    getQueryFn: vi.fn(() => async () => ({
      videos: [
        { id: 1, title: 'Yoga para Iniciantes', duration: '30 min', category: 'yoga', premium: false },
        { id: 2, title: 'Meditação Avançada', duration: '45 min', category: 'meditation', premium: true }
      ],
      categories: ['yoga', 'meditation', 'fitness'],
      watchedVideos: 5
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

describe('Videos Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders videos page with title', async () => {
    renderWithProviders(<VideosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Vídeos')).toBeInTheDocument();
    });
  });

  test('displays video categories', async () => {
    renderWithProviders(<VideosPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Categorias/)).toBeInTheDocument();
    });
  });

  test('shows video list', async () => {
    renderWithProviders(<VideosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Yoga para Iniciantes')).toBeInTheDocument();
      expect(screen.getByText('Meditação Avançada')).toBeInTheDocument();
    });
  });

  test('displays premium indicators', async () => {
    renderWithProviders(<VideosPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Premium/)).toBeInTheDocument();
    });
  });
});