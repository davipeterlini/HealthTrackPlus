# Scripts de Instalação e Configuração do Android Studio

Este repositório contém scripts para automatizar a instalação e configuração do Android Studio em diferentes plataformas.

## Conteúdo

- `install_android_studio.sh`: Script para instalação em Linux e macOS
- `install_android_studio.bat`: Script para instalação em Windows
- `README.md`: Este arquivo de documentação

## Requisitos

### Windows
- Windows 10 ou superior
- Privilégios de administrador (para instalação completa)
- PowerShell 5.0 ou superior
- Conexão com a Internet

### macOS
- macOS 10.14 (Mojave) ou superior
- Privilégios de administrador
- Conexão com a Internet

### Linux
- Distribuição baseada em Debian, Red Hat ou Arch
- Privilégios de sudo
- Conexão com a Internet

## Como usar

### Windows

1. Baixe o arquivo `install_android_studio.bat`
2. Clique com o botão direito e selecione "Executar como administrador"
3. Siga as instruções na tela
4. Após a instalação completa do Android Studio e SDK, execute o script `create_android_avd.bat` criado em seu diretório de usuário para configurar um dispositivo virtual

### macOS e Linux

1. Baixe o arquivo `install_android_studio.sh`
2. Abra o Terminal e navegue até o diretório onde o arquivo foi baixado
3. Torne o script executável:
   ```
   chmod +x install_android_studio.sh
   ```
4. Execute o script:
   ```
   ./install_android_studio.sh
   ```
5. Após a instalação completa do Android Studio e SDK, execute o script `create_avd.sh` criado em seu diretório home para configurar um dispositivo virtual

## O que os scripts fazem

### Instalação
- Verifica e instala pré-requisitos (Java JDK)
- Baixa a versão mais recente do Android Studio
- Instala o Android Studio no local padrão

### Configuração
- Configura o diretório do SDK Android
- Cria arquivos de configuração básicos
- Prepara scripts para criação de dispositivos virtuais

### Criação de Dispositivo Virtual
- Fornece um script separado para criar um dispositivo virtual Android
- Configura um dispositivo Pixel 6 com a versão mais recente do Android
- Aceita automaticamente as licenças necessárias

## Notas importantes

- Os scripts baixam a versão 2023.1.1.26 do Android Studio (a mais recente no momento da criação)
- Para versões mais recentes, você pode precisar atualizar as URLs de download nos scripts
- A criação do dispositivo virtual requer que o SDK esteja completamente instalado
- Em alguns casos, pode ser necessário reiniciar o computador após a instalação do JDK

## Solução de problemas

### Windows
- Se o script falhar ao baixar arquivos, verifique sua conexão com a Internet ou baixe manualmente os instaladores
- Se o Java não for adicionado ao PATH, adicione manualmente o diretório bin do JDK

### macOS
- Se o script falhar com erro de permissão, verifique se você tem privilégios de administrador
- Se o Homebrew falhar na instalação, consulte [brew.sh](https://brew.sh) para instruções alternativas

### Linux
- Se o script não detectar seu gerenciador de pacotes, instale manualmente o OpenJDK 11
- Em algumas distribuições, pode ser necessário instalar pacotes adicionais para suporte a 32 bits

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.