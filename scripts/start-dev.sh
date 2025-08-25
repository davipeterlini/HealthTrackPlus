#!/bin/bash

echo "🚀 Iniciando servidor de desenvolvimento..."

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
    echo "⚠️ Não foi possível detectar o IP local automaticamente."
    echo "Usando localhost como fallback."
    IP="localhost"
fi

echo "📡 Endereço de rede: $IP"

# Check if capacitor.config.ts exists and update it for mobile development
if [ -f "capacitor.config.ts" ]; then
    echo "📱 Configurando para desenvolvimento mobile em $IP:5001"
    
    # Backup da configuração original
    cp capacitor.config.ts capacitor.config.ts.backup
    
    # Atualizar configuração do Capacitor usando método compatível com todos os sistemas
    if [ "$OS" = "Darwin" ]; then
        # macOS requires different sed syntax
        sed -i '' "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5001',|g" capacitor.config.ts
        sed -i '' "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
    else
        # Linux and other systems
        sed -i "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5001',|g" capacitor.config.ts
        sed -i "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
    fi
    
    echo "✅ Configuração Capacitor atualizada"
fi

# Start the server in development mode
echo "🌐 Iniciando servidor em http://$IP:5001"
echo "⌛ Aguarde..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ Arquivo .env não encontrado. Copiando sample.env para .env..."
    cp sample.env .env
    echo "✅ Arquivo .env criado. Por favor, verifique as configurações."
fi

# Start vite dev server with environment variables
echo "🔄 Carregando variáveis de ambiente de .env"
export $(grep -v '^#' .env | xargs)
VITE_HOST=$IP npm run dev