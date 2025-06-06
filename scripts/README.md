# Scripts de Automação para Desenvolvimento Mobile

Este diretório contém scripts de automação para facilitar o desenvolvimento e build de aplicações móveis usando Capacitor.

## Visão Geral

Os scripts nesta pasta são projetados para automatizar tarefas comuns no desenvolvimento de aplicações móveis híbridas, incluindo:

- Configuração de plataformas (iOS e Android)
- Build do frontend para dispositivos móveis
- Sincronização de código com plataformas nativas

## Scripts Disponíveis

### add-platforms.sh

Este script configura as plataformas móveis para o projeto.

**Funcionalidades:**
- Verifica se o Capacitor está inicializado
- Adiciona plataformas iOS e Android
- Instala plugins nativos essenciais:
  - Camera
  - Device
  - App
  - Haptics
  - Status Bar
  - Splash Screen
  - Filesystem
  - Preferences
  - Share
  - Browser
  - Network
  - Geolocation
- Sincroniza as plataformas

**Uso:**
```bash
./scripts/add-platforms.sh
```

### build-mobile.sh

Este script realiza o build do frontend para dispositivos móveis.

**Funcionalidades:**
- Verifica se o Capacitor CLI está instalado
- Realiza o build do frontend
- Sincroniza com o Capacitor
- Adiciona plataformas iOS e Android (se não existirem)
- Copia assets e realiza sincronização final

**Uso:**
```bash
./scripts/build-mobile.sh
```

## Pré-requisitos

Para utilizar estes scripts, você precisa ter:

1. Node.js e npm instalados
2. Capacitor configurado no projeto
3. Para desenvolvimento iOS:
   - macOS
   - Xcode instalado
4. Para desenvolvimento Android:
   - Android Studio instalado
   - JDK configurado

## Fluxo de Trabalho Recomendado

1. Execute `./scripts/add-platforms.sh` para configurar as plataformas móveis
2. Execute `./scripts/build-mobile.sh` para fazer o build do frontend
3. Para abrir no Xcode: `npx cap open ios`
4. Para abrir no Android Studio: `npx cap open android`
5. Para executar no dispositivo:
   - iOS: `npx cap run ios`
   - Android: `npx cap run android`

## Permissões

Certifique-se de que os scripts têm permissão de execução:

```bash
chmod +x scripts/add-platforms.sh
chmod +x scripts/build-mobile.sh
```

## Notas Adicionais

- Os scripts assumem que o projeto está estruturado com uma pasta `frontend` contendo o código da aplicação web
- O Capacitor é usado para empacotar a aplicação web como um aplicativo móvel nativo
- Plugins nativos são instalados para fornecer acesso a recursos do dispositivo como câmera, geolocalização, etc.