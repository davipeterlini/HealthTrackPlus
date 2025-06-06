
#!/bin/bash

echo "🚀 Iniciando build para dispositivos móveis..."

# Verificar se o Capacitor está instalado
if ! command -v cap &> /dev/null; then
    echo "❌ Capacitor CLI não está instalado. Instalando..."
    npm install -g @capacitor/cli
fi

# Build do frontend
echo "📦 Fazendo build do frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do frontend"
    exit 1
fi

cd ..

# Sincronizar com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync

# Verificar se as plataformas existem
if [ ! -d "ios" ]; then
    echo "📱 Adicionando plataforma iOS..."
    npx cap add ios
fi

if [ ! -d "android" ]; then
    echo "🤖 Adicionando plataforma Android..."
    npx cap add android
fi

# Copiar assets e sync final
echo "📋 Copiando assets e fazendo sync final..."
npx cap copy
npx cap sync

echo "✅ Build concluído com sucesso!"
echo ""
echo "Para abrir no Xcode (iOS):"
echo "npx cap open ios"
echo ""
echo "Para abrir no Android Studio:"
echo "npx cap open android"
echo ""
echo "Para executar no dispositivo:"
echo "npx cap run ios"
echo "npx cap run android"
