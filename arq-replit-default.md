# Arquitetura do Sistema - LifeTrek Health App

## Visão Geral

O LifeTrek é uma aplicação web full-stack para monitoramento abrangente de saúde e bem-estar, desenvolvida com tecnologias modernas e executada na plataforma Replit.

## Stack Tecnológico

### Frontend
- **Framework**: React 18.3.1 com TypeScript 5.6.3
- **Bundler**: Vite 5.4.14
- **Roteamento**: Wouter 3.3.5 (roteador client-side leve)
- **Gerenciamento de Estado**: TanStack React Query 5.60.5
- **Formulários**: React Hook Form 7.53.1 + Hookform Resolvers 3.9.1
- **Estilização**: Tailwind CSS 3.4.14 + Tailwind Animate 1.0.7
- **Componentes UI**: shadcn/ui (baseado em Radix UI)
- **Animações**: Framer Motion 11.13.1
- **Internacionalização**: i18next 24.2.3 + react-i18next 15.4.1
- **Validação**: Zod 3.23.8
- **Gráficos**: Recharts 2.13.0

### Backend
- **Runtime**: Node.js 20 (ESM modules)
- **Framework**: Express 4.21.2 + NestJS 11.0.20
- **Linguagem**: TypeScript (compilado com tsx 4.19.1)
- **Autenticação**: Passport.js com estratégias Local e Google OAuth 2.0
- **Sessões**: Express Session com connect-pg-simple para PostgreSQL
- **Documentação API**: Swagger via NestJS

### Banco de Dados
- **SGBD**: PostgreSQL 16 (Neon Database serverless)
- **ORM**: Drizzle ORM 0.39.1
- **Schema**: Typescript-first com validação Zod
- **Migrações**: Drizzle Kit 0.30.4

### Pagamentos
- **Processador**: Stripe 18.1.1
- **Frontend**: Stripe React SDK 3.7.0 + Stripe.js 7.3.1

### Testes
- **Framework Frontend**: Vitest 3.1.4 + Testing Library
- **Framework E2E**: Playwright 1.52.0
- **Mock**: JSDOM 26.1.0 + Happy DOM 17.5.6

### Deploy e Infraestrutura
- **Plataforma**: Replit (autoscale deployment)
- **Ambiente**: Node.js 20 + PostgreSQL 16 + Bash + Web
- **Build**: Vite + esbuild 0.25.0
- **Porta**: 5000 (mapeada para 80 externamente)

## Estrutura do Projeto

```
/
├── frontend/                  # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── auth/         # Componentes de autenticação
│   │   │   ├── dashboard/    # Componentes do dashboard
│   │   │   └── layout/       # Layout e navegação
│   │   ├── hooks/            # Hooks customizados
│   │   ├── lib/              # Utilitários e configurações
│   │   ├── locales/          # Traduções (pt/en)
│   │   ├── pages/            # Páginas da aplicação
│   │   └── test/             # Testes do frontend
│   ├── index.html            # Template HTML principal
│   └── public/               # Assets estáticos
├── server/                    # Backend Express/NestJS
│   ├── test/                 # Testes do backend
│   ├── auth.ts               # Configuração Passport.js
│   ├── db.ts                 # Conexão PostgreSQL
│   ├── index.ts              # Entry point do servidor
│   ├── routes.ts             # Rotas da API
│   ├── storage.ts            # Camada de dados
│   └── vite.ts               # Integração Vite middleware
├── shared/                    # Código compartilhado
│   └── schema.ts             # Schema Drizzle + validações Zod
├── e2e/                      # Testes end-to-end
│   └── tests/                # Cenários Playwright
├── uploads/                  # Upload de arquivos
└── migrations/               # Migrações do banco
```

## Schema do Banco de Dados

### Tabelas Principais

#### Users (`users`)
- Autenticação e perfil básico
- Integração Stripe (customer_id, subscription_id)
- Status de assinatura

#### Health Profiles (`health_profiles`)
- Perfil completo de saúde do usuário
- Objetivos, preferências e limitações
- Dados calculados (BMR, TDEE, BMI)

#### Medical Exams (`medical_exams`, `exam_details`)
- Upload e análise de exames médicos
- Processamento IA via OpenAI GPT-4o
- Detecção de anomalias e classificação de risco

#### Activities (`activities`)
- Atividades físicas detalhadas
- Dados de GPS, frequência cardíaca, zonas
- Integração com dispositivos externos

#### Sleep Tracking (`sleep_records`)
- Monitoramento completo do sono
- Fases do sono (REM, profundo, leve)
- Qualidade e ambiente

#### Nutrition (`meals`, `food_items`, `recipes`)
- Registro de refeições e nutrição
- Base de dados de alimentos
- Receitas personalizadas

#### Hydration (`water_intake`)
- Controle de hidratação
- Metas e lembretes

#### Mental Health (`stress_levels`, `meditation_sessions`)
- Acompanhamento de estresse e humor
- Sessões de meditação

#### Medication (`medications`, `medication_logs`)
- Gerenciamento de medicamentos
- Lembretes e aderência

#### Women's Health (`menstrual_cycles`, `fertility_tracking`, `pregnancy_tracking`)
- Ciclo menstrual e fertilidade
- Acompanhamento de gravidez

#### Video Content (`videos`, `video_progress`, `course_tracks`)
- Conteúdo educativo em vídeo
- Progresso e trilhas de aprendizado

### Relacionamentos
- Todos os dados são vinculados ao usuário (`user_id`)
- Estrutura normalizada com referências entre tabelas
- Suporte a arrays PostgreSQL para listas simples
- JSON para dados estruturados complexos

