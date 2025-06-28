
#!/bin/bash

echo "🔍 Verificando dependências para desenvolvimento móvel..."

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js não encontrado"
fi

# Verificar NPM
if command -v npm &> /dev/null; then
    echo "✅ NPM: $(npm --version)"
else
    echo "❌ NPM não encontrado"
fi

# Verificar Java
if command -v java &> /dev/null; then
    echo "✅ Java: $(java --version | head -n1)"
else
    echo "❌ Java não encontrado - necessário para Android"
fi

# Verificar Android SDK
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK encontrado em: $ANDROID_HOME"
else
    echo "❌ Android SDK não encontrado - ANDROID_HOME não definido"
fi

# Verificar ADB
if command -v adb &> /dev/null; then
    echo "✅ ADB: $(adb --version | head -n1)"
else
    echo "❌ ADB não encontrado"
fi

# Verificar emulador Android
if command -v emulator &> /dev/null; then
    echo "✅ Android Emulator encontrado"
else
    echo "❌ Android Emulator não encontrado"
fi

# Verificar Xcode (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        echo "✅ Xcode: $(xcodebuild -version | head -n1)"
    else
        echo "❌ Xcode não encontrado"
    fi
    
    if command -v xcrun &> /dev/null; then
        echo "✅ Xcode Command Line Tools encontrado"
    else
        echo "❌ Xcode Command Line Tools não encontrado"
    fi
else
    echo "⚠️ Sistema não é macOS - iOS não disponível"
fi

echo ""
echo "📋 Resumo:"
echo "- Para Android: Instale Java, Android SDK, e configure ANDROID_HOME"
echo "- Para iOS: macOS + Xcode são obrigatórios"
echo "- Execute os scripts de setup antes de fazer o build"
