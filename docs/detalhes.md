# HealthTrackPlus - Detalhes de Arquitetura e Funcionamento

## Visão Geral

O HealthTrackPlus é uma aplicação abrangente de saúde e bem-estar que oferece funcionalidades para rastreamento de atividades físicas, gerenciamento de exames médicos, monitoramento nutricional, acompanhamento de bebês e gravidez, e muito mais. A aplicação foi desenvolvida seguindo os princípios de Clean Architecture, garantindo uma separação clara de responsabilidades, alta testabilidade e manutenibilidade.

## Arquitetura

### Clean Architecture

A aplicação implementa os princípios de Clean Architecture tanto no backend quanto no frontend:

#### Backend

1. **Camada de Domínio (Domain Layer)**
   - Entidades de domínio com regras de negócio encapsuladas (User, MedicalExam, Activity)
   - Interfaces para repositórios (IUserRepository, IMedicalExamRepository)
   - Value Objects para encapsular conceitos de domínio (Email, Username)

2. **Camada de Aplicação (Application Layer)**
   - Serviços com lógica de negócio (UserService, MedicalExamService)
   - Casos de uso específicos (CreateUserUseCase, AnalyzeMedicalExamUseCase)

3. **Camada de Infraestrutura (Infrastructure Layer)**
   - Implementações concretas dos repositórios usando Drizzle ORM
   - Integrações com serviços externos (Stripe, IA)

4. **Camada de Apresentação (Presentation Layer)**
   - Controladores para endpoints da API
   - Rotas Express

#### Frontend

1. **Camada de Domínio (Domain Layer)**
   - Entidades com lógica relevante para UI
   - Interfaces para repositórios frontend

2. **Camada de Aplicação (Application Layer)**
   - Serviços com lógica de negócio específica para UI
   - Casos de uso para operações complexas (GetUserDashboardDataUseCase)

3. **Camada de Infraestrutura (Infrastructure Layer)**
   - Implementações de repositórios que fazem chamadas para a API

4. **Camada de Apresentação (Presentation Layer)**
   - Hooks customizados React
   - Componentes de UI

### Stack Tecnológica

#### Frontend
- **Framework Principal**: React
- **Roteamento**: React Router DOM
- **Estilização**: Tailwind CSS com componentes Radix UI/Shadcn
- **Gerenciamento de Estado**: React Query
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Internacionalização**: i18next
- **Aplicativo Móvel**: Capacitor (iOS/Android)

#### Backend
- **Framework de Servidor**: Express.js
- **Autenticação**: Passport.js
- **Validação**: Zod, Class Validator
- **ORM**: Drizzle ORM
- **Processamento de Pagamentos**: Stripe
- **Inteligência Artificial**: Google Gemini AI, Anthropic Claude

#### Database
- **Banco de Dados**: PostgreSQL (Neon Database para ambiente serverless)
- **Migrações**: Drizzle Kit

#### DevOps
- **Containerização**: Docker
- **CI/CD**: Google Cloud Build
- **Testes**: Vitest, Playwright

## Funcionalidades Principais

### 1. Gestão de Usuários e Autenticação
- Registro de usuários
- Login com credenciais ou Google OAuth
- Autenticação de dois fatores
- Gerenciamento de perfil
- Sistema de assinaturas premium via Stripe

### 2. Rastreamento de Saúde e Atividades
- Monitoramento de passos, calorias e minutos ativos
- Integração com dispositivos de fitness
- Visualização de progresso em gráficos
- Estatísticas semanais e mensais

### 3. Gerenciamento de Exames Médicos
- Upload de exames (PDFs e imagens)
- Análise automática com IA
- Visualização detalhada de resultados
- Acompanhamento histórico
- Geração de insights baseados em resultados

### 4. Nutrição e Hidratação
- Rastreamento de refeições e água
- Calculadora de calorias
- Registro de nutrientes (proteínas, carboidratos, gorduras)
- Planejamento de refeições

### 5. Monitoramento de Sono
- Registro de horas de sono
- Análise de qualidade do sono
- Estatísticas de fases do sono (sono profundo, REM)
- Recomendações para melhorar o sono

### 6. Saúde Mental
- Acompanhamento de níveis de estresse
- Sessões de meditação
- Exercícios de respiração
- Monitoramento de humor

### 7. Medicações
- Lembretes de medicamentos
- Registro de dosagens
- Acompanhamento de efeitos colaterais
- Alertas de reabastecimento

### 8. Saúde Reprodutiva e Familiar
- Rastreamento de ciclo menstrual
- Acompanhamento de fertilidade
- Monitoramento de gravidez
- Acompanhamento do desenvolvimento do bebê
- Registro de vacinas e vitaminas infantis

### 9. Insights de Saúde com IA
- Análise personalizada de dados de saúde
- Recomendações contextuais baseadas em dados
- Assistente virtual médico para consultas
- Interpretação de exames médicos

