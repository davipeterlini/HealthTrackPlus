#!/bin/bash
# HealthTrackPlus Setup Script
# This script sets up the HealthTrackPlus application for local development

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# Main project directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Display intro
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}HealthTrackPlus Setup Script${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "This script will help you set up the HealthTrackPlus application for local development."
echo -e "It will:"
echo -e "  1. Check and install dependencies"
echo -e "  2. Set up the database"
echo -e "  3. Configure the environment"
echo -e "  4. Set up mobile development (optional)"
echo -e "${BLUE}================================================${NC}"
echo

# Check if Node.js is installed
echo -e "${GREEN}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js 18+ and try again.${NC}"
  echo -e "Visit: https://nodejs.org/en/download/"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
  echo -e "${RED}Node.js version $NODE_VERSION is installed, but version 18+ is required.${NC}"
  echo -e "Please update Node.js and try again."
  exit 1
fi
echo -e "${GREEN}Node.js version $NODE_VERSION is installed.${NC}"

# Check if npm is installed
echo -e "${GREEN}Checking npm installation...${NC}"
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm is not installed. Please install npm and try again.${NC}"
  exit 1
fi
echo -e "${GREEN}npm is installed.${NC}"

# Check if PostgreSQL is installed (optional but recommended)
echo -e "${GREEN}Checking PostgreSQL installation...${NC}"
if command -v psql &> /dev/null; then
  echo -e "${GREEN}PostgreSQL is installed.${NC}"
  POSTGRES_INSTALLED=true
else
  echo -e "${YELLOW}PostgreSQL is not installed. The application requires PostgreSQL for the database.${NC}"
  echo -e "${YELLOW}You can continue setup, but you'll need to install PostgreSQL before running the app.${NC}"
  echo -e "${YELLOW}Visit: https://www.postgresql.org/download/${NC}"
  POSTGRES_INSTALLED=false
fi

# Install project dependencies
echo -e "${GREEN}Installing project dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to install dependencies. Please check the error messages above.${NC}"
  exit 1
fi
echo -e "${GREEN}Dependencies installed successfully.${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo -e "${GREEN}Creating .env file...${NC}"
  cat > .env << EOF
# Database configuration
# Detect username for database URL
CURRENT_USER=$(whoami)
DATABASE_URL=postgres://$CURRENT_USER@localhost:5432/healthtrackplus

# Server configuration
PORT=5000
NODE_ENV=development

# JWT configuration (generate a secure random string)
JWT_SECRET=$(openssl rand -base64 32)
EOF
  echo -e "${GREEN}.env file created.${NC}"
else
  echo -e "${YELLOW}.env file already exists. Skipping creation.${NC}"
fi

# Check if the database exists
if [ "$POSTGRES_INSTALLED" = true ]; then
  echo -e "${GREEN}Checking if database exists...${NC}"
  if psql -lqt | cut -d \| -f 1 | grep -qw healthtrackplus; then
    echo -e "${GREEN}Database 'healthtrackplus' exists.${NC}"
  else
    echo -e "${YELLOW}Database 'healthtrackplus' does not exist.${NC}"
    read -p "Would you like to create the database now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${GREEN}Creating database...${NC}"
      createdb healthtrackplus
      if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create database. Please check your PostgreSQL installation.${NC}"
        echo -e "${YELLOW}You can create the database manually with: createdb healthtrackplus${NC}"
      else
        echo -e "${GREEN}Database created successfully.${NC}"
      fi
    fi
  fi

  # Push database schema
  echo -e "${GREEN}Setting up database schema...${NC}"
  npm run db:push
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set up database schema. Please check the error messages above.${NC}"
    echo -e "${YELLOW}You may need to update the DATABASE_URL in your .env file.${NC}"
  else
    echo -e "${GREEN}Database schema set up successfully.${NC}"
  fi
fi

# Ask if the user wants to set up for mobile development
echo
echo -e "${BLUE}Mobile Development Setup${NC}"
echo -e "${YELLOW}Do you want to set up the environment for mobile development?${NC}"
read -p "This will set up Capacitor for Android/iOS development (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Setting up mobile development environment...${NC}"
  npm run mobile:setup
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set up mobile development environment. Please check the error messages above.${NC}"
  else
    echo -e "${GREEN}Mobile development environment set up successfully.${NC}"
  fi
fi

# Final instructions
echo
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "To start the development server, run:"
echo -e "  ${YELLOW}npm run dev:start${NC}"
echo
echo -e "To run on Android:"
echo -e "  ${YELLOW}npm run mobile:android${NC}"
echo
echo -e "To run on iOS (macOS only):"
echo -e "  ${YELLOW}npm run mobile:ios${NC}"
echo
echo -e "The application will be available at http://localhost:3000"
echo -e "${BLUE}================================================${NC}"