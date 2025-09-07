import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock matchMedia for system theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test component to interact with theme
const ThemeTestComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')} data-testid="light-button">
        Light Theme
      </button>
      <button onClick={() => setTheme('dark')} data-testid="dark-button">
        Dark Theme
      </button>
      <button onClick={() => setTheme('system')} data-testid="system-button">
        System Theme
      </button>
    </div>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Dark Mode Theme System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    document.documentElement.className = '';
  });

  test('initializes with system theme by default', () => {
    renderWithProviders(<ThemeTestComponent />);
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  test('switches to light theme and updates DOM', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeTestComponent />);
    
    const lightButton = screen.getByTestId('light-button');
    await user.click(lightButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
    
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('switches to dark theme and updates DOM', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeTestComponent />);
    
    const darkButton = screen.getByTestId('dark-button');
    await user.click(darkButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
    
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).not.toHaveClass('light');
  });

  test('persists theme preference in localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeTestComponent />);
    
    const darkButton = screen.getByTestId('dark-button');
    await user.click(darkButton);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  test('loads saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    renderWithProviders(<ThemeTestComponent />);
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  test('handles system theme preference', async () => {
    const user = userEvent.setup();
    
    // Mock system preference for dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    renderWithProviders(<ThemeTestComponent />);
    
    const systemButton = screen.getByTestId('system-button');
    await user.click(systemButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
  });

  test('applies correct CSS classes for theme switching', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeTestComponent />);
    
    // Switch to dark theme
    await user.click(screen.getByTestId('dark-button'));
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
    
    // Switch to light theme
    await user.click(screen.getByTestId('light-button'));
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  test('maintains theme state across component remounts', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithProviders(<ThemeTestComponent />);
    
    // Set theme to dark
    await user.click(screen.getByTestId('dark-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
    
    // Unmount and remount component
    unmount();
    mockLocalStorage.getItem.mockReturnValue('dark');
    renderWithProviders(<ThemeTestComponent />);
    
    // Theme should persist
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
});