### 10. Planos de Saúde Personalizados
- Geração de planos baseados no perfil do usuário
- Metas semanais e mensais adaptativas
- Programas de exercício personalizados
- Recomendações nutricionais

### 11. Conteúdo Educacional
- Vídeos de saúde e bem-estar
- Acompanhamento de progresso em cursos
- Dicas de saúde contextuais

## Modelo de Dados

O sistema utiliza um esquema de banco de dados PostgreSQL abrangente com mais de 35 tabelas. As principais entidades incluem:

1. **users**: Armazenamento de informações de usuário e assinatura
2. **medical_exams**: Exames médicos com resultados e análises de IA
3. **exam_details**: Detalhes específicos de cada exame
4. **activities**: Registro de atividades físicas
5. **sleep_records**: Dados de sono
6. **water_intake**: Consumo de água
7. **meals**: Refeições e nutrição
8. **health_insights**: Insights gerados por IA
9. **health_profiles**: Perfis de saúde personalizados
10. **health_plans**: Planos de saúde gerados
11. **medications**: Medicamentos
12. **meditation_sessions**: Sessões de meditação
13. **menstrual_cycles**: Ciclos menstruais
14. **fertility_tracking**: Rastreamento de fertilidade
15. **pregnancy_tracking**: Acompanhamento de gravidez
16. **baby_growth_tracking**: Crescimento do bebê
17. **videos/course_tracks**: Conteúdo educacional

## Fluxo de Dados

### Exames Médicos
1. Usuário faz upload de um exame médico
2. Sistema armazena o arquivo e registra metadados
3. Análise automática por IA é iniciada em background
4. Resultados são analisados e detalhes extraídos
5. Insights de saúde são gerados com base na análise
6. Usuário recebe notificação de análise concluída

### Atividades Físicas
1. Usuário registra atividade (manual ou via integração)
2. Sistema calcula métricas (calorias, distância, etc.)
3. Dados são armazenados e agregados com histórico
4. Gráficos e visualizações são gerados
5. Sistema fornece feedback e recomendações

### Interação com Assistente de Saúde IA
1. Usuário envia pergunta ao assistente
2. Sistema recupera dados de saúde relevantes do usuário
3. Consulta é processada por modelo de IA médica (Gemini)
4. Resposta personalizada é gerada com base no contexto médico
5. Feedback do usuário é usado para melhorar respostas futuras

## Integração Mobile

A aplicação utiliza Capacitor para oferecer uma experiência nativa em dispositivos móveis:

1. **Recursos Nativos Acessados**:
   - Câmera (upload de exames e fotos de refeições)
   - Notificações (lembretes de medicamentos)
   - Armazenamento local
   - Sensores (geolocalização para atividades)
   - Compartilhamento

2. **Sincronização**:
   - Dados sincronizados entre dispositivos via API
   - Armazenamento offline para uso sem conexão

## Sistema de Assinatura

O aplicativo implementa um modelo freemium com Stripe:

1. **Plano Gratuito**:
   - Funcionalidades básicas de rastreamento
   - Limites de uploads de exames
   - Análise básica de dados

2. **Plano Premium** ($19.99/mês):
   - Análise avançada de exames com IA
   - Assistente médico IA ilimitado
   - Planos de saúde personalizados
   - Sem limites para uploads
   - Recursos avançados de monitoramento

## Considerações de Segurança

1. **Proteção de Dados**:
   - Criptografia de dados sensíveis em trânsito (HTTPS) e em repouso
   - Autenticação robusta com suporte para 2FA
   - Validação rigorosa de entrada

2. **Privacidade**:
   - Conformidade com regulamentações de saúde
   - Controle granular sobre compartilhamento de dados
   - Políticas claras sobre uso de dados para IA

3. **Segurança da API**:
   - Autenticação JWT para endpoints
   - Rate limiting para prevenir abusos
   - Verificação de autorização em todos os recursos

## Mecanismos de IA e Análise

O sistema utiliza múltiplos modelos de IA para fornecer insights:

1. **Análise de Exames Médicos**:
   - OCR para extração de texto de documentos
   - Modelos de NLP para interpretação de resultados
   - Detecção de anomalias em valores laboratoriais

2. **Insights de Saúde**:
   - Análise de correlação entre diferentes métricas
   - Modelos de predição para tendências de saúde
   - Recomendações personalizadas

3. **Assistente Médico**:
   - Modelo de linguagem ajustado para contexto médico
   - Resposta a perguntas baseadas em evidências
   - Contextualização com dados de saúde do usuário

## Conclusão

O HealthTrackPlus é uma aplicação de saúde abrangente que combina monitoramento de atividades, gestão de exames médicos, nutrição, e saúde familiar com insights alimentados por IA. Utilizando uma arquitetura limpa e moderna, o sistema é altamente extensível, mantido e preparado para evoluir com as necessidades dos usuários.