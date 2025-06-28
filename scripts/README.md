
# Scripts de Desenvolvimento Mobile

Este diretório contém scripts para facilitar o desenvolvimento, build e execução da aplicação Health Tracker em dispositivos móveis (Android e iOS).

## 📁 Estrutura dos Scripts

```
scripts/
├── mobile-build-and-run.sh    # Script principal para build e execução
├── dev-local.sh               # Configuração para desenvolvimento local
├── add-platforms.sh           # Adiciona plataformas mobile
├── build-mobile.sh            # Build básico para mobile
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

# Apenas configurar o ambiente
./scripts/mobile-build-and-run.sh setup

# Limpar recursos e restaurar configurações
./scripts/mobile-build-and-run.sh clean

# Mostrar ajuda
./scripts/mobile-build-and-run.sh help
```

## 📋 Pré-requisitos

### Requisitos Gerais
- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **Git**

### Para Android
- **Java Development Kit (JDK)** 8 ou superior
- **Android Studio** com:
  - Android SDK
  - Android SDK Build-tools
  - Android SDK Platform-tools
  - Android SDK Command-line tools
- **Variáveis de ambiente**:
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export ANDROID_SDK_ROOT=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

### Para iOS (apenas macOS)
- **macOS** 10.15 ou superior
- **Xcode** 12 ou superior
- **iOS Simulator**
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```

## 🔧 Configuração Inicial

### 1. Instalação das Dependências

```bash
# Instalar dependências do projeto
npm install

# Instalar Capacitor CLI globalmente
npm install -g @capacitor/cli

# Verificar instalação
cap --version
```

### 2. Configuração do Android

1. **Instalar Android Studio**: https://developer.android.com/studio
2. **Configurar SDK**:
   - Abrir Android Studio
   - Ir em File > Settings > System Settings > Android SDK
   - Instalar as versões necessárias do Android (recomendado: API 31+)
3. **Configurar variáveis de ambiente** (adicionar ao ~/.bashrc ou ~/.zshrc):
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export ANDROID_SDK_ROOT=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
   ```
4. **Verificar configuração**:
   ```bash
   adb version
   ```

### 3. Configuração do iOS (macOS apenas)

1. **Instalar Xcode** da App Store
2. **Aceitar termos de licença**:
   ```bash
   sudo xcodebuild -license accept
   ```
3. **Instalar simulador iOS**:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

## 📱 Detalhes das Plataformas

### Android

#### Emulador
O script cria automaticamente um emulador Android com as seguintes especificações:
- **Nome**: HealthTracker_Emulator
- **Dispositivo**: Pixel
- **API Level**: 31
- **Arquitetura**: x86_64
- **Google APIs**: Habilitadas

#### Build e Execução
1. O script verifica se o Android SDK está configurado
2. Cria o emulador se não existir
3. Inicia o emulador
4. Faz o build da aplicação
5. Instala e executa no emulador

#### Troubleshooting Android
```bash
# Verificar dispositivos conectados
adb devices

# Verificar logs do emulador
adb logcat

# Reiniciar ADB
adb kill-server && adb start-server

# Listar emuladores disponíveis
emulator -list-avds
```

### iOS

#### Simulador
O script utiliza o iOS Simulator do Xcode:
- Detecta automaticamente simuladores disponíveis
- Prioriza dispositivos iPhone
- Utiliza a versão mais recente do iOS disponível

#### Build e Execução
1. Verifica se o Xcode está instalado
2. Lista simuladores disponíveis
3. Faz o build da aplicação
4. Executa no simulador iOS

#### Troubleshooting iOS
```bash
# Listar simuladores disponíveis
xcrun simctl list devices

# Resetar simulador
xcrun simctl erase all

# Verificar versão do Xcode
xcodebuild -version
```

## 🌐 Configuração de Rede

O script configura automaticamente o backend para aceitar conexões externas:

1. **Detecção de IP**: Detecta automaticamente o IP da máquina local
2. **Configuração do Capacitor**: Atualiza `capacitor.config.ts` para usar o IP local
3. **Backend**: Configura o servidor para escutar em `0.0.0.0:5000`
4. **CORS**: Permite conexões de qualquer origem durante desenvolvimento

