#!/bin/bash
# Script para instalar PostgreSQL no macOS

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Instalação do PostgreSQL para macOS${NC}"
echo -e "${BLUE}================================================${NC}"

# Verificar se o Homebrew está instalado
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Homebrew não está instalado. Instalando Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Falha ao instalar o Homebrew. Por favor, instale manualmente.${NC}"
        echo -e "Visite: https://brew.sh"
        exit 1
    fi
    
    echo -e "${GREEN}Homebrew instalado com sucesso!${NC}"
else
    echo -e "${GREEN}Homebrew já está instalado.${NC}"
fi

# Atualizar Homebrew
echo -e "${GREEN}Atualizando Homebrew...${NC}"
brew update

# Instalar PostgreSQL
echo -e "${GREEN}Instalando PostgreSQL...${NC}"
brew install postgresql@15

if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar o PostgreSQL. Tente instalar manualmente.${NC}"
    echo -e "Execute: brew install postgresql@15"
    exit 1
fi

# Iniciar serviço do PostgreSQL
echo -e "${GREEN}Iniciando serviço do PostgreSQL...${NC}"
brew services start postgresql@15

if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao iniciar o serviço do PostgreSQL.${NC}"
    echo -e "Execute manualmente: brew services start postgresql@15"
    exit 1
fi

echo -e "${GREEN}Aguardando o PostgreSQL inicializar...${NC}"
sleep 5

# No macOS, não precisamos criar o usuário postgres, pois o usuário do sistema é usado por padrão
echo -e "${GREEN}Verificando usuário atual para PostgreSQL...${NC}"
CURRENT_USER=$(whoami)
echo -e "${GREEN}Usando usuário: $CURRENT_USER${NC}"

# Criar o banco de dados
echo -e "${GREEN}Criando banco de dados healthtrackplus...${NC}"
/opt/homebrew/opt/postgresql@15/bin/createdb healthtrackplus

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}PostgreSQL instalado e configurado com sucesso!${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Resumo:"
echo -e "- PostgreSQL 15 instalado"
echo -e "- Serviço iniciado automaticamente"
echo -e "- Usando usuário do sistema '$CURRENT_USER'"
echo -e "- Banco de dados 'healthtrackplus' criado"
echo -e "${BLUE}================================================${NC}"
echo -e "Agora você pode executar: npm run db:push"
echo -e "${BLUE}================================================${NC}"