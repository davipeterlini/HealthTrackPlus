
#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar pré-requisitos
check_prerequisites() {
    print_status "Verificando pré-requisitos..."
    
    local missing_deps=()
    
    # Verificar Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    # Verificar Capacitor CLI
    if ! command_exists cap; then
        print_warning "Capacitor CLI não encontrado. Instalando..."
        npm install -g @capacitor/cli
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Dependências faltando: ${missing_deps[*]}"
        exit 1
    fi
    
    print_success "Pré-requisitos verificados!"
}

# Função para obter IP local
get_local_ip() {
    local ip
    ip=$(hostname -I | awk '{print $1}' 2>/dev/null || ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
    
    if [ -z "$ip" ]; then
        print_error "Não foi possível detectar o IP local automaticamente."
        read -p "Digite seu IP local: " ip
    fi
    
    echo "$ip"
}

# Função para configurar backend local
setup_local_backend() {
    print_status "Configurando backend para desenvolvimento local..."
    
    local ip="$1"
    
    # Backup da configuração
    if [ -f "capacitor.config.ts" ]; then
        cp capacitor.config.ts capacitor.config.ts.backup
    fi
    
    # Atualizar configuração do Capacitor
    sed -i.tmp "s|// url: 'http://.*:5000',|url: 'http://$ip:5000',|g" capacitor.config.ts
    sed -i.tmp "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
    
    print_success "Backend configurado para http://$ip:5000"
}

# Função para fazer build do frontend
build_frontend() {
    print_status "Fazendo build do frontend..."
    
    cd frontend || exit 1
    npm run build
    local exit_code=$?
    cd .. || exit 1
    
    if [ $exit_code -ne 0 ]; then
        print_error "Erro no build do frontend"
        exit 1
    fi
    
    print_success "Build do frontend concluído!"
}

# Função para adicionar plataformas
add_platforms() {
    print_status "Adicionando plataformas móveis..."
    
    # Verificar se as plataformas já existem
    if [ ! -d "ios" ]; then
        print_status "Adicionando plataforma iOS..."
        npx cap add ios
    else
        print_warning "Plataforma iOS já existe"
    fi
    
    if [ ! -d "android" ]; then
        print_status "Adicionando plataforma Android..."
        npx cap add android
    else
        print_warning "Plataforma Android já existe"
    fi
    
    print_success "Plataformas adicionadas!"
}

# Função para instalar plugins nativos
install_native_plugins() {
    print_status "Instalando plugins nativos do Capacitor..."
    
    npm install @capacitor/camera @capacitor/device @capacitor/app @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen @capacitor/filesystem @capacitor/preferences @capacitor/share @capacitor/browser @capacitor/network @capacitor/geolocation
    
    print_success "Plugins nativos instalados!"
}

# Função para sincronizar com Capacitor
sync_capacitor() {
    print_status "Sincronizando com Capacitor..."
    
    npx cap sync
    
    print_success "Sincronização concluída!"
}

# Função para verificar Android SDK
check_android_sdk() {
    print_status "Verificando Android SDK..."
    
    if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
        print_warning "ANDROID_HOME não configurado. Tentando detectar automaticamente..."
        
        # Locais comuns do Android SDK
        local possible_paths=(
            "$HOME/Android/Sdk"
            "$HOME/Library/Android/sdk"
            "/usr/local/android-sdk"
            "/opt/android-sdk"
        )
        
        for path in "${possible_paths[@]}"; do
            if [ -d "$path" ]; then
                export ANDROID_HOME="$path"
                export ANDROID_SDK_ROOT="$path"
                export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
                print_success "Android SDK encontrado em: $path"
                break
            fi
        done
        
        if [ -z "$ANDROID_HOME" ]; then
            print_error "Android SDK não encontrado. Por favor, instale o Android Studio e configure ANDROID_HOME"
            return 1
        fi
    fi
    
    # Verificar se adb está disponível
    if ! command_exists adb; then
        print_error "ADB não encontrado. Verifique a instalação do Android SDK"
        return 1
    fi
    
    print_success "Android SDK configurado!"
    return 0
}

# Função para criar AVD (Android Virtual Device)
create_android_emulator() {
    print_status "Configurando emulador Android..."
    
    if ! check_android_sdk; then
        return 1
    fi
    
    local avd_name="HealthTracker_Emulator"
    local system_image="system-images;android-31;google_apis;x86_64"
    
    # Verificar se o emulador já existe
    if $ANDROID_HOME/emulator/emulator -list-avds | grep -q "$avd_name"; then
        print_warning "Emulador '$avd_name' já existe"
    else
        print_status "Criando emulador Android '$avd_name'..."
        
        # Instalar system image se necessário
        yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "$system_image"
        
        # Criar AVD
        echo "no" | $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n "$avd_name" -k "$system_image" --device "pixel"
        
        print_success "Emulador Android criado!"
    fi
    
    return 0
}

# Função para iniciar emulador Android
start_android_emulator() {
    print_status "Iniciando emulador Android..."
    
    local avd_name="HealthTracker_Emulator"
    
    # Verificar se o emulador já está rodando
    if adb devices | grep -q "emulator"; then
        print_warning "Emulador Android já está rodando"
        return 0
    fi
    
    # Iniciar emulador em background
    nohup $ANDROID_HOME/emulator/emulator -avd "$avd_name" > /dev/null 2>&1 &
    
    print_status "Aguardando emulador inicializar..."
    
    # Aguardar emulador ficar online
    local timeout=300 # 5 minutos
    local count=0
    
    while [ $count -lt $timeout ]; do
        if adb devices | grep -q "device$"; then
            print_success "Emulador Android iniciado!"
            return 0
        fi
        sleep 2
        count=$((count + 2))
    done
    
    print_error "Timeout aguardando emulador Android"
    return 1
}

# Função para fazer build e executar no Android
build_and_run_android() {
    print_status "Fazendo build e executando no Android..."
    
    if ! create_android_emulator; then
        print_error "Falha ao configurar emulador Android"
        return 1
    fi
    
    if ! start_android_emulator; then
        print_error "Falha ao iniciar emulador Android"
        return 1
    fi
    
    # Build e instalação
    print_status "Instalando aplicativo no emulador Android..."
    npx cap run android
    
    print_success "Aplicativo Android executando!"
}

# Função para verificar Xcode (apenas macOS)
check_xcode() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_error "iOS development só é possível no macOS"
        return 1
    fi
    
    if ! command_exists xcodebuild; then
        print_error "Xcode não está instalado. Por favor, instale o Xcode da App Store"
        return 1
    fi
    
    print_success "Xcode encontrado!"
    return 0
}

