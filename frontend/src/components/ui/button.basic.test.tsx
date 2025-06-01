import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Button } from './button';

describe('Button Component - Basic Tests', () => {
  it('should render button element', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should display button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});