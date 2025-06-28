
#!/bin/bash

echo "🚀 Configurando desenvolvimento local para móvel..."

# Obter IP local
IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)

if [ -z "$IP" ]; then
    echo "❌ Não foi possível detectar o IP local automaticamente."
    echo "Por favor, descubra seu IP local e edite capacitor.config.ts manualmente."
    echo "Execute: ip addr show (Linux) ou ifconfig (macOS)"
    exit 1
fi

echo "📱 IP local detectado: $IP"

# Backup da configuração original
cp capacitor.config.ts capacitor.config.ts.backup

# Atualizar configuração do Capacitor
sed -i.tmp "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5000',|g" capacitor.config.ts
sed -i.tmp "s|// cleartext: true|cleartext: true|g" capacitor.config.ts

echo "✅ Configuração atualizada para desenvolvimento local"
echo "🔧 Servidor configurado em: http://$IP:5000"

# Build do frontend
echo "📦 Fazendo build do frontend..."
cd frontend
npm run build
cd ..

# Sync com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync

echo "✅ Configuração concluída!"
echo ""
echo "Próximos passos:"
echo "1. Inicie o backend: npm run dev"
echo "2. Para iOS: npx cap open ios"
echo "3. Para Android: npx cap open android"
echo ""
echo "⚠️  Para reverter as configurações: mv capacitor.config.ts.backup capacitor.config.ts"
