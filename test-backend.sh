#!/bin/bash

echo "🧪 Executando testes unitários do backend..."

# Roda os testes do backend com Vitest
npx vitest run server/test/

echo "✅ Testes do backend concluídos!"