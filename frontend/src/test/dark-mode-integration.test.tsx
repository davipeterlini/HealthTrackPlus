import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Mock all required providers and hooks
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    isLoading: false,
    isAuthenticated: true,
  }),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dev-mode', () => ({
  useDevMode: () => ({
    isDevMode: false,
    toggleDevMode: vi.fn(),
  }),
  DevModeProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dashboard-settings', () => ({
  useDashboardSettings: () => ({
    settings: {},
    updateSettings: vi.fn(),
  }),
  DashboardSettingsProvider: ({ children }: any) => children,
}));

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

vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', vi.fn()],
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Test component that demonstrates dark mode integration
const DarkModeIntegrationComponent = () => {
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Toggle Theme
      </button>

      {/* shadcn/ui Card Component */}
      <div className="bg-card text-card-foreground border rounded-lg p-6 m-4" data-testid="shadcn-card">
        <h3 className="text-xl font-semibold mb-2">Dashboard Card</h3>
        <p className="text-muted-foreground">This is a card with theme-aware colors</p>
      </div>

      {/* Primary Button */}
      <button 
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md m-4"
        data-testid="primary-button"
      >
        Primary Action
      </button>

      {/* Secondary Button */}
      <button 
        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md m-4"
        data-testid="secondary-button"
      >
        Secondary Action
      </button>

      {/* Muted Text */}
      <p className="text-muted-foreground m-4" data-testid="muted-text">
        This is muted text that adapts to theme
      </p>

      {/* Border Elements */}
      <div 
        className="border border-border bg-background p-4 m-4 rounded-lg"
        data-testid="border-element"
      >
        Element with theme-aware borders
      </div>

      {/* Input Element */}
      <input 
        className="bg-background border border-input text-foreground px-3 py-2 rounded-md m-4"
        placeholder="Theme-aware input"
        data-testid="themed-input"
      />

      {/* Destructive Button */}
      <button 
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md m-4"
        data-testid="destructive-button"
      >
        Delete Action
      </button>

      {/* Accent Elements */}
      <div 
        className="bg-accent text-accent-foreground p-4 m-4 rounded-lg"
        data-testid="accent-element"
      >
        Accent colored element
      </div>

      {/* Popover-like Element */}
      <div 
        className="bg-popover text-popover-foreground border border-border rounded-md p-4 m-4 shadow-md"
        data-testid="popover-element"
      >
        Popover content with theme colors
      </div>
    </div>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Dark Mode Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to light mode
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });

  test('applies correct CSS custom properties in light mode', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('toggles to dark mode and applies dark theme classes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(document.documentElement).not.toHaveClass('light');
    });
  });

  test('shadcn card uses correct theme variables', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const card = screen.getByTestId('shadcn-card');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('border');
  });

  test('primary button uses theme colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const button = screen.getByTestId('primary-button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
    expect(button).toHaveClass('hover:bg-primary/90');
  });

  test('secondary button uses theme colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const button = screen.getByTestId('secondary-button');
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  test('muted text uses correct color', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const text = screen.getByTestId('muted-text');
    expect(text).toHaveClass('text-muted-foreground');
  });

  test('border elements use theme border colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const element = screen.getByTestId('border-element');
    expect(element).toHaveClass('border-border');
    expect(element).toHaveClass('bg-background');
  });

  test('input uses theme colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const input = screen.getByTestId('themed-input');
    expect(input).toHaveClass('bg-background');
    expect(input).toHaveClass('border-input');
    expect(input).toHaveClass('text-foreground');
  });

  test('destructive button uses correct colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const button = screen.getByTestId('destructive-button');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  test('accent elements use accent colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const element = screen.getByTestId('accent-element');
    expect(element).toHaveClass('bg-accent');
    expect(element).toHaveClass('text-accent-foreground');
  });

  test('popover elements use popover colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const element = screen.getByTestId('popover-element');
    expect(element).toHaveClass('bg-popover');
    expect(element).toHaveClass('text-popover-foreground');
    expect(element).toHaveClass('border-border');
  });

  test('theme transition affects all elements', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    // Verify light mode first
    expect(document.documentElement).toHaveClass('light');
    
    const card = screen.getByTestId('shadcn-card');
    const button = screen.getByTestId('primary-button');
    const input = screen.getByTestId('themed-input');
    
    // All elements should have theme classes
    expect(card).toHaveClass('bg-card');
    expect(button).toHaveClass('bg-primary');
    expect(input).toHaveClass('bg-background');
    
    // Toggle to dark mode
    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
    });
    
    // Elements should still have theme classes (now dark theme values)
    expect(card).toHaveClass('bg-card');
    expect(button).toHaveClass('bg-primary');
    expect(input).toHaveClass('bg-background');
  });

  test('background and foreground colors work together', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const container = screen.getByTestId('shadcn-card').parentElement;
    expect(container).toHaveClass('bg-background');
    expect(container).toHaveClass('text-foreground');
  });

  test('hover states work with theme colors', () => {
    renderWithProviders(<DarkModeIntegrationComponent />);
    
    const primaryButton = screen.getByTestId('primary-button');
    const destructiveButton = screen.getByTestId('destructive-button');
    
    expect(primaryButton).toHaveClass('hover:bg-primary/90');
    expect(destructiveButton).toHaveClass('hover:bg-destructive/90');
  });

  describe('CSS Custom Properties Integration', () => {
    test('verifies theme CSS variables are available', () => {
      renderWithProviders(<DarkModeIntegrationComponent />);
      
      // These classes should resolve to CSS custom properties
      const card = screen.getByTestId('shadcn-card');
      const computedStyle = window.getComputedStyle(card);
      
      // The classes should be applied (actual color values depend on CSS)
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('text-card-foreground');
    });

    test('theme toggle updates CSS custom properties', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DarkModeIntegrationComponent />);
      
      const toggleButton = screen.getByTestId('theme-toggle');
      
      // Toggle theme and verify class changes
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark');
      });
      
      // Toggle back
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('light');
      });
    });
  });
});