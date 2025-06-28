
# Scripts de Desenvolvimento Mobile

Este diretório contém scripts para facilitar o desenvolvimento, build e execução da aplicação Health Tracker em dispositivos móveis (Android e iOS).

## 📁 Estrutura dos Scripts

```
scripts/
├── mobile-build-and-run.sh    # Script principal para build e execução completa
├── dev-local.sh               # Configuração para desenvolvimento local
├── add-platforms.sh           # Adiciona plataformas mobile ao projeto
├── build-mobile.sh            # Build básico para mobile
├── build-and-run-emulators.sh # Build e execução em emuladores
├── check-requirements.sh      # Verificação de pré-requisitos
└── README.md                  # Esta documentação
```

## 🚀 Script Principal: mobile-build-and-run.sh

Este é o script mais completo que automatiza todo o processo de desenvolvimento mobile.

### Funcionalidades

- ✅ Verificação automática de pré-requisitos
- ✅ Detecção automática do IP local
- ✅ Configuração do backend para desenvolvimento local
- ✅ Build do frontend automatizado
- ✅ Instalação de plugins nativos do Capacitor
- ✅ Criação e configuração de emuladores
- ✅ Build e execução nos dispositivos/emuladores
- ✅ Gerenciamento do backend em background
- ✅ Limpeza automática de recursos

### Como Usar

```bash
# Dar permissão de execução
chmod +x scripts/mobile-build-and-run.sh

# Executar para ambas as plataformas
./scripts/mobile-build-and-run.sh both

# Executar apenas para Android
./scripts/mobile-build-and-run.sh android

# Executar apenas para iOS (requer macOS)
./scripts/mobile-build-and-run.sh ios

# Apenas fazer build (sem rodar emuladores)
./scripts/mobile-build-and-run.sh build
```

## 📱 Scripts Específicos

### 1. check-requirements.sh
Verifica se todas as dependências necessárias estão instaladas.

```bash
./scripts/check-requirements.sh
```

**Verifica:**
- Node.js e npm
- Java Development Kit (JDK)
- Android SDK e ferramentas
- Xcode (apenas no macOS)
- Capacitor CLI

### 2. dev-local.sh
Configura o ambiente para desenvolvimento local com dispositivos móveis.

```bash
./scripts/dev-local.sh
```

**Funcionalidades:**
- Detecta IP local automaticamente
- Configura capacitor.config.ts para desenvolvimento
- Faz backup das configurações originais
- Sincroniza com Capacitor

### 3. add-platforms.sh
Adiciona as plataformas móveis ao projeto Capacitor.

```bash
./scripts/add-platforms.sh
```

**Funcionalidades:**
- Adiciona plataforma iOS
- Adiciona plataforma Android
- Instala plugins nativos essenciais
- Sincroniza todas as plataformas

### 4. build-mobile.sh
Script básico para build das aplicações móveis.

```bash
./scripts/build-mobile.sh
```

**Funcionalidades:**
- Build do frontend
- Sincronização com Capacitor
- Cópia de assets
- Preparação para abertura nos IDEs

### 5. build-and-run-emulators.sh
Script avançado para build e execução em emuladores.

```bash
./scripts/build-and-run-emulators.sh
```

**Opções interativas:**
1. Build e rodar no Android
2. Build e rodar no iOS (macOS apenas)
3. Build e rodar em ambos
4. Apenas fazer build (sem rodar)

## 🛠️ Pré-requisitos

### Requisitos Gerais
- **Node.js** (v18 ou superior)
- **npm** (v9 ou superior)
- **Capacitor CLI**: `npm install -g @capacitor/cli`

### Para Android
1. **Java Development Kit (JDK 11+)**
2. **Android Studio** com SDK Tools
3. **Variáveis de ambiente**:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export ANDROID_SDK_ROOT=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
   ```

### Para iOS (macOS apenas)
1. **Xcode** (versão mais recente)
2. **Xcode Command Line Tools**:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

## 📱 Detalhes das Plataformas

### Android

#### Configuração do Emulador
- **Nome**: HealthTracker_Emulator
- **Dispositivo**: Pixel 4
- **API Level**: 33
- **Arquitetura**: x86_64
- **Google APIs**: Habilitadas

#### Processo de Build
1. Verificação do Android SDK
2. Criação do emulador (se necessário)
3. Inicialização do emulador
4. Build da aplicação (APK de debug)
5. Instalação e execução no emulador

#### Localização do APK
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### iOS (macOS apenas)

#### Configuração do Simulador
- **Dispositivo**: iPhone 14
- **iOS**: Versão mais recente disponível
- **Arquitetura**: x86_64 (simulador)

#### Processo de Build
1. Build do projeto iOS no Xcode
2. Inicialização do simulador
3. Instalação da aplicação
4. Execução no simulador

## 🔧 Configurações de Desenvolvimento

### Backend Local
O backend é automaticamente configurado para rodar em:
- **URL**: `http://[SEU_IP_LOCAL]:5000`
- **Porta**: 5000
- **Endpoints**: `/api/*`

