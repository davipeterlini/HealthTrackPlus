#!/bin/bash

echo "🧪 Executando todos os testes unitários..."

# Roda os testes do frontend
echo "📱 Testes do Frontend:"
npx vitest run client/src/ --reporter=basic

echo ""

# Roda os testes do backend  
echo "🖥️ Testes do Backend:"
npx vitest run server/test/ --reporter=basic

echo ""
echo "✅ Todos os testes concluídos!"