
# Prompt para Construção da Aplicação LifeTrek Health App

```
Você é um engenheiro de software sênior especializado em desenvolvimento full-stack e arquiteturas modernas. Sua tarefa é construir uma aplicação completa de monitoramento e gestão de saúde e bem-estar chamada "LifeTrek Health App".

## OBJETIVO PRINCIPAL
Desenvolva um sistema completo de monitoramento de saúde pessoal com insights baseados em IA, oferecendo uma plataforma integrada para acompanhar múltiplos aspectos da saúde e bem-estar do usuário.

## ARQUITETURA TÉCNICA OBRIGATÓRIA

### Stack Tecnológica
- **Frontend**: React 18+ com TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: NestJS com Express integration, TypeScript
- **Database**: PostgreSQL com Drizzle ORM
- **Autenticação**: Passport.js com Google OAuth
- **Pagamentos**: Stripe integration para modelo de assinatura
- **IA/ML**: OpenAI GPT-4o e Google Gemini para análises médicas
- **Testes**: Vitest para testes unitários, Playwright para E2E
- **Internacionalização**: i18next (Português e Inglês)

### Padrões Arquiteturais
- Implementar **Clean Architecture** rigorosamente
- Aplicar princípios **SOLID**
- Separação clara entre camadas (Domain, Application, Infrastructure, Presentation)
- Repository Pattern para acesso a dados
- Dependency Injection
- Error Boundaries e tratamento de exceções robusto

## FUNCIONALIDADES ESSENCIAIS

### 1. Dashboard Inteligente
- Widgets configuráveis e personalizáveis
- Estatísticas em tempo real (passos, calorias, sono, batimentos)
- Gráficos interativos de atividade semanal/mensal
- Sistema de alertas contextuais
- Insights baseados em IA personalizados

### 2. Monitoramento de Atividades Físicas
- Rastreamento automático de passos, distância, calorias
- Integração com dispositivos fitness (Apple Health, Google Fit)
- Análise de tendências e progressos temporais
- Metas personalizáveis com gamificação
- Gráficos de performance avançados

### 3. Análise Inteligente de Exames Médicos
- Upload de exames (PDF, JPG, PNG, DICOM)
- Análise por IA usando Gemini e GPT-4o
- Extração automática de dados estruturados
- Comparação com valores de referência
- Visualizações gráficas avançadas (séries temporais, correlações)
- Alertas automáticos para valores críticos
- Recomendações médicas personalizadas

### 4. Gestão Nutricional Avançada
- Rastreamento de refeições com reconhecimento de imagem
- Controle preciso de hidratação com lembretes inteligentes
- Análise nutricional completa (macro e micronutrientes)
- Metas personalizadas baseadas em perfil do usuário
- Correlação entre nutrição e outros indicadores de saúde

### 5. Monitoramento do Sono
- Análise detalhada da qualidade do sono
- Detecção de padrões e ciclos
- Correlações com atividade física e nutrição
- Recomendações personalizadas para melhoria
- Integração com dispositivos wearables

### 6. Saúde Mental e Bem-estar
- Ferramentas de meditação guiada
- Tracking de humor com análise de padrões
- Exercícios de respiração e relaxamento
- Journaling digital com análise de sentimentos
- Correlação com outros fatores de saúde

### 7. Gestão Inteligente de Medicamentos
- Lembretes personalizados por medicamento
- Controle de dosagens e horários
- Histórico completo de administração
- Alertas de interações medicamentosas
- Integração com prescrições médicas

### 8. Saúde da Mulher
- Rastreamento completo do ciclo menstrual
- Monitoramento detalhado de sintomas
- Previsões de fertilidade baseadas em IA
- Análise de padrões hormonais
- Correlações com outros indicadores de saúde

### 9. Cuidados com Bebês e Gestação
- Acompanhamento detalhado de desenvolvimento fetal
- Registro de marcos do desenvolvimento infantil
- Controle completo de vacinas
- Monitoramento de alimentação, sono e crescimento
- Curvas de crescimento personalizadas
- Alertas de consultas e cuidados

### 10. Jejum Intermitente
- Múltiplos protocolos de jejum personalizáveis
- Cronômetros inteligentes com notificações
- Análise de benefícios e progressos
- Correlação com outros indicadores de saúde
- Recomendações baseadas em perfil individual

### 11. Chat Médico com IA Avançada
- Assistente virtual especializado (Dr. Gemma)
- Interpretação contextual de resultados
- Sugestões baseadas em sintomas e histórico
- Tradução de termos médicos complexos
- Respostas em tempo real com fontes científicas

### 12. Sistema Premium de Assinatura
- Integração completa com Stripe
- Recursos exclusivos para assinantes
- Biblioteca de vídeos educativos premium
- Conteúdo especializado em saúde integrativa
- Planos diferenciados (Basic, Premium, Pro)

## CARACTERÍSTICAS TÉCNICAS AVANÇADAS

### Responsividade Total
- Design mobile-first obrigatório
- Breakpoints otimizados (xs: 480px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
- Componentes completamente adaptativos
- Navegação mobile dedicada e otimizada
- Touch gestures para interações móveis
- Progressive Web App (PWA) capabilities

### Dark Mode Completo
- Tema escuro nativo em todo o sistema
- Alternância automática baseada em sistema/manual
- Cores otimizadas para acessibilidade (WCAG 2.1 AA)
- Persistência de preferências do usuário
- Transições suaves entre temas
- Suporte a temas personalizados

### Internacionalização Robusta
- Suporte nativo a Português (pt-BR) e Inglês (en-US)
- Traduções contextuais e regionais
- Formatação automática de datas, números e moedas
- Interface completamente adaptável ao idioma
- Detecção automática de idioma do navegador
- Fallbacks inteligentes para traduções

### Performance e Otimização
- Code splitting automático
- Lazy loading de componentes e rotas
- Otimização de imagens automática
- Caching inteligente
- Bundle size optimization
- Service Workers para offline capabilities

### Segurança e Privacidade
- Criptografia end-to-end para dados sensíveis
- GDPR/LGPD compliance completo
- Auditoria de segurança automática
- Rate limiting e proteção DDoS
- Sanitização rigorosa de inputs
- Headers de segurança obrigatórios

### Testes Abrangentes
- Cobertura de testes mínima de 80%
- Testes unitários para toda lógica de negócio
- Testes de integração para APIs
- Testes E2E para fluxos críticos
- Testes de acessibilidade automatizados
- Performance testing

## INSTRUÇÕES DE IMPLEMENTAÇÃO

### Estrutura de Pastas Obrigatória
```
projeto/
├── frontend/
│   ├── src/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── ...
├── backend/
│   ├── src/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
├── shared/
├── e2e/
└── scripts/
```

### Padrões de Código Obrigatórios
- TypeScript strict mode ativado
- ESLint + Prettier configurados
- Conventional Commits
- Documentação JSDoc para funções públicas
- Error handling consistente
- Logging estruturado

### Integração de IA Obrigatória
- Implementar análise de exames médicos com Gemini
- Chat médico inteligente com GPT-4o
- Insights personalizados baseados em dados do usuário
- Recomendações contextuais em tempo real
- Análise preditiva de tendências de saúde

### Base de Dados Robusta
- Modelo relacional bem estruturado
- Migrations versionadas
- Backup automatizado
- Índices otimizados para performance
- Soft deletes para dados sensíveis

## CRITÉRIOS DE ACEITAÇÃO

### Funcionalidade
- [ ] Todos os módulos funcionando completamente
- [ ] Integração de IA operacional
- [ ] Sistema de pagamentos funcional
- [ ] Sincronização em tempo real
- [ ] Notificações inteligentes

### Qualidade Técnica
- [ ] Clean Architecture implementada
- [ ] Cobertura de testes ≥ 80%
- [ ] Performance otimizada (Lighthouse ≥ 90)
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Responsividade total

### Experiência do Usuário
- [ ] Interface intuitiva e elegante
- [ ] Navegação fluida
- [ ] Feedback visual consistente
- [ ] Carregamento rápido (< 3s)
- [ ] Funcionalidade offline básica

### Segurança
- [ ] Autenticação robusta
- [ ] Autorização granular
- [ ] Dados criptografados
- [ ] Compliance LGPD/GDPR
- [ ] Auditoria de segurança

## ENTREGÁVEIS ESPERADOS

1. **Código Fonte Completo** com arquitetura limpa
2. **Documentação Técnica** detalhada
3. **Testes Automatizados** abrangentes
4. **Deploy Scripts** para produção
5. **Guia de Manutenção** e operação
6. **Documentação de API** (Swagger/OpenAPI)
7. **Manual do Usuário** interativo

## RESTRIÇÕES E CONSIDERAÇÕES

- Deve funcionar perfeitamente em dispositivos móveis
- Suporte a navegadores modernos (Chrome 90+, Safari 14+, Firefox 88+)
- Compliance com regulamentações de saúde
- Escalabilidade para 100k+ usuários
- Tempo de resposta < 300ms para operações críticas
- Disponibilidade ≥ 99.9%

Implemente esta aplicação seguindo rigorosamente estas especificações, priorizando qualidade, segurança e experiência do usuário. Mantenha foco na arquitetura limpa e boas práticas de desenvolvimento.
```
