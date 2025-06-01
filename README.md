# LifeTrek - Monitoramento Integrado de Saúde

## 📋 Sobre

HealthTrack é uma aplicação web completa para monitoramento de saúde que permite aos usuários acompanhar diversos aspectos de sua saúde, incluindo atividade física, sono, nutrição e exames médicos.

## 🚀 Funcionalidades

- 🏃‍♂️ Monitoramento de atividade física
- 💊 Acompanhamento de exames médicos
- 💧 Controle de hidratação
- 😴 Registro de padrões de sono
- 🥗 Acompanhamento nutricional
- 📊 Insights de saúde personalizados
- 📱 Interface responsiva
- 🎥 Conteúdo em vídeo sobre medicina integrativa

## 🛠️ Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: Passport.js

## 🏃‍♂️ Configuração Local

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

### 1. Clonar e Instalar Dependências

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd <nome-do-projeto>

# Instalar dependências
npm install
```

### 2. Configurar PostgreSQL

#### Opção A: Docker (Recomendado)
```bash
# Executar PostgreSQL com Docker
docker run --name postgres-health \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=health_app \
  -d -p 5432:5432 postgres:15
```

#### Opção B: Instalação Local
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Baixar e instalar do site oficial: https://www.postgresql.org/download/windows/
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/health_app
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=health_app

# Stripe Configuration (para sistema de assinatura)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# OpenAI Configuration (para análises de IA)
OPENAI_API_KEY=sk-...

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Configurar Banco de Dados

```bash
# Aplicar schema do banco de dados
npm run db:push
```

### 5. Executar a Aplicação

```bash
# Modo desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5000
```

### 🔑 Chaves de API Necessárias

#### Stripe (Sistema de Assinatura)
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copie a "Publishable key" para `VITE_STRIPE_PUBLIC_KEY`
3. Copie a "Secret key" para `STRIPE_SECRET_KEY`

#### OpenAI (Análises de IA)
1. Acesse [OpenAI API](https://platform.openai.com/api-keys)
2. Crie uma nova chave de API
3. Copie para `OPENAI_API_KEY`

#### Google OAuth (Opcional)
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Ative a API do Google+
4. Crie credenciais OAuth 2.0
5. Configure as URLs de callback autorizadas

### 🚨 Problemas Comuns

#### Erro de Conexão com PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verificar conectividade
psql -h localhost -p 5432 -U postgres -d health_app
```

#### Erro de Permissões
```bash
# Dar permissões ao usuário postgres
sudo -u postgres createdb health_app
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

#### Porta 5000 em uso
```bash
# Verificar processo usando a porta
lsof -i :5000

# Matar processo
kill -9 <PID>
```

### 📚 Scripts Disponíveis

```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Build para produção
npm run db:push      # Aplicar mudanças no schema do banco
npm run db:generate  # Gerar migrações
```

## 📦 Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Tipos e schemas compartilhados
└── ...
```

## 👥 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📱 Gerando Aplicativos Móveis

### Android

1. Instale o aplicativo Replit Mobile em seu dispositivo Android através da [Google Play Store](https://play.google.com/store/apps/details?id=com.replit.mobile)
2. Faça login com sua conta Replit
3. Navegue até este projeto
4. Toque no botão "Run" para iniciar o aplicativo
5. O app será executado diretamente no seu dispositivo Android

### iOS

1. Instale o aplicativo Replit Mobile em seu dispositivo iOS através da [App Store](https://apps.apple.com/us/app/replit-mobile/id1614022293)
2. Faça login com sua conta Replit
3. Navegue até este projeto
4. Toque no botão "Run" para iniciar o aplicativo
5. O app será executado diretamente no seu dispositivo iOS

## 📄 Licença

Este projeto está sob a licença MIT.