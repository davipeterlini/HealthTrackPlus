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

# Remove node_modules, android, and ios directories
remove_dir "node_modules"
remove_dir "android"
remove_dir "ios"

echo "Mobile build cleaned successfully!"