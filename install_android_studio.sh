#!/bin/bash

# Script para instalação e configuração do Android Studio
# Suporta macOS e Linux

echo "=== Script de Instalação e Configuração do Android Studio ==="
echo ""

# Detectar o sistema operacional
OS="$(uname -s)"
case "${OS}" in
    Linux*)     SYSTEM=linux;;
    Darwin*)    SYSTEM=mac;;
    *)          SYSTEM="UNKNOWN";;
esac

if [ "$SYSTEM" = "UNKNOWN" ]; then
    echo "Sistema operacional não suportado. Este script funciona apenas em Linux e macOS."
    exit 1
fi

echo "Sistema operacional detectado: $SYSTEM"
echo ""

# Diretório de instalação
if [ "$SYSTEM" = "mac" ]; then
    INSTALL_DIR="/Applications"
    ANDROID_STUDIO_DIR="$INSTALL_DIR/Android Studio.app"
    STUDIO_BIN="$ANDROID_STUDIO_DIR/Contents/MacOS/studio"
else
    INSTALL_DIR="$HOME"
    ANDROID_STUDIO_DIR="$INSTALL_DIR/android-studio"
    STUDIO_BIN="$ANDROID_STUDIO_DIR/bin/studio.sh"
fi

# Diretório SDK
SDK_DIR="$HOME/Android/Sdk"

# Função para instalar dependências no Linux
install_linux_dependencies() {
    echo "Instalando dependências para Linux..."
    
    # Detectar o gerenciador de pacotes
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y openjdk-11-jdk libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y java-11-openjdk-devel zlib.i686 ncurses-libs.i686 bzip2-libs.i686
    elif command -v pacman &> /dev/null; then
        sudo pacman -Syu --noconfirm jdk11-openjdk lib32-zlib lib32-ncurses lib32-bzip2
    else
        echo "Gerenciador de pacotes não reconhecido. Por favor, instale manualmente:"
        echo "- OpenJDK 11"
        echo "- Bibliotecas de 32 bits (zlib, ncurses, bzip2)"
    fi
    
    echo "Dependências instaladas."
}

# Função para instalar dependências no macOS
install_mac_dependencies() {
    echo "Instalando dependências para macOS..."
    
    # Verificar se o Homebrew está instalado
    if ! command -v brew &> /dev/null; then
        echo "Homebrew não encontrado. Instalando..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Instalar OpenJDK
    brew install --cask adoptopenjdk/openjdk/adoptopenjdk11
    
    echo "Dependências instaladas."
}

# Função para baixar e instalar o Android Studio
download_and_install() {
    echo "Baixando Android Studio..."
    
    # URLs de download
    if [ "$SYSTEM" = "mac" ]; then
        if [[ $(uname -m) == 'arm64' ]]; then
            # Para Mac com Apple Silicon (M1/M2)
            DOWNLOAD_URL="https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-mac_arm.dmg"
        else
            # Para Mac com Intel
            DOWNLOAD_URL="https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-mac.dmg"
        fi
        
        # Baixar o DMG
        curl -L -o /tmp/android-studio.dmg "$DOWNLOAD_URL"
        
        echo "Montando imagem DMG..."
        hdiutil attach /tmp/android-studio.dmg
        
        echo "Instalando Android Studio..."
        cp -R "/Volumes/Android Studio/Android Studio.app" "/Applications/"
        
        echo "Desmontando imagem DMG..."
        hdiutil detach "/Volumes/Android Studio"
        
        echo "Removendo arquivo DMG..."
        rm /tmp/android-studio.dmg
        
    else # Linux
        DOWNLOAD_URL="https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.26/android-studio-2023.1.1.26-linux.tar.gz"
        
        # Baixar o arquivo tar.gz
        curl -L -o /tmp/android-studio.tar.gz "$DOWNLOAD_URL"
        
        echo "Extraindo Android Studio..."
        tar -xzf /tmp/android-studio.tar.gz -C "$INSTALL_DIR"
        
        echo "Removendo arquivo tar.gz..."
        rm /tmp/android-studio.tar.gz
        
        # Criar atalho no desktop
        echo "Criando atalho no desktop..."
        cat > "$HOME/Desktop/android-studio.desktop" << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=Android Studio
Comment=Android Studio IDE
Exec=$STUDIO_BIN
Icon=$ANDROID_STUDIO_DIR/bin/studio.png
Terminal=false
Categories=Development;IDE;
EOL
        chmod +x "$HOME/Desktop/android-studio.desktop"
    fi
    
    echo "Android Studio instalado com sucesso!"
}

