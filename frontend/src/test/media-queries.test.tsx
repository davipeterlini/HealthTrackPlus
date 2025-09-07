import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';

// Mock matchMedia for testing media queries
const createMatchMedia = (width: number) => {
  return vi.fn().mockImplementation(query => {
    const breakpoints = {
      '(min-width: 1280px)': width >= 1280, // xl
      '(min-width: 1024px)': width >= 1024, // lg
      '(min-width: 768px)': width >= 768,   // md
      '(min-width: 640px)': width >= 640,   // sm
      '(max-width: 639px)': width < 640,    // mobile
      '(max-width: 767px)': width < 768,    // mobile and small tablet
      '(max-width: 1023px)': width < 1024,  // everything below lg
      '(prefers-color-scheme: dark)': false, // default to light
    };

    const matches = breakpoints[query as keyof typeof breakpoints] ?? false;

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
};

// Test component that uses CSS media queries and responsive behavior
const MediaQueryTestComponent = () => {
  return (
    <div>
      {/* Component that changes based on screen size */}
      <div data-testid="responsive-container" className="w-full">
        {/* Mobile Layout */}
        <div className="block md:hidden" data-testid="mobile-layout">
          <h1 className="text-xl">Mobile View</h1>
          <nav className="flex flex-col space-y-2">
            <a href="#" className="p-2 border rounded">Home</a>
            <a href="#" className="p-2 border rounded">About</a>
          </nav>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden" data-testid="tablet-layout">
          <h1 className="text-2xl">Tablet View</h1>
          <nav className="flex space-x-4">
            <a href="#" className="p-2 border rounded">Home</a>
            <a href="#" className="p-2 border rounded">About</a>
            <a href="#" className="p-2 border rounded">Services</a>
          </nav>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block" data-testid="desktop-layout">
          <h1 className="text-3xl">Desktop View</h1>
          <nav className="flex space-x-6">
            <a href="#" className="p-3 border rounded">Home</a>
            <a href="#" className="p-3 border rounded">About</a>
            <a href="#" className="p-3 border rounded">Services</a>
            <a href="#" className="p-3 border rounded">Contact</a>
          </nav>
        </div>

        {/* Grid that adapts to screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8" data-testid="adaptive-grid">
          <div className="bg-gray-100 p-4 rounded">Item 1</div>
          <div className="bg-gray-100 p-4 rounded">Item 2</div>
          <div className="bg-gray-100 p-4 rounded">Item 3</div>
          <div className="bg-gray-100 p-4 rounded">Item 4</div>
          <div className="bg-gray-100 p-4 rounded">Item 5</div>
          <div className="bg-gray-100 p-4 rounded">Item 6</div>
        </div>

        {/* Text that scales with screen size */}
        <div className="mt-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold" data-testid="scaling-text">
            Responsive Typography
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2" data-testid="scaling-paragraph">
            This text scales with the viewport size using Tailwind's responsive typography classes.
          </p>
        </div>

        {/* Sidebar that appears/disappears */}
        <div className="flex mt-8">
          <aside className="hidden lg:block w-64 bg-gray-200 p-4 mr-4" data-testid="sidebar">
            <h3 className="font-semibold mb-4">Sidebar</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600">Link 1</a></li>
              <li><a href="#" className="text-blue-600">Link 2</a></li>
              <li><a href="#" className="text-blue-600">Link 3</a></li>
            </ul>
          </aside>
          
          <main className="flex-1 bg-white p-4" data-testid="main-content">
            <h3 className="text-xl font-semibold mb-4">Main Content</h3>
            <p>This main content area adjusts its width based on whether the sidebar is visible.</p>
          </main>
        </div>

        {/* Container with responsive padding and margins */}
        <div 
          className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 bg-blue-50 rounded-lg mt-8"
          data-testid="responsive-spacing"
        >
          <p>This container has responsive margins and padding that increase with screen size.</p>
        </div>
      </div>
    </div>
  );
};

// Helper to simulate viewport changes
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  window.matchMedia = createMatchMedia(width);
  
  // Trigger resize event
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

describe('Media Queries and Breakpoint System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Breakpoint (< 640px)', () => {
    beforeEach(() => {
      setViewportWidth(375);
    });

    test('shows mobile layout', () => {
      render(<MediaQueryTestComponent />);
      
      const mobileLayout = screen.getByTestId('mobile-layout');
      const tabletLayout = screen.getByTestId('tablet-layout');
      const desktopLayout = screen.getByTestId('desktop-layout');

      expect(mobileLayout).toHaveClass('block', 'md:hidden');
      expect(tabletLayout).toHaveClass('hidden', 'md:block', 'lg:hidden');
      expect(desktopLayout).toHaveClass('hidden', 'lg:block');
    });

    test('applies single column grid', () => {
      render(<MediaQueryTestComponent />);
      
      const grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    test('applies mobile typography sizes', () => {
      render(<MediaQueryTestComponent />);
      
      const scalingText = screen.getByTestId('scaling-text');
      expect(scalingText).toHaveClass('text-lg');
    });

    test('hides sidebar on mobile', () => {
      render(<MediaQueryTestComponent />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('hidden', 'lg:block');
    });
  });

  describe('Small Tablet Breakpoint (640px - 767px)', () => {
    beforeEach(() => {
      setViewportWidth(640);
    });

    test('shows two column grid', () => {
      render(<MediaQueryTestComponent />);
      
      const grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('sm:grid-cols-2');
    });

    test('increases text size', () => {
      render(<MediaQueryTestComponent />);
      
      const scalingText = screen.getByTestId('scaling-text');
      expect(scalingText).toHaveClass('sm:text-xl');
    });

    test('increases responsive spacing', () => {
      render(<MediaQueryTestComponent />);
      
      const spacing = screen.getByTestId('responsive-spacing');
      expect(spacing).toHaveClass('sm:mx-4', 'sm:px-4');
    });
  });

  describe('Tablet Breakpoint (768px - 1023px)', () => {
    beforeEach(() => {
      setViewportWidth(768);
    });

    test('shows tablet layout', () => {
      render(<MediaQueryTestComponent />);
      
      const mobileLayout = screen.getByTestId('mobile-layout');
      const tabletLayout = screen.getByTestId('tablet-layout');
      
      expect(mobileLayout).toHaveClass('md:hidden');
      expect(tabletLayout).toHaveClass('md:block', 'lg:hidden');
    });

    test('applies medium typography', () => {
      render(<MediaQueryTestComponent />);
      
      const scalingText = screen.getByTestId('scaling-text');
      expect(scalingText).toHaveClass('md:text-2xl');
    });

    test('still hides sidebar', () => {
      render(<MediaQueryTestComponent />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('hidden', 'lg:block');
    });
  });

  describe('Desktop Breakpoint (1024px+)', () => {
    beforeEach(() => {
      setViewportWidth(1024);
    });

    test('shows desktop layout', () => {
      render(<MediaQueryTestComponent />);
      
      const desktopLayout = screen.getByTestId('desktop-layout');
      expect(desktopLayout).toHaveClass('lg:block');
      expect(desktopLayout).not.toHaveClass('hidden');
    });

    test('shows three column grid', () => {
      render(<MediaQueryTestComponent />);
      
      const grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    test('shows sidebar', () => {
      render(<MediaQueryTestComponent />);
      
      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('lg:block');
      expect(sidebar).not.toHaveClass('hidden');
    });

    test('applies large typography', () => {
      render(<MediaQueryTestComponent />);
      
      const scalingText = screen.getByTestId('scaling-text');
      expect(scalingText).toHaveClass('lg:text-3xl');
    });
  });

  describe('Extra Large Breakpoint (1280px+)', () => {
    beforeEach(() => {
      setViewportWidth(1280);
    });

    test('shows four column grid', () => {
      render(<MediaQueryTestComponent />);
      
      const grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('xl:grid-cols-4');
    });

    test('applies extra large typography', () => {
      render(<MediaQueryTestComponent />);
      
      const scalingText = screen.getByTestId('scaling-text');
      expect(scalingText).toHaveClass('xl:text-4xl');
    });

    test('applies maximum responsive spacing', () => {
      render(<MediaQueryTestComponent />);
      
      const spacing = screen.getByTestId('responsive-spacing');
      expect(spacing).toHaveClass('xl:mx-12', 'xl:px-12');
    });
  });

  describe('Dynamic Viewport Changes', () => {
    test('adapts when viewport changes from mobile to desktop', () => {
      // Start mobile
      setViewportWidth(375);
      render(<MediaQueryTestComponent />);
      
      let sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('hidden');
      
      // Change to desktop
      setViewportWidth(1024);
      
      sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('lg:block');
    });

    test('grid columns adapt to viewport changes', () => {
      // Start with mobile (1 column)
      setViewportWidth(375);
      render(<MediaQueryTestComponent />);
      
      let grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('grid-cols-1');
      
      // Change to tablet (2 columns)
      setViewportWidth(640);
      grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('sm:grid-cols-2');
      
      // Change to desktop (3 columns)
      setViewportWidth(1024);
      grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('lg:grid-cols-3');
      
      // Change to extra large (4 columns)
      setViewportWidth(1280);
      grid = screen.getByTestId('adaptive-grid');
      expect(grid).toHaveClass('xl:grid-cols-4');
    });
  });

  describe('CSS Classes Validation', () => {
    test('all responsive classes are properly applied', () => {
      render(<MediaQueryTestComponent />);
      
      const container = screen.getByTestId('responsive-container');
      const grid = screen.getByTestId('adaptive-grid');
      const text = screen.getByTestId('scaling-text');
      
      // Verify container classes
      expect(container).toHaveClass('w-full');
      
      // Verify grid classes
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-4');
      
      // Verify text classes
      expect(text).toHaveClass('text-lg', 'sm:text-xl', 'md:text-2xl', 'lg:text-3xl', 'xl:text-4xl', 'font-bold');
    });

    test('spacing classes are correctly applied', () => {
      render(<MediaQueryTestComponent />);
      
      const spacing = screen.getByTestId('responsive-spacing');
      expect(spacing).toHaveClass(
        'mx-2', 'sm:mx-4', 'md:mx-6', 'lg:mx-8', 'xl:mx-12',
        'px-2', 'sm:px-4', 'md:px-6', 'lg:px-8', 'xl:px-12'
      );
    });
  });
});