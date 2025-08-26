@echo off
REM Script to set up the local PostgreSQL database for HealthTrackPlus

echo ================================================
echo HealthTrackPlus Database Setup
echo ================================================

REM Check if PostgreSQL is installed
where psql >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo PostgreSQL is not installed. Please install PostgreSQL first.
  echo Visit: https://www.postgresql.org/download/
  exit /b 1
)

echo PostgreSQL is installed.

REM Check if database exists
echo Checking if database exists...
psql -U postgres -lqt | findstr healthtrackplus >nul
if %ERRORLEVEL% equ 0 (
  echo Database 'healthtrackplus' already exists.
) else (
  echo Creating database 'healthtrackplus'...
  psql -U postgres -c "CREATE DATABASE healthtrackplus;"
  if %ERRORLEVEL% neq 0 (
    echo Failed to create database. Please check your PostgreSQL installation.
    exit /b 1
  )
  echo Database created successfully.
)

REM Push the database schema
echo Setting up database schema...
call npm run db:push
if %ERRORLEVEL% neq 0 (
  echo Failed to set up database schema.
  echo This may be due to connection issues or missing environment variables.
  exit /b 1
)

echo Database schema set up successfully.
echo ================================================
echo Database setup complete!
echo ================================================

pause