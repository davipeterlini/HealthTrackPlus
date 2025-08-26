#!/bin/bash

echo "🚀 Configurando desenvolvimento local para móvel..."

# Detect operating system
OS=$(uname)

# Get local IP based on OS
if [ "$OS" = "Darwin" ]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n 1 | awk '{print $2}')
elif [ "$OS" = "Linux" ]; then
    # Linux
    IP=$(ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d/ -f1 | head -n 1)
else
    # Windows with Git Bash or other
    IP=$(ipconfig | grep -i "IPv4" | head -n 1 | awk '{print $NF}')
fi

if [ -z "$IP" ]; then
    echo "❌ Não foi possível detectar o IP local automaticamente."
    echo "Por favor, descubra seu IP local e edite capacitor.config.ts manualmente."
    echo "Execute: ip addr show (Linux), ifconfig (macOS) ou ipconfig (Windows)"
    exit 1
fi

echo "📱 IP local detectado: $IP"

# Check if capacitor.config.ts exists
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Arquivo capacitor.config.ts não encontrado."
    echo "Verifique se você está executando o script do diretório raiz do projeto."
    exit 1
fi

# Backup da configuração original
cp capacitor.config.ts capacitor.config.ts.backup

# Atualizar configuração do Capacitor usando método compatível com todos os sistemas
if [ "$OS" = "Darwin" ]; then
    # macOS requires different sed syntax
    sed -i '' "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5000',|g" capacitor.config.ts
    sed -i '' "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
else
    # Linux and other systems
    sed -i "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5000',|g" capacitor.config.ts
    sed -i "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
fi

echo "✅ Configuração atualizada para desenvolvimento local"
echo "🔧 Servidor configurado em: http://$IP:5000"

# Build do frontend
echo "📦 Fazendo build do frontend..."
npm run build:frontend

# Check if npx is available
if command -v npx &> /dev/null; then
    # Sync com Capacitor
    echo "🔄 Sincronizando com Capacitor..."
    npx cap sync
else
    echo "❌ npx não encontrado. Certifique-se de que o Node.js está instalado corretamente."
    exit 1
fi

echo "✅ Configuração concluída!"
echo ""
echo "Próximos passos:"
echo "1. Inicie o backend: npm run dev"
echo "2. Para iOS: npx cap open ios"
echo "3. Para Android: npx cap open android"
echo ""
echo "⚠️  Para reverter as configurações: npm run dev:reset"