#!/bin/bash
# Script to rotate secrets in Secret Manager for HealthTrackPlus
# Usage: ./rotate-secrets.sh -e [dev|staging|prod] -s [secret-name]

set -e

# Default values
PROJECT_PREFIX="healthtrackplus"
ENVIRONMENT=""
SECRET_NAME=""

# Parse command line arguments
while getopts ":e:s:" opt; do
  case ${opt} in
    e)
      ENVIRONMENT=$OPTARG
      ;;
    s)
      SECRET_NAME=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: ./rotate-secrets.sh -e [dev|staging|prod] -s [secret-name]" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      echo "Usage: ./rotate-secrets.sh -e [dev|staging|prod] -s [secret-name]" >&2
      exit 1
      ;;
  esac
done

# Validate required parameters
if [[ -z "$ENVIRONMENT" ]]; then
  echo "Environment (-e) is required. Must be one of: dev, staging, prod" >&2
  exit 1
fi

if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo "Environment must be one of: dev, staging, prod" >&2
  exit 1
fi

if [[ -z "$SECRET_NAME" ]]; then
  echo "Secret name (-s) is required" >&2
  exit 1
fi

# Set project ID
PROJECT_ID="${PROJECT_PREFIX}-${ENVIRONMENT}"

# Set project as current
gcloud config set project "${PROJECT_ID}"

# Check if the secret exists
echo "Checking if secret exists..."
SECRET_EXISTS=$(gcloud secrets describe ${SECRET_NAME} 2>/dev/null || echo "")

if [[ -z "$SECRET_EXISTS" ]]; then
  echo "Secret ${SECRET_NAME} not found in project ${PROJECT_ID}" >&2
  echo "Available secrets:" >&2
  gcloud secrets list --format="table(name)" >&2
  exit 1
fi

# Generate new secret value or prompt for it
if [[ "$SECRET_NAME" == *"password"* || "$SECRET_NAME" == *"key"* || "$SECRET_NAME" == *"token"* ]]; then
  echo "Generating random value for ${SECRET_NAME}..."
  SECRET_VALUE=$(openssl rand -base64 32)
else
  echo "Enter new value for ${SECRET_NAME}:"
  read -s SECRET_VALUE
  echo
fi

# Add new version to the secret
echo "Adding new version to secret ${SECRET_NAME}..."
echo -n "${SECRET_VALUE}" | gcloud secrets versions add ${SECRET_NAME} --data-file=-

echo "Secret ${SECRET_NAME} rotated successfully!"

# If this is a database password, update the database
if [[ "$SECRET_NAME" == "db-password" ]]; then
  echo "This appears to be a database password. Do you want to update the database user password?"
  read -p "Update database password? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Get database instance and user
    DB_INSTANCE=$(gcloud sql instances list --format="value(name)" --filter="labels.environment=${ENVIRONMENT}")
    DB_USER=$(gcloud secrets versions access latest --secret="db-user-${ENVIRONMENT}" 2>/dev/null || echo "app")
    
    echo "Updating password for user ${DB_USER} on database instance ${DB_INSTANCE}..."
    gcloud sql users set-password ${DB_USER} \
        --instance=${DB_INSTANCE} \
        --password="${SECRET_VALUE}"
    
    echo "Database password updated successfully!"
  fi
fi

echo ""
echo "Services using this secret may need to be restarted to pick up the new value."