import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock window dimensions for testing different screen sizes
const mockViewport = (width: number, height: number) => {
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
};

// Test component that demonstrates Tailwind responsive utilities
const TailwindResponsiveComponent = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Responsive Grid Layout */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        data-testid="responsive-grid"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">Card 1</div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">Card 2</div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">Card 3</div>
      </div>

      {/* Responsive Typography */}
      <h1 
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mt-8"
        data-testid="responsive-heading"
      >
        Responsive Heading
      </h1>

      {/* Responsive Spacing */}
      <div 
        className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 xl:mt-16"
        data-testid="responsive-spacing"
      >
        Content with responsive margins
      </div>

      {/* Responsive Flex Layout */}
      <div 
        className="flex flex-col sm:flex-row gap-4 mt-8"
        data-testid="responsive-flex"
      >
        <div className="flex-1 bg-primary text-primary-foreground p-4 rounded">
          Flex Item 1
        </div>
        <div className="flex-1 bg-secondary text-secondary-foreground p-4 rounded">
          Flex Item 2
        </div>
      </div>

      {/* Responsive Visibility */}
      <div className="mt-8">
        <div 
          className="block sm:hidden"
          data-testid="mobile-only"
        >
          Mobile Only Content
        </div>
        <div 
          className="hidden sm:block md:hidden"
          data-testid="tablet-only"
        >
          Tablet Only Content
        </div>
        <div 
          className="hidden md:block"
          data-testid="desktop-plus"
        >
          Desktop and Above Content
        </div>
      </div>

      {/* Responsive Buttons */}
      <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
        <button 
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          data-testid="responsive-button-1"
        >
          Primary Action
        </button>
        <button 
          className="w-full sm:w-auto px-6 py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg"
          data-testid="responsive-button-2"
        >
          Secondary Action
        </button>
      </div>

      {/* Responsive Padding and Margins */}
      <div 
        className="p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12 m-2 sm:m-4 md:m-6 lg:m-8 xl:m-12 bg-gray-100 dark:bg-gray-900 rounded-lg mt-8"
        data-testid="responsive-padding"
      >
        Responsive Padding and Margins
      </div>

      {/* Dark Mode Specific Styles */}
      <div 
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 p-4 rounded-lg mt-8"
        data-testid="dark-mode-styles"
      >
        <h3 className="text-gray-900 dark:text-white font-semibold">Dark Mode Test</h3>
        <p className="text-gray-600 dark:text-gray-300">This content adapts to theme</p>
      </div>
    </div>
  );
};

