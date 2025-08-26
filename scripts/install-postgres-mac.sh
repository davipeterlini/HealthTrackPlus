#!/bin/bash
# Script to install PostgreSQL on macOS

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}PostgreSQL Installation for macOS${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Homebrew is not installed. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Homebrew. Please install manually.${NC}"
        echo -e "Visit: https://brew.sh"
        exit 1
    fi
    
    echo -e "${GREEN}Homebrew installed successfully!${NC}"
else
    echo -e "${GREEN}Homebrew is already installed.${NC}"
fi

# Update Homebrew
echo -e "${GREEN}Updating Homebrew...${NC}"
brew update

# Install PostgreSQL
echo -e "${GREEN}Installing PostgreSQL...${NC}"
brew install postgresql@15

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install PostgreSQL. Try installing manually.${NC}"
    echo -e "Run: brew install postgresql@15"
    exit 1
fi

# Start PostgreSQL service
echo -e "${GREEN}Starting PostgreSQL service...${NC}"
brew services start postgresql@15

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start PostgreSQL service.${NC}"
    echo -e "Run manually: brew services start postgresql@15"
    exit 1
fi

echo -e "${GREEN}Waiting for PostgreSQL to initialize...${NC}"
sleep 5

# On macOS, we don't need to create a postgres user, as the system user is used by default
echo -e "${GREEN}Checking current PostgreSQL user...${NC}"
CURRENT_USER=$(whoami)
echo -e "${GREEN}Using user: $CURRENT_USER${NC}"

# Check if database exists and create if necessary
echo -e "${GREEN}Checking and creating healthtrackplus database if needed...${NC}"
if /opt/homebrew/opt/postgresql@15/bin/psql -lqt | cut -d \| -f 1 | grep -qw healthtrackplus; then
    echo -e "${YELLOW}Database 'healthtrackplus' already exists.${NC}"
else
    /opt/homebrew/opt/postgresql@15/bin/createdb healthtrackplus
    echo -e "${GREEN}Database 'healthtrackplus' created successfully.${NC}"
fi

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}PostgreSQL installed and configured successfully!${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "Summary:"
echo -e "- PostgreSQL 15 installed"
echo -e "- Service started automatically"
echo -e "- Using system user '$CURRENT_USER'"
echo -e "- Database 'healthtrackplus' checked/created"
echo -e "${BLUE}================================================${NC}"
echo -e "Now you can run: npm run db:push"
echo -e "${BLUE}================================================${NC}"