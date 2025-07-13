#!/bin/bash

set -e

# Importar utilitário de mensagens coloridas
source ./scripts/utils/colors_message.sh

# Função para verificar e instalar dependências
install_dependencies() {
  if [ ! -d "node_modules" ]; then
    print_info "📦 Pasta node_modules não encontrada. Executando npm install..."
    npm install
  fi

  print_info "📦 Instalando @capacitor/cli..."
  npm install @capacitor/cli
}

# Função para executar o build
run_build() {
  print_info "🏗️ Executando build do projeto..."
  npm run build
}

# Função para verificar se o Capacitor está inicializado
check_capacitor_initialized() {
  if [ ! -f "capacitor.config.ts" ]; then
    print_error "capacitor.config.ts não encontrado. Execute o build primeiro."
    exit 1
  fi
}

# Função para adicionar plataformas
add_platforms() {
  print_info "📱 Adicionando plataforma iOS..."
  npx cap add ios

  print_info "🤖 Adicionando plataforma Android..."
  npx cap add android
}

# Função para instalar plugins nativos
install_plugins() {
  print_info "🔌 Instalando plugins nativos..."
  npm install \
    @capacitor/camera \
    @capacitor/device \
    @capacitor/app \
    @capacitor/haptics \
    @capacitor/status-bar \
    @capacitor/splash-screen \
    @capacitor/filesystem \
    @capacitor/preferences \
    @capacitor/share \
    @capacitor/browser \
    @capacitor/network \
    @capacitor/geolocation
}

# Função para sincronizar plataformas
sync_platforms() {
  print_info "🔄 Sincronizando plataformas..."
  npx cap sync
}

# Execução principal do script
print_info "🔧 Configurando plataformas móveis..."
install_dependencies
run_build
check_capacitor_initialized
add_platforms
install_plugins
sync_platforms

print_success "Plataformas configuradas com sucesso!"
print_alert ""
print_alert "Próximos passos:"
print_alert "1. Execute 'npm run build:mobile' para fazer o build"
print_alert "2. Use 'npx cap open ios' para abrir no Xcode"
print_alert "3. Use 'npx cap open android' para abrir no Android Studio"