### Configuração Manual do IP

Se a detecção automática falhar:

```bash
# Encontrar IP manualmente
ifconfig  # macOS/Linux
ipconfig  # Windows

# Editar capacitor.config.ts
# Substituir a linha:
url: 'http://SEU_IP_LOCAL:5000',
```

## 🔄 Processo de Build

### 1. Preparação
- Verificação de pré-requisitos
- Detecção do IP local
- Backup das configurações originais

### 2. Configuração
- Atualização do `capacitor.config.ts`
- Instalação de plugins nativos
- Configuração das plataformas

### 3. Build
- Build do frontend (Vite)
- Sincronização com Capacitor
- Preparação dos assets nativos

### 4. Execução
- Início do backend local
- Criação/início dos emuladores
- Build e instalação nos dispositivos
- Execução da aplicação

## 📊 Monitoramento

### Logs Disponíveis

```bash
# Log do backend
tail -f backend.log

# Log do emulador Android
adb logcat | grep HealthTracker

# Log do simulador iOS
xcrun simctl spawn booted log stream --predicate 'subsystem contains "HealthTracker"'
```

### Verificação de Status

```bash
# Verificar se o backend está rodando
curl http://localhost:5000/api/health

# Verificar dispositivos conectados
adb devices  # Android
xcrun simctl list devices  # iOS

# Verificar processos
ps aux | grep -E "(node|emulator|simulator)"
```

## 🧹 Limpeza e Troubleshooting

### Limpeza Automática
```bash
./scripts/mobile-build-and-run.sh clean
```

### Limpeza Manual
```bash
# Parar todos os processos
pkill -f "node.*server"
pkill -f emulator
killall "iOS Simulator"

# Restaurar configurações
mv capacitor.config.ts.backup capacitor.config.ts

# Limpar cache do Capacitor
npx cap clean
npm run build
npx cap sync
```

### Problemas Comuns

#### 1. Erro "Android SDK not found"
```bash
# Verificar variáveis de ambiente
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT

# Configurar manualmente
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### 2. Erro "No devices/emulators found"
```bash
# Android
adb kill-server && adb start-server
adb devices

# iOS
xcrun simctl delete unavailable
```

#### 3. Erro de conexão com o backend
```bash
# Verificar se o backend está rodando
netstat -an | grep 5000

# Verificar IP local
hostname -I

# Testar conectividade
curl http://SEU_IP:5000/api/health
```

#### 4. Erro de build do frontend
```bash
# Limpar cache
rm -rf frontend/node_modules
rm -rf frontend/dist
npm install
npm run build
```

## 🔐 Segurança

### Desenvolvimento Local
- O script configura `cleartext: true` apenas para desenvolvimento
- Certifique-se de reverter as configurações antes do build de produção
- Use HTTPS em produção

### Variáveis de Ambiente
```bash
# .env.local (não commitado)
ANDROID_HOME=/path/to/android/sdk
DEVELOPMENT_IP=192.168.1.100
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Setup](https://developer.android.com/studio/install)
- [Xcode Setup](https://developer.apple.com/xcode/)

### Comandos Úteis
```bash
# Capacitor
npx cap doctor          # Verificar configuração
npx cap ls              # Listar plugins
npx cap open android    # Abrir no Android Studio
npx cap open ios        # Abrir no Xcode

# Debug
npx cap run android --list    # Listar dispositivos Android
npx cap run ios --list        # Listar simuladores iOS
```

## 🤝 Contribuição

Para melhorar os scripts:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Teste em diferentes ambientes
4. Documente as mudanças
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `tail -f backend.log`
2. Execute o diagnostic: `npx cap doctor`
3. Limpe o ambiente: `./scripts/mobile-build-and-run.sh clean`
4. Abra uma issue no repositório

---

**Nota**: Este script foi desenvolvido e testado em ambientes Linux e macOS. Para Windows, algumas adaptações podem ser necessárias.
