#!/bin/bash
# Script to set up the local PostgreSQL database for HealthTrackPlus

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}HealthTrackPlus Database Setup${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if PostgreSQL is installed (try both global and Homebrew paths)
if command -v psql &> /dev/null; then
    PSQL_PATH="psql"
elif [ -f "/opt/homebrew/opt/postgresql@15/bin/psql" ]; then
    PSQL_PATH="/opt/homebrew/opt/postgresql@15/bin/psql"
    export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
else
    echo -e "${RED}PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    echo -e "Visit: https://www.postgresql.org/download/"
    echo -e "Or run: brew install postgresql@15"
    exit 1
fi

echo -e "${GREEN}PostgreSQL is installed. Using: $PSQL_PATH${NC}"

# Create database if it doesn't exist
echo -e "${GREEN}Checking if database exists...${NC}"
if $PSQL_PATH -lqt | cut -d \| -f 1 | grep -qw healthtrackplus; then
    echo -e "${YELLOW}Database 'healthtrackplus' already exists.${NC}"
else
    echo -e "${GREEN}Creating database 'healthtrackplus'...${NC}"
    if [ -x "/opt/homebrew/opt/postgresql@15/bin/createdb" ]; then
        /opt/homebrew/opt/postgresql@15/bin/createdb healthtrackplus
    else
        createdb healthtrackplus
    fi
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create database. Please check your PostgreSQL installation.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Database created successfully.${NC}"
fi

# Push the database schema
echo -e "${GREEN}Setting up database schema...${NC}"
npm run db:push
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set up database schema.${NC}"
    echo -e "${YELLOW}This may be due to connection issues or missing environment variables.${NC}"
    exit 1
fi

echo -e "${GREEN}Database schema set up successfully.${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Database setup complete!${NC}"
echo -e "${BLUE}================================================${NC}"