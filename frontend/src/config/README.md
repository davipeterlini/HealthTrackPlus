# HealthTrackPlus Configuration System

This document outlines the centralized configuration system for the HealthTrackPlus application. The configuration system is designed to provide consistent styling, behavior, and functionality across all components and pages.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Configuration Modules](#configuration-modules)
  - [Responsive Configuration](#responsive-configuration)
  - [Theme Configuration](#theme-configuration)
  - [Internationalization (i18n) Configuration](#internationalization-i18n-configuration)
  - [Component Configuration](#component-configuration)
- [Usage](#usage)
  - [Importing Configuration](#importing-configuration)
  - [Using in Components](#using-in-components)

## Overview

The configuration system centralizes all application settings in the `frontend/src/config` directory. This approach offers several benefits:

- **Consistency**: Ensures consistent styling and behavior across the application
- **Maintainability**: Makes it easier to update global settings in one place
- **Scalability**: Facilitates adding new features and components with consistent styling
- **Reusability**: Promotes code reuse by abstracting common configuration

## Directory Structure

```
frontend/src/config/
├── index.ts                   # Main entry point for all configurations
├── responsive/                # Responsive design configuration
│   ├── breakpoints.ts         # Screen breakpoints and device types
│   ├── layout.ts              # Layout settings for different devices
│   ├── utilities.ts           # Responsive utility functions
│   └── index.ts               # Module entry point
├── theme/                     # Theme configuration
│   ├── colors.ts              # Color system definitions
│   ├── themeConfig.ts         # Theme settings (shadows, radii, etc.)
│   ├── utilities.ts           # Theme utility functions
│   └── index.ts               # Module entry point
├── i18n/                      # Internationalization configuration
│   ├── config.ts              # i18n settings and languages
│   ├── format.ts              # Formatting utilities for i18n
│   ├── initialize.ts          # i18n initialization
│   └── index.ts               # Module entry point
└── components/                # Component configuration
    ├── button.ts              # Button component config
    ├── badge.ts               # Badge component config
    ├── card.ts                # Card component config
    ├── form.ts                # Form components config
    ├── navigation.ts          # Navigation components config
    └── index.ts               # Module entry point
```

## Configuration Modules

### Responsive Configuration

The responsive configuration module handles all aspects related to responsive design:

- **Breakpoints**: Defines screen size breakpoints and device types
- **Layout**: Contains layout settings for different device types
- **Utilities**: Provides utility functions for responsive design

Key files:
- `responsive/breakpoints.ts`: Contains screen breakpoints and device type definitions
- `responsive/layout.ts`: Layout configuration for different device sizes
- `responsive/utilities.ts`: Helper functions for responsive styling

### Theme Configuration

The theme configuration module manages the application's theming system:

- **Colors**: Defines color palettes for light and dark modes
- **Theme Settings**: Contains settings for shadows, borders, animations, etc.
- **Utilities**: Provides functions for theme-aware styling

Key files:
- `theme/colors.ts`: Color system definitions for light and dark modes
- `theme/themeConfig.ts`: Theme-related settings like shadows, border radii, etc.
- `theme/utilities.ts`: Helper functions for theme manipulation

### Internationalization (i18n) Configuration

The i18n configuration module handles all internationalization aspects:

- **Languages**: Defines available languages and locales
- **Formatting**: Provides utilities for date, number, and currency formatting
- **Initialization**: Sets up the i18n system

Key files:
- `i18n/config.ts`: i18n settings and language definitions
- `i18n/format.ts`: Formatting utilities for different locales
- `i18n/initialize.ts`: i18n system initialization

### Component Configuration

The component configuration module defines styling and behavior for UI components:

- **Button**: Configuration for button variants, sizes, and styling
- **Badge**: Configuration for badge variants and styling
- **Card**: Configuration for card components and layouts
- **Form**: Configuration for form elements like inputs, selects, etc.
- **Navigation**: Configuration for navigation components

Key files:
- `components/button.ts`: Button component configuration
- `components/badge.ts`: Badge component configuration
- `components/card.ts`: Card component configuration
- `components/form.ts`: Form elements configuration
- `components/navigation.ts`: Navigation components configuration

## Usage

### Importing Configuration

Import configuration modules directly from the main config entry point:

```tsx
import { responsive, theme, i18n, components } from '@/config';

// Or import specific modules
import { BREAKPOINTS, getDeviceTypeFromWidth } from '@/config/responsive';
import { COLORS, LIGHT_THEME, DARK_THEME } from '@/config/theme';
```

### Using in Components

Example of using configuration in a component:

```tsx
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/config/components';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--button-border-radius)]...",
  {
    variants: {
      variant: {
        default: BUTTON_VARIANTS.default.base,
        destructive: BUTTON_VARIANTS.destructive.base,
        // ...
      },
      size: {
        sm: BUTTON_SIZES.sm,
        md: BUTTON_SIZES.md,
        // ...
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

For responsive utilities:

```tsx
import { getResponsiveGrid, getResponsiveSpacing } from '@/config/responsive';

function MyComponent() {
  return (
    <div className={getResponsiveGrid(2)}>
      <div className={getResponsiveSpacing('m', 'y', 'md')}>
        {/* Content */}
      </div>
    </div>
  );
}
```

For theme utilities:

```tsx
import { useTheme } from '@/hooks/use-theme';
import { getThemeColor, cssColor } from '@/config/theme';

function ThemedComponent() {
  const { theme } = useTheme();
  const backgroundColor = getThemeColor(theme, 'primary');
  
  return (
    <div style={{ backgroundColor: cssColor(backgroundColor) }}>
      {/* Content */}
    </div>
  );
}
```