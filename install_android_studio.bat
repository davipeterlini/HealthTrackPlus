@echo off
:: Script para instalação e configuração do Android Studio no Windows
:: Autor: [Seu Nome]
:: Data: [Data Atual]

echo === Script de Instalação e Configuração do Android Studio para Windows ===
echo.

:: Definir diretórios
set "INSTALL_DIR=%USERPROFILE%\Android"
set "SDK_DIR=%USERPROFILE%\AppData\Local\Android\Sdk"
set "DOWNLOAD_DIR=%TEMP%"
set "STUDIO_URL=https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.26/android-studio-2023.1.1.26-windows.exe"
set "JDK_URL=https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip"

:: Verificar se o PowerShell está disponível
where powershell >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo PowerShell não encontrado. Este script requer PowerShell para download de arquivos.
    exit /b 1
)

:: Criar diretórios necessários
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo Verificando pré-requisitos...

:: Verificar se o Java está instalado
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Java não encontrado. Baixando e instalando OpenJDK 11...
    
    :: Baixar OpenJDK
    echo Baixando OpenJDK 11...
    powershell -Command "& {Invoke-WebRequest -Uri '%JDK_URL%' -OutFile '%DOWNLOAD_DIR%\openjdk.zip'}"
    
    :: Extrair OpenJDK
    echo Extraindo OpenJDK...
    powershell -Command "& {Expand-Archive -Path '%DOWNLOAD_DIR%\openjdk.zip' -DestinationPath '%INSTALL_DIR%\jdk' -Force}"
    
    :: Adicionar Java ao PATH
    echo Adicionando Java ao PATH...
    setx PATH "%PATH%;%INSTALL_DIR%\jdk\jdk-11.0.2\bin" /M
    
    echo Java instalado com sucesso!
) else (
    echo Java já está instalado.
)

:: Baixar Android Studio
echo.
echo Baixando Android Studio...
powershell -Command "& {Invoke-WebRequest -Uri '%STUDIO_URL%' -OutFile '%DOWNLOAD_DIR%\android-studio-installer.exe'}"

:: Instalar Android Studio
echo.
echo Instalando Android Studio...
echo NOTA: Uma janela de instalação será aberta. Siga as instruções na tela.
echo Recomendações:
echo  - Instale para todos os usuários (se tiver permissão de administrador)
echo  - Mantenha o diretório de instalação padrão
echo  - Instale também o Android Virtual Device
echo.
echo Pressione qualquer tecla para iniciar a instalação...
pause > nul
start /wait "" "%DOWNLOAD_DIR%\android-studio-installer.exe"

:: Limpar arquivos temporários
echo.
echo Limpando arquivos temporários...
del "%DOWNLOAD_DIR%\android-studio-installer.exe"
if exist "%DOWNLOAD_DIR%\openjdk.zip" del "%DOWNLOAD_DIR%\openjdk.zip"

:: Criar arquivo de configuração para o SDK
echo.
echo Configurando Android SDK...
if not exist "%USERPROFILE%\.android" mkdir "%USERPROFILE%\.android"
echo # Android Studio properties > "%USERPROFILE%\.android\studio.properties"
echo sdk.dir=%SDK_DIR% >> "%USERPROFILE%\.android\studio.properties"

:: Criar script PowerShell para configurar AVD
echo.
echo Criando script para configuração de dispositivo virtual...
set "AVD_SCRIPT=%USERPROFILE%\create_android_avd.ps1"

echo # Script para criar um dispositivo virtual Android > "%AVD_SCRIPT%"
echo # Certifique-se de executar este script após a instalação completa do Android Studio e SDK >> "%AVD_SCRIPT%"
echo. >> "%AVD_SCRIPT%"
echo $sdkManager = "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" >> "%AVD_SCRIPT%"
echo $avdManager = "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\avdmanager.bat" >> "%AVD_SCRIPT%"
echo. >> "%AVD_SCRIPT%"
echo Write-Host "Aceitando licenças..." >> "%AVD_SCRIPT%"
echo echo "y" | ^& $sdkManager --licenses >> "%AVD_SCRIPT%"
echo. >> "%AVD_SCRIPT%"
echo Write-Host "Instalando pacotes necessários..." >> "%AVD_SCRIPT%"
echo ^& $sdkManager "platform-tools" "platforms;android-34" "system-images;android-34;google_apis;x86_64" >> "%AVD_SCRIPT%"
echo. >> "%AVD_SCRIPT%"
echo Write-Host "Criando dispositivo virtual..." >> "%AVD_SCRIPT%"
echo ^& $avdManager create avd --name "Pixel_6_API_34" --package "system-images;android-34;google_apis;x86_64" --device "pixel_6" >> "%AVD_SCRIPT%"
echo. >> "%AVD_SCRIPT%"
echo Write-Host "Dispositivo virtual criado com sucesso!" >> "%AVD_SCRIPT%"

:: Criar atalho para o script
echo @echo off > "%USERPROFILE%\create_android_avd.bat"
echo powershell -ExecutionPolicy Bypass -File "%AVD_SCRIPT%" >> "%USERPROFILE%\create_android_avd.bat"
echo pause >> "%USERPROFILE%\create_android_avd.bat"

echo.
echo === Instalação e configuração concluídas! ===
echo.
echo Para iniciar o Android Studio:
echo  - Procure "Android Studio" no menu Iniciar
echo.
echo Após a primeira inicialização e instalação do SDK, execute:
echo  - %USERPROFILE%\create_android_avd.bat para criar um dispositivo virtual Android
echo.
echo Instruções para criar manualmente um dispositivo virtual:
echo  1. Abra o Android Studio
echo  2. Clique em 'More Actions' ^> 'Virtual Device Manager'
echo  3. Clique em 'Create Device'
echo  4. Selecione 'Pixel 6' (ou outro dispositivo de sua preferência)
echo  5. Clique em 'Next'
echo  6. Selecione a versão mais recente do Android (ex: Android 14.0)
echo  7. Clique em 'Next' e depois em 'Finish'
echo.

pause