# Função para configurar iOS Simulator
setup_ios_simulator() {
    print_status "Configurando iOS Simulator..."
    
    if ! check_xcode; then
        return 1
    fi
    
    # Listar simuladores disponíveis
    local simulators=$(xcrun simctl list devices available | grep "iPhone" | head -n 1)
    
    if [ -z "$simulators" ]; then
        print_error "Nenhum simulador iOS disponível"
        return 1
    fi
    
    print_success "iOS Simulator configurado!"
    return 0
}

# Função para fazer build e executar no iOS
build_and_run_ios() {
    print_status "Fazendo build e executando no iOS..."
    
    if ! setup_ios_simulator; then
        print_error "Falha ao configurar iOS Simulator"
        return 1
    fi
    
    # Build e execução
    print_status "Executando aplicativo no iOS Simulator..."
    npx cap run ios
    
    print_success "Aplicativo iOS executando!"
}

# Função para iniciar o backend
start_backend() {
    print_status "Iniciando servidor backend..."
    
    # Verificar se o backend já está rodando
    if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null; then
        print_warning "Backend já está rodando na porta 5000"
        return 0
    fi
    
    # Iniciar backend em background
    nohup npm run dev > backend.log 2>&1 &
    local backend_pid=$!
    
    print_status "Aguardando backend inicializar..."
    sleep 5
    
    # Verificar se o backend está respondendo
    if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
        print_success "Backend iniciado! PID: $backend_pid"
        echo "$backend_pid" > backend.pid
        return 0
    else
        print_warning "Backend pode estar iniciando... Verifique backend.log"
        echo "$backend_pid" > backend.pid
        return 0
    fi
}

# Função para parar o backend
stop_backend() {
    if [ -f backend.pid ]; then
        local pid=$(cat backend.pid)
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            print_success "Backend parado!"
        fi
        rm -f backend.pid
    fi
}

