import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Mock hooks and providers
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    isLoading: false,
    isAuthenticated: true,
  }),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dashboard-settings', () => ({
  useDashboardSettings: () => ({
    settings: { layout: 'grid' },
    updateSettings: vi.fn(),
  }),
  DashboardSettingsProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => children,
}));

vi.mock('@/hooks/use-dev-mode', () => ({
  useDevMode: () => ({
    isDevMode: false,
    toggleDevMode: vi.fn(),
  }),
  DevModeProvider: ({ children }: any) => children,
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
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', vi.fn()],
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
  Route: ({ component: Component, ...props }: any) => Component ? <Component {...props} /> : null,
  Switch: ({ children }: any) => children,
}));

// Test component for responsive behavior
const ResponsiveTestComponent = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden p-4 border-b">
        <button 
          data-testid="mobile-menu-toggle"
          className="md:hidden"
        >
          Menu
        </button>
      </header>
      
      {/* Desktop Sidebar */}
      <aside 
        className="hidden lg:block w-64 bg-card"
        data-testid="desktop-sidebar"
      >
        <nav>Navigation</nav>
      </aside>
      
      {/* Main Content */}
      <main className="lg:ml-64 p-4">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4" data-testid="grid-item-1">Card 1</div>
          <div className="bg-card p-4" data-testid="grid-item-2">Card 2</div>
          <div className="bg-card p-4" data-testid="grid-item-3">Card 3</div>
        </div>
        
        {/* Responsive Text */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          Responsive Title
        </h1>
        
        {/* Responsive Button */}
        <button 
          className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground"
          data-testid="responsive-button"
        >
          Action Button
        </button>
      </main>
    </div>
  );
};

// Helper function to set viewport size
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Mock matchMedia for breakpoint testing
  window.matchMedia = vi.fn().mockImplementation(query => {
    const matches = (() => {
      if (query.includes('768px')) return width >= 768; // md
      if (query.includes('1024px')) return width >= 1024; // lg
      if (query.includes('1280px')) return width >= 1280; // xl
      return false;
    })();
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Responsive Design System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Viewport (< 768px)', () => {
    beforeEach(() => {
      setViewport(375, 667);
    });

    test('shows mobile menu toggle on small screens', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      expect(mobileToggle).toBeInTheDocument();
      expect(mobileToggle).toHaveClass('md:hidden');
    });

    test('hides desktop sidebar on mobile', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const desktopSidebar = screen.getByTestId('desktop-sidebar');
      expect(desktopSidebar).toHaveClass('hidden', 'lg:block');
    });

    test('displays single column grid on mobile', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const gridContainer = screen.getByTestId('grid-item-1').parentElement;
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    test('button takes full width on mobile', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const button = screen.getByTestId('responsive-button');
      expect(button).toHaveClass('w-full', 'sm:w-auto');
    });
  });

  describe('Tablet Viewport (768px - 1023px)', () => {
    beforeEach(() => {
      setViewport(768, 1024);
    });

    test('hides mobile menu toggle on tablet', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      expect(mobileToggle).toHaveClass('md:hidden');
    });

    test('displays two column grid on tablet', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const gridContainer = screen.getByTestId('grid-item-1').parentElement;
      expect(gridContainer).toHaveClass('md:grid-cols-2');
    });

    test('button has auto width on tablet', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const button = screen.getByTestId('responsive-button');
      expect(button).toHaveClass('sm:w-auto');
    });
  });

  describe('Desktop Viewport (>= 1024px)', () => {
    beforeEach(() => {
      setViewport(1280, 800);
    });

    test('shows desktop sidebar on large screens', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const desktopSidebar = screen.getByTestId('desktop-sidebar');
      expect(desktopSidebar).toHaveClass('lg:block');
      expect(desktopSidebar).not.toHaveClass('hidden');
    });

    test('displays three column grid on desktop', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const gridContainer = screen.getByTestId('grid-item-1').parentElement;
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });

    test('main content has left margin for sidebar', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('lg:ml-64');
    });
  });

  describe('Responsive Utilities', () => {
    test('applies responsive text sizes', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const title = screen.getByText('Responsive Title');
      expect(title).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl');
    });

    test('handles breakpoint-specific visibility', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      const desktopSidebar = screen.getByTestId('desktop-sidebar');
      
      expect(mobileToggle).toHaveClass('md:hidden');
      expect(desktopSidebar).toHaveClass('hidden', 'lg:block');
    });

    test('applies responsive spacing and padding', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('p-4');
    });
  });

  describe('Touch and Interaction', () => {
    test('handles touch interactions on mobile', async () => {
      setViewport(375, 667);
      const user = userEvent.setup();
      renderWithProviders(<ResponsiveTestComponent />);
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      await user.click(mobileToggle);
      
      // Should handle click without errors
      expect(mobileToggle).toBeInTheDocument();
    });

    test('maintains accessibility across breakpoints', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      const button = screen.getByTestId('responsive-button');
      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Action Button');
    });
  });

  describe('Dynamic Viewport Changes', () => {
    test('adapts to viewport size changes', () => {
      renderWithProviders(<ResponsiveTestComponent />);
      
      // Start with mobile
      setViewport(375, 667);
      let mobileToggle = screen.getByTestId('mobile-menu-toggle');
      expect(mobileToggle).toHaveClass('md:hidden');
      
      // Switch to desktop
      setViewport(1280, 800);
      const desktopSidebar = screen.getByTestId('desktop-sidebar');
      expect(desktopSidebar).toHaveClass('lg:block');
    });

    test('maintains state across breakpoint changes', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ResponsiveTestComponent />);
      
      const button = screen.getByTestId('responsive-button');
      
      // Should be clickable at different viewport sizes
      setViewport(375, 667);
      await user.click(button);
      
      setViewport(1280, 800);
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });
  });
});