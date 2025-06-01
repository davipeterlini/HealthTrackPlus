import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useTheme, ThemeProvider } from './use-theme';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  test('provides theme state and toggle function', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    expect(result.current.theme).toBeDefined();
    expect(result.current.setTheme).toBeDefined();
    expect(typeof result.current.setTheme).toBe('function');
  });

  test('toggles between light and dark themes', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    const initialTheme = result.current.theme;
    
    act(() => {
      result.current.setTheme(initialTheme === 'light' ? 'dark' : 'light');
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  test('supports system theme preference', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
  });
});