## Funcionalidades Core

### Autenticação
- Login/registro local com hash bcrypt
- Google OAuth 2.0 integrado
- Sessões persistentes com PostgreSQL
- Modo desenvolvimento para testes

### Dashboard
- Métricas de saúde em tempo real
- Widgets responsivos e configuráveis
- Ações rápidas para logging
- Gráficos interativos com Recharts

### Monitoramento Multi-dimensional
1. **Atividade Física**: Passos, exercícios, frequência cardíaca
2. **Nutrição**: Calorias, macros, receitas
3. **Sono**: Qualidade, fases, ambiente
4. **Saúde Mental**: Humor, estresse, meditação
5. **Hidratação**: Metas diárias, lembretes
6. **Medicamentos**: Aderência, efeitos colaterais
7. **Saúde da Mulher**: Ciclos, fertilidade
8. **Exames Médicos**: Upload, análise IA

### Sistema de Assinatura
- Planos: Básico (gratuito), Premium, Profissional
- Processamento via Stripe
- Recursos diferenciados por tier
- Gestão automática de billing

### Internacionalização
- Suporte a Português e Inglês
- Detecção automática do idioma
- Interface adaptativa

### Responsividade
- Design mobile-first
- Breakpoints: xxs(360px), xs(480px), sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- Componentes adaptativos por viewport

### Tema
- Dark/Light mode com persistência
- CSS variables para customização
- Integração completa com shadcn/ui

## APIs e Integrações

### OpenAI Integration
- Modelo: GPT-4o (mais recente)
- Análise de exames médicos
- Geração de insights personalizados
- Processamento multimodal (texto/imagem)

### Stripe Integration
- Pagamentos seguros
- Gestão de assinaturas
- Webhooks para sincronização
- Suporte a múltiplas moedas

### Google OAuth
- Autenticação social
- Acesso a dados do Google Fit (planejado)

## Configuração de Deploy

### Ambiente Replit
```json
{
  "modules": ["nodejs-20", "bash", "web", "postgresql-16"],
  "run": "npm run dev",
  "deployment": {
    "target": "autoscale",
    "build": ["npm", "run", "build"],
    "run": ["npm", "run", "start"]
  }
}
```

### Variáveis de Ambiente Necessárias
- `DATABASE_URL`: Conexão PostgreSQL
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: OAuth Google
- `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`: Stripe
- `OPENAI_API_KEY`: OpenAI GPT-4o

### Build Process
1. **Frontend**: Vite build → `/dist/public`
2. **Backend**: esbuild → `/dist/index.js`
3. **Deploy**: Automático via Replit Deployments

## Arquitetura de Dados

### Camada de Acesso (Storage Layer)
- Interface `IStorage` para abstração
- `DatabaseStorage` implementa acesso PostgreSQL
- Queries tipadas com Drizzle ORM
- Validação Zod em todas as operações

### Camada de API (Routes Layer)
- Express + NestJS para estrutura
- Middleware de autenticação
- Validação de request/response
- Error handling centralizado

### Camada de Apresentação (Frontend)
- React Query para cache e sincronização
- React Hook Form para formulários
- Componentes tipados com TypeScript
- State management via Context API

## Qualidade e Testes

### Cobertura de Testes
- **Frontend**: 20+ arquivos de teste unitário
- **Backend**: Testes de integração e unidade
- **E2E**: 5 cenários críticos com Playwright
- **Responsividade**: Testes de breakpoints
- **Dark Mode**: Testes de tema completos

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier (implícito via Replit)
- Conventional commits
- Type-safe APIs com Zod validation

## Performance

### Frontend Optimizations
- Code splitting automático (Vite)
- Lazy loading de componentes
- React Query cache inteligente
- Bundle size otimizado

### Backend Optimizations
- Connection pooling PostgreSQL
- Query optimization com Drizzle
- Sessão storage eficiente
- Compression middleware

### Database Performance
- Índices automáticos em chaves estrangeiras
- Normalização adequada
- JSON fields para dados semi-estruturados
- Conexão serverless escalável (Neon)

## Segurança

### Autenticação e Autorização
- Hash seguro de senhas (bcrypt)
- CSRF protection via SameSite cookies
- Rate limiting implícito (Replit)
- Validação server-side obrigatória

### Dados Sensíveis
- Encryption em trânsito (HTTPS)
- Environment variables para secrets
- Dados médicos com proteção adequada
- Compliance com práticas de privacidade

### API Security
- Input validation com Zod
- SQL injection protection (Drizzle ORM)
- XSS prevention (React escape automático)
- Content Security Policy headers

## Escalabilidade

### Horizontal Scaling
- Stateless backend design
- Session storage em PostgreSQL
- CDN ready (assets estáticos)
- Database connection pooling

### Vertical Scaling
- Replit autoscale deployment
- Resource monitoring automático
- Query optimization contínua
- Cache estratégico com React Query

---

## Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Inicia servidor dev (frontend + backend)

# Build e Deploy
npm run build        # Build para produção
npm run start        # Inicia servidor produção
npm run check        # Verificação TypeScript

# Database
npm run db:push      # Aplica mudanças do schema

# Testes
npx vitest run       # Testes unitários
npx playwright test  # Testes E2E
./test-all.sh       # Suite completa de testes
```

## Documentação Adicional

- **API**: `/api/docs` (Swagger UI)
- **Testes**: `client/src/test/comprehensive-test-summary.md`
- **Schema**: `shared/schema.ts` (auto-documentado)
- **Componentes**: Storybook planejado