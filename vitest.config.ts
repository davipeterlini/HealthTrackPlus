/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'client/src/test/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts',
        'server/',
      ],
    },
    include: [
      'client/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'server/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'
    ],
  },
});