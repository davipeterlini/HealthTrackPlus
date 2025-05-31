#!/bin/bash

echo "🎭 Executando testes End-to-End com Playwright..."

# Install Playwright browsers if needed
npx playwright install --with-deps

# Run E2E tests
npx playwright test

echo "✅ Testes E2E concluídos!"