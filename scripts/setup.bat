@echo off
REM HealthTrackPlus Setup Script for Windows
REM This script sets up the HealthTrackPlus application for local development on Windows

echo ================================================
echo HealthTrackPlus Setup Script
echo ================================================
echo This script will help you set up the HealthTrackPlus application for local development.
echo It will:
echo   1. Check and install dependencies
echo   2. Set up the database
echo   3. Configure the environment
echo   4. Set up mobile development (optional)
echo ================================================
echo.

REM Change to the project root directory
cd %~dp0\..

REM Check if Node.js is installed
echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Node.js is not installed. Please install Node.js 18+ and try again.
  echo Visit: https://nodejs.org/en/download/
  exit /b 1
)

node -v
echo Node.js is installed.

REM Check if npm is installed
echo Checking npm installation...
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo npm is not installed. Please install npm and try again.
  exit /b 1
)
echo npm is installed.

REM Check if PostgreSQL is installed (optional but recommended)
echo Checking PostgreSQL installation...
where psql >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo PostgreSQL is not installed. The application requires PostgreSQL for the database.
  echo You can continue setup, but you'll need to install PostgreSQL before running the app.
  echo Visit: https://www.postgresql.org/download/
  set POSTGRES_INSTALLED=false
) else (
  echo PostgreSQL is installed.
  set POSTGRES_INSTALLED=true
)

REM Install project dependencies
echo Installing project dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo Failed to install dependencies. Please check the error messages above.
  exit /b 1
)
echo Dependencies installed successfully.

REM Create .env file if it doesn't exist
if not exist .env (
  echo Creating .env file...
  echo # Database configuration > .env
  echo DATABASE_URL=postgres://postgres:postgres@localhost:5432/healthtrackplus >> .env
  echo. >> .env
  echo # Server configuration >> .env
  echo PORT=5000 >> .env
  echo NODE_ENV=development >> .env
  echo. >> .env
  echo # JWT configuration >> .env
  echo JWT_SECRET=windows_setup_change_this_to_a_secure_random_string >> .env
  echo .env file created.
  echo WARNING: Please update the JWT_SECRET in your .env file with a secure random string.
) else (
  echo .env file already exists. Skipping creation.
)

REM Check if the database exists and set it up if PostgreSQL is installed
if "%POSTGRES_INSTALLED%"=="true" (
  echo Setting up database schema...
  call npm run db:push
  if %ERRORLEVEL% neq 0 (
    echo Failed to set up database schema. Please check the error messages above.
    echo You may need to update the DATABASE_URL in your .env file.
  ) else (
    echo Database schema set up successfully.
  )
)

REM Ask if the user wants to set up for mobile development
echo.
echo Mobile Development Setup
set /p SETUP_MOBILE=Do you want to set up the environment for mobile development? (y/n): 
if /i "%SETUP_MOBILE%"=="y" (
  echo Setting up mobile development environment...
  call npm run mobile:setup
  if %ERRORLEVEL% neq 0 (
    echo Failed to set up mobile development environment. Please check the error messages above.
  ) else (
    echo Mobile development environment set up successfully.
  )
)

REM Final instructions
echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo To start the development server, run:
echo   npm run dev:start
echo.
echo To run on Android:
echo   npm run mobile:android
echo.
echo The application will be available at http://localhost:3000
echo ================================================

pause