# Função para configurar o Android Studio
configure_android_studio() {
    echo "Configurando Android Studio..."
    
    # Criar diretório para o SDK
    mkdir -p "$SDK_DIR"
    
    # Criar arquivo de propriedades para configuração
    mkdir -p "$HOME/.android"
    cat > "$HOME/.android/studio.properties" << EOL
# Android Studio properties
sdk.dir=$SDK_DIR
EOL
    
    echo "Configuração básica concluída."
    echo "Nota: Ao iniciar o Android Studio pela primeira vez, você precisará:"
    echo "1. Aceitar os termos de licença"
    echo "2. Escolher 'Standard' como tipo de instalação"
    echo "3. O SDK será instalado automaticamente no diretório: $SDK_DIR"
}

# Função para criar um dispositivo virtual (AVD)
create_virtual_device() {
    echo "Configurando um dispositivo virtual Android..."
    echo "Nota: Esta etapa será executada após a primeira inicialização do Android Studio."
    echo "Instruções para criar um dispositivo virtual:"
    echo "1. Abra o Android Studio"
    echo "2. Clique em 'More Actions' > 'Virtual Device Manager'"
    echo "3. Clique em 'Create Device'"
    echo "4. Selecione 'Pixel 6' (ou outro dispositivo de sua preferência)"
    echo "5. Clique em 'Next'"
    echo "6. Selecione a versão mais recente do Android (ex: Android 14.0)"
    echo "7. Clique em 'Next' e depois em 'Finish'"
    
    # Script para criar AVD via linha de comando (executado após a instalação do SDK)
    cat > "$HOME/create_avd.sh" << EOL
#!/bin/bash

# Verificar se o ANDROID_SDK_ROOT está definido
if [ -z "\$ANDROID_SDK_ROOT" ]; then
    ANDROID_SDK_ROOT="$SDK_DIR"
fi

# Verificar se o sdkmanager e avdmanager existem
if [ ! -f "\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "SDK Manager não encontrado. Certifique-se de que o Android SDK está instalado corretamente."
    exit 1
fi

# Aceitar licenças
echo "Aceitando licenças..."
yes | \$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager --licenses

# Instalar pacotes necessários
echo "Instalando pacotes necessários..."
\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "system-images;android-34;google_apis;x86_64"

# Criar AVD
echo "Criando dispositivo virtual..."
\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/avdmanager create avd \\
    --name "Pixel_6_API_34" \\
    --package "system-images;android-34;google_apis;x86_64" \\
    --device "pixel_6"

echo "Dispositivo virtual criado com sucesso!"
EOL
    
    chmod +x "$HOME/create_avd.sh"
    echo "Script para criar AVD salvo em: $HOME/create_avd.sh"
    echo "Execute este script após a instalação completa do Android Studio e SDK."
}

# Função principal
main() {
    echo "Iniciando instalação do Android Studio..."
    
    # Instalar dependências
    if [ "$SYSTEM" = "mac" ]; then
        install_mac_dependencies
    else
        install_linux_dependencies
    fi
    
    # Baixar e instalar Android Studio
    download_and_install
    
    # Configurar Android Studio
    configure_android_studio
    
    # Criar dispositivo virtual
    create_virtual_device
    
    echo ""
    echo "=== Instalação e configuração concluídas! ==="
    echo "Para iniciar o Android Studio:"
    if [ "$SYSTEM" = "mac" ]; then
        echo "Abra o Launchpad e clique no ícone do Android Studio"
    else
        echo "Execute: $STUDIO_BIN"
    fi
    echo ""
    echo "Após a primeira inicialização e instalação do SDK, execute:"
    echo "$HOME/create_avd.sh para criar um dispositivo virtual Android"
}

# Executar função principal
main