describe('Tailwind CSS Responsive System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('applies correct responsive grid classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const grid = screen.getByTestId('responsive-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('md:grid-cols-3');
    expect(grid).toHaveClass('lg:grid-cols-4');
    expect(grid).toHaveClass('xl:grid-cols-6');
  });

  test('applies responsive typography classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const heading = screen.getByTestId('responsive-heading');
    expect(heading).toHaveClass('text-xl');
    expect(heading).toHaveClass('sm:text-2xl');
    expect(heading).toHaveClass('md:text-3xl');
    expect(heading).toHaveClass('lg:text-4xl');
    expect(heading).toHaveClass('xl:text-5xl');
  });

  test('applies responsive spacing classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const spacing = screen.getByTestId('responsive-spacing');
    expect(spacing).toHaveClass('mt-4');
    expect(spacing).toHaveClass('sm:mt-6');
    expect(spacing).toHaveClass('md:mt-8');
    expect(spacing).toHaveClass('lg:mt-12');
    expect(spacing).toHaveClass('xl:mt-16');
  });

  test('applies responsive flex classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const flex = screen.getByTestId('responsive-flex');
    expect(flex).toHaveClass('flex');
    expect(flex).toHaveClass('flex-col');
    expect(flex).toHaveClass('sm:flex-row');
  });

  test('applies responsive visibility classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const mobileOnly = screen.getByTestId('mobile-only');
    expect(mobileOnly).toHaveClass('block');
    expect(mobileOnly).toHaveClass('sm:hidden');

    const tabletOnly = screen.getByTestId('tablet-only');
    expect(tabletOnly).toHaveClass('hidden');
    expect(tabletOnly).toHaveClass('sm:block');
    expect(tabletOnly).toHaveClass('md:hidden');

    const desktopPlus = screen.getByTestId('desktop-plus');
    expect(desktopPlus).toHaveClass('hidden');
    expect(desktopPlus).toHaveClass('md:block');
  });

  test('applies responsive button styles', () => {
    render(<TailwindResponsiveComponent />);
    
    const button1 = screen.getByTestId('responsive-button-1');
    expect(button1).toHaveClass('w-full');
    expect(button1).toHaveClass('sm:w-auto');

    const button2 = screen.getByTestId('responsive-button-2');
    expect(button2).toHaveClass('w-full');
    expect(button2).toHaveClass('sm:w-auto');
  });

  test('applies responsive padding and margins', () => {
    render(<TailwindResponsiveComponent />);
    
    const padding = screen.getByTestId('responsive-padding');
    expect(padding).toHaveClass('p-2');
    expect(padding).toHaveClass('sm:p-4');
    expect(padding).toHaveClass('md:p-6');
    expect(padding).toHaveClass('lg:p-8');
    expect(padding).toHaveClass('xl:p-12');
  });

  test('applies dark mode specific classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const darkModeElement = screen.getByTestId('dark-mode-styles');
    expect(darkModeElement).toHaveClass('bg-white');
    expect(darkModeElement).toHaveClass('dark:bg-gray-800');
    expect(darkModeElement).toHaveClass('text-gray-900');
    expect(darkModeElement).toHaveClass('dark:text-gray-100');
    expect(darkModeElement).toHaveClass('border-gray-200');
    expect(darkModeElement).toHaveClass('dark:border-gray-700');
  });

  test('container has proper responsive classes', () => {
    render(<TailwindResponsiveComponent />);
    
    const container = screen.getByTestId('responsive-grid').parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('px-4');
  });

  describe('Breakpoint-specific behavior', () => {
    test('handles xs screens (< 640px)', () => {
      mockViewport(375, 667);
      render(<TailwindResponsiveComponent />);
      
      const mobileOnly = screen.getByTestId('mobile-only');
      expect(mobileOnly).toBeVisible();
    });

    test('handles sm screens (640px+)', () => {
      mockViewport(640, 800);
      render(<TailwindResponsiveComponent />);
      
      const tabletOnly = screen.getByTestId('tablet-only');
      expect(tabletOnly).toHaveClass('sm:block');
    });

    test('handles md screens (768px+)', () => {
      mockViewport(768, 1024);
      render(<TailwindResponsiveComponent />);
      
      const desktopPlus = screen.getByTestId('desktop-plus');
      expect(desktopPlus).toHaveClass('md:block');
    });

    test('handles lg screens (1024px+)', () => {
      mockViewport(1024, 768);
      render(<TailwindResponsiveComponent />);
      
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    test('handles xl screens (1280px+)', () => {
      mockViewport(1280, 800);
      render(<TailwindResponsiveComponent />);
      
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveClass('xl:grid-cols-6');
    });
  });

  describe('Theme integration', () => {
    test('applies correct theme classes in light mode', () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      
      render(<TailwindResponsiveComponent />);
      
      const darkModeElement = screen.getByTestId('dark-mode-styles');
      expect(darkModeElement).toHaveClass('bg-white');
      expect(darkModeElement).toHaveClass('text-gray-900');
    });

    test('applies correct theme classes in dark mode', () => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      
      render(<TailwindResponsiveComponent />);
      
      const darkModeElement = screen.getByTestId('dark-mode-styles');
      expect(darkModeElement).toHaveClass('dark:bg-gray-800');
      expect(darkModeElement).toHaveClass('dark:text-gray-100');
    });
  });
});