### Frontend
- **Build tool**: Vite
- **Output**: `frontend/dist/`
- **Assets**: Copiados automaticamente para as plataformas

### Capacitor
- **Configuração**: `capacitor.config.ts`
- **Plataformas**: `ios/` e `android/`
- **Plugins**: Instalados automaticamente

## 🐛 Solução de Problemas

### Problemas Comuns

#### "ANDROID_HOME não definido"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

#### "Emulador não inicia"
```bash
# Verificar emuladores disponíveis
emulator -list-avds

# Criar novo emulador
avdmanager create avd -n Test_Emulator -k "system-images;android-33;google_apis;x86_64"
```

#### "Erro de build do iOS"
- Verificar se está no macOS
- Confirmar instalação do Xcode
- Verificar certificados de desenvolvedor

#### "Frontend não carrega no app"
- Verificar se o backend está rodando
- Confirmar configuração do IP em `capacitor.config.ts`
- Verificar logs do dispositivo

### Debug e Logs

#### Android
```bash
# Logs do dispositivo
adb logcat | grep -i "health"

# Verificar dispositivos conectados
adb devices
```

#### iOS
```bash
# Logs do simulador
xcrun simctl list devices

# Ver logs detalhados
xcrun simctl spawn booted log stream --predicate 'subsystem contains "HealthApp"'
```

## 📊 Comandos Úteis

### Capacitor
```bash
npx cap doctor          # Verificar configuração
npx cap ls              # Listar plugins instalados
npx cap open android    # Abrir no Android Studio
npx cap open ios        # Abrir no Xcode
npx cap sync            # Sincronizar código com plataformas
```

### Android
```bash
# Listar dispositivos/emuladores
adb devices

# Instalar APK manualmente
adb install path/to/app.apk

# Desinstalar aplicação
adb uninstall com.healthapp.mobile
```

### iOS
```bash
# Listar simuladores
xcrun simctl list devices

# Boot simulador específico
xcrun simctl boot "iPhone 14"

# Instalar app no simulador
xcrun simctl install booted path/to/app.app
```

## 🔄 Fluxo de Desenvolvimento

### Desenvolvimento Normal
1. Execute `./scripts/check-requirements.sh`
2. Execute `./scripts/dev-local.sh`
3. Inicie o backend: `npm run dev`
4. Execute `./scripts/mobile-build-and-run.sh`

### Apenas Testing
1. Execute `./scripts/build-mobile.sh`
2. Abra manualmente: `npx cap open android` ou `npx cap open ios`

### Produção/Release
1. Configure as variáveis de produção
2. Execute build de release no Android Studio/Xcode
3. Siga os processos de distribuição das lojas

## 🛡️ Segurança

### Desenvolvimento Local
- O IP local é detectado automaticamente
- Configuração `cleartext: true` apenas para desenvolvimento
- Backup automático das configurações originais

### Produção
- Configurações de produção devem usar HTTPS
- Remover `cleartext: true` da configuração
- Configurar certificados SSL adequados

## 📈 Performance

### Otimizações Aplicadas
- Build otimizado do Vite
- Code splitting automático
- Compressão de assets
- Lazy loading de componentes

### Monitoramento
- Logs estruturados
- Tracking de performance nativo
- Métricas de uso da aplicação

## 🤝 Contribuição

Para melhorar os scripts:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Teste em diferentes ambientes (macOS, Linux, Windows)
4. Documente as mudanças
5. Abra um Pull Request

### Padrões de Código
- Use bash script padrão
- Adicione comentários explicativos
- Teste em múltiplas plataformas
- Mantenha compatibilidade com versões anteriores

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs**: `tail -f backend.log`
2. **Execute diagnóstico**: `npx cap doctor`
3. **Limpe o cache**: `npm run clean && npm install`
4. **Reporte issues**: Crie um issue no repositório

### Links Úteis
- [Documentação do Capacitor](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)
- [React Native Performance](https://reactnative.dev/docs/performance)

## 📋 Checklist de Deploy

### Antes do Deploy
- [ ] Todos os testes passando
- [ ] Build sem erros/warnings
- [ ] Configurações de produção validadas
- [ ] Assets otimizados
- [ ] Certificados configurados

### Android
- [ ] APK/AAB gerado
- [ ] Assinado com certificado de produção
- [ ] Testado em dispositivos reais
- [ ] Metadados da Play Store atualizados

### iOS
- [ ] Archive gerado no Xcode
- [ ] Certificados de distribuição válidos
- [ ] Testado no TestFlight
- [ ] Metadados da App Store atualizados

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🔄 Changelog

### v1.0.0
- Scripts iniciais de desenvolvimento mobile
- Suporte completo para Android e iOS
- Configuração automática de ambiente local
- Documentação completa

### Próximas Versões
- [ ] Suporte para build de produção automatizado
- [ ] Integração com CI/CD
- [ ] Scripts de testes automatizados
- [ ] Suporte para múltiplos ambientes