# Função para limpeza
cleanup() {
    print_status "Limpando recursos..."
    
    # Parar backend se estiver rodando
    stop_backend
    
    # Restaurar configuração original se houver backup
    if [ -f capacitor.config.ts.backup ]; then
        mv capacitor.config.ts.backup capacitor.config.ts
        print_success "Configuração original restaurada"
    fi
    
    # Remover arquivos temporários
    rm -f capacitor.config.ts.tmp
    rm -f backend.log
}

# Função para mostrar ajuda
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Opções:"
    echo "  android     - Build e executa no Android"
    echo "  ios         - Build e executa no iOS (apenas macOS)"
    echo "  both        - Build e executa em ambas as plataformas"
    echo "  setup       - Apenas configura o ambiente"
    echo "  clean       - Limpa recursos e restaura configurações"
    echo "  help        - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 android  # Executa apenas para Android"
    echo "  $0 ios      # Executa apenas para iOS"
    echo "  $0 both     # Executa para ambas as plataformas"
}

# Função principal
main() {
    local action="${1:-both}"
    
    case "$action" in
        "android")
            print_status "=== BUILD E EXECUÇÃO ANDROID ==="
            ;;
        "ios")
            print_status "=== BUILD E EXECUÇÃO iOS ==="
            ;;
        "both")
            print_status "=== BUILD E EXECUÇÃO COMPLETA ==="
            ;;
        "setup")
            print_status "=== CONFIGURAÇÃO DO AMBIENTE ==="
            ;;
        "clean")
            cleanup
            exit 0
            ;;
        "help"|"-h"|"--help")
            show_help
            exit 0
            ;;
        *)
            print_error "Opção inválida: $action"
            show_help
            exit 1
            ;;
    esac
    
    # Trap para limpeza em caso de interrupção
    trap cleanup EXIT INT TERM
    
    # Verificar pré-requisitos
    check_prerequisites
    
    # Obter IP local
    local ip
    ip=$(get_local_ip)
    print_success "IP local detectado: $ip"
    
    # Configurar backend local
    setup_local_backend "$ip"
    
    # Instalar plugins nativos
    install_native_plugins
    
    # Fazer build do frontend
    build_frontend
    
    # Adicionar plataformas
    add_platforms
    
    # Sincronizar com Capacitor
    sync_capacitor
    
    # Iniciar backend
    start_backend
    
    if [ "$action" = "setup" ]; then
        print_success "=== CONFIGURAÇÃO CONCLUÍDA ==="
        print_status "Para executar:"
        print_status "  Android: $0 android"
        print_status "  iOS: $0 ios"
        print_status "  Ambos: $0 both"
        exit 0
    fi
    
    # Executar conforme a opção escolhida
    case "$action" in
        "android")
            if build_and_run_android; then
                print_success "=== ANDROID EXECUTANDO COM SUCESSO ==="
            else
                print_error "=== FALHA NA EXECUÇÃO ANDROID ==="
                exit 1
            fi
            ;;
        "ios")
            if build_and_run_ios; then
                print_success "=== iOS EXECUTANDO COM SUCESSO ==="
            else
                print_error "=== FALHA NA EXECUÇÃO iOS ==="
                exit 1
            fi
            ;;
        "both")
            local android_success=false
            local ios_success=false
            
            print_status "--- Executando Android ---"
            if build_and_run_android; then
                android_success=true
                print_success "Android executando!"
            else
                print_error "Falha no Android"
            fi
            
            print_status "--- Executando iOS ---"
            if build_and_run_ios; then
                ios_success=true
                print_success "iOS executando!"
            else
                print_error "Falha no iOS"
            fi
            
            echo ""
            print_status "=== RESUMO ==="
            if [ "$android_success" = true ]; then
                print_success "✓ Android: Executando"
            else
                print_error "✗ Android: Falha"
            fi
            
            if [ "$ios_success" = true ]; then
                print_success "✓ iOS: Executando"
            else
                print_error "✗ iOS: Falha"
            fi
            ;;
    esac
    
    print_status "=== INFORMAÇÕES ÚTEIS ==="
    print_status "Backend rodando em: http://$ip:5000"
    print_status "Para parar tudo: Ctrl+C ou $0 clean"
    print_status "Logs do backend: tail -f backend.log"
    
    # Manter o script rodando para monitorar
    print_status "Pressione Ctrl+C para parar tudo..."
    while true; do
        sleep 10
    done
}

# Executar função principal com argumentos
main "$@"
