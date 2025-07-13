
#!/bin/bash

echo "🚀 Iniciando build e deploy para emuladores..."

# Configurar variáveis de ambiente
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Função para verificar se o backend está rodando
check_backend() {
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✅ Backend está rodando na porta 5000"
        return 0
    else
        echo "❌ Backend não está rodando. Inicie com 'npm run dev' em outro terminal"
        return 1
    fi
}

# Função para build do projeto
build_project() {
    echo "📦 Fazendo build do frontend..."
    cd frontend
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Erro no build do frontend"
        exit 1
    fi
    cd ..
    
    echo "🔄 Sincronizando com Capacitor..."
    npx cap sync
}

# Função para build Android
build_android() {
    echo "🤖 Fazendo build do Android..."
    cd android
    
    echo "Gerando APK de debug..."
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ APK gerado com sucesso em: android/app/build/outputs/apk/debug/app-debug.apk"
        cd ..
        return 0
    else
        echo "❌ Erro no build do Android"
        cd ..
        return 1
    fi
}

# Função para build iOS (apenas macOS)
build_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "⚠️ Build do iOS só é possível no macOS"
        return 1
    fi
    
    echo "📱 Fazendo build do iOS..."
    cd ios/App
    
    echo "Fazendo build do projeto iOS..."
    xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 14' build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build do iOS concluído com sucesso"
        cd ../..
        return 0
    else
        echo "❌ Erro no build do iOS"
        cd ../..
        return 1
    fi
}

# Função para iniciar emulador Android
start_android_emulator() {
    echo "🤖 Iniciando emulador Android..."
    
    # Verificar se o emulador existe
    if ! avdmanager list avd | grep -q "HealthApp_Emulator"; then
        echo "Criando emulador Android..."
        avdmanager create avd -n "HealthApp_Emulator" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force
    fi
    
    # Iniciar emulador em background
    emulator -avd HealthApp_Emulator -no-snapshot-save -no-boot-anim &
    ANDROID_PID=$!
    
    echo "Aguardando emulador inicializar..."
    adb wait-for-device
    sleep 10
    
    echo "Instalando APK no emulador..."
    adb install -r android/app/build/outputs/apk/debug/app-debug.apk
    
    if [ $? -eq 0 ]; then
        echo "✅ APK instalado com sucesso!"
        echo "Iniciando aplicativo..."
        adb shell am start -n com.healthapp.mobile/.MainActivity
    else
        echo "❌ Erro ao instalar APK"
    fi
}

# Função para iniciar simulador iOS
start_ios_simulator() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "⚠️ Simulador iOS só é possível no macOS"
        return 1
    fi
    
    echo "📱 Iniciando simulador iOS..."
    
    # Listar dispositivos disponíveis e pegar iPhone 14
    DEVICE_ID=$(xcrun simctl list devices | grep "iPhone 14 (" | head -n1 | sed 's/.*(\([^)]*\)).*/\1/')
    
    if [ -z "$DEVICE_ID" ]; then
        echo "❌ iPhone 14 não encontrado nos simuladores"
        return 1
    fi
    
    echo "Iniciando iPhone 14 simulador..."
    xcrun simctl boot "$DEVICE_ID"
    open -a Simulator
    
    sleep 5
    
    echo "Instalando app no simulador..."
    xcrun simctl install "$DEVICE_ID" ios/App/build/Debug-iphonesimulator/App.app
    
    echo "Iniciando aplicativo..."
    xcrun simctl launch "$DEVICE_ID" com.healthapp.mobile
}

# Função principal
main() {
    echo "Escolha uma opção:"
    echo "1) Build e rodar no Android"
    echo "2) Build e rodar no iOS (macOS apenas)"
    echo "3) Build e rodar em ambos"
    echo "4) Apenas fazer build (sem rodar)"
    
    read -p "Digite sua escolha (1-4): " choice
    
    # Verificar backend
    if ! check_backend; then
        read -p "Deseja continuar mesmo assim? (y/n): " continue_choice
        if [[ $continue_choice != "y" ]]; then
            exit 1
        fi
    fi
    
    # Build do projeto
    build_project
    
    case $choice in
        1)
            if build_android; then
                start_android_emulator
            fi
            ;;
        2)
            if build_ios; then
                start_ios_simulator
            fi
            ;;
        3)
            android_success=false
            ios_success=false
            
            if build_android; then
                android_success=true
            fi
            
            if build_ios; then
                ios_success=true
            fi
            
            if $android_success; then
                start_android_emulator &
            fi
            
            if $ios_success; then
                start_ios_simulator &
            fi
            ;;
        4)
            build_android
            build_ios
            echo "✅ Builds concluídos!"
            ;;
        *)
            echo "❌ Opção inválida"
            exit 1
            ;;
    esac
}

# Executar função principal
main
