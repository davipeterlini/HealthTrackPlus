#!/bin/bash

set -e

# Importar utilitário de mensagens coloridas
source ./scripts/utils/colors_message.sh

# Função para verificar se um script existe e é executável
validate_script() {
  local script_path=$1
  if [ ! -x "$script_path" ]; then
    print_error "O script $script_path não foi encontrado ou não é executável."
    exit 1
  fi
}

# Função para executar um script com mensagem
execute_script() {
  local script_path=$1
  local message=$2

  validate_script "$script_path"
  print_info "$message"
  "$script_path"
}

# Execução principal do script
print_info "📦 Iniciando o processo de configuração e build do mobile..."

execute_script "./scripts/clean_mobile_build.sh" "🧹 Limpando o build do projeto mobile..."
execute_script "./scripts/add-platforms.sh" "➕ Adicionando plataformas móveis..."
execute_script "./scripts/build-mobile.sh" "🏗️ Construindo o projeto mobile..."

print_success "✅ Processo de configuração e build do mobile concluído com sucesso!"