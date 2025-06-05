#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to remove a directory if it exists
remove_dir() {
  if [ -d "$1" ]; then
    echo "Removing $1..."
    rm -rf "$1"
  else
    echo "$1 does not exist. Skipping..."
  fi
}

# Remove node_modules, android, ios, and dist directories
remove_dir "node_modules"
remove_dir "android"
remove_dir "ios"
remove_dir "frontend/dist"

echo "Mobile build cleaned successfully!"