
#!/bin/bash

echo "🔧 Configurando plataformas móveis..."

# Verificar se o Capacitor está inicializado
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚠️  capacitor.config.ts não encontrado. Execute o build primeiro."
    exit 1
fi

# Adicionar plataformas
echo "📱 Adicionando plataforma iOS..."
npx cap add ios

echo "🤖 Adicionando plataforma Android..."
npx cap add android

# Instalar plugins necessários
echo "🔌 Instalando plugins nativos..."
npm install @capacitor/camera @capacitor/device @capacitor/app @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen @capacitor/filesystem @capacitor/preferences @capacitor/share @capacitor/browser @capacitor/network @capacitor/geolocation

# Sincronizar
echo "🔄 Sincronizando plataformas..."
npx cap sync

echo "✅ Plataformas configuradas com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. Execute 'npm run build:mobile' para fazer o build"
echo "2. Use 'npx cap open ios' para abrir no Xcode"
echo "3. Use 'npx cap open android' para abrir no Android Studio"
