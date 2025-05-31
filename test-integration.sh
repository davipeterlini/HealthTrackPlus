#!/bin/bash

echo "🔄 Executando testes de integração completos..."

echo "1. Testes unitários do frontend:"
npx vitest run client/src/ --reporter=verbose

echo ""
echo "2. Testes unitários do backend:"
npx vitest run server/test/ --reporter=verbose

echo ""
echo "3. Testes de integração E2E:"
npx playwright test --reporter=line

echo ""
echo "✅ Todos os testes de integração concluídos!"