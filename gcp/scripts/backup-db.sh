#!/bin/bash
# Script to create manual database backups for HealthTrackPlus
# Usage: ./backup-db.sh -e [dev|staging|prod] -d [description]

set -e

# Default values
PROJECT_PREFIX="healthtrackplus"
ENVIRONMENT=""
DESCRIPTION="Manual backup $(date +%Y-%m-%d)"

# Parse command line arguments
while getopts ":e:d:" opt; do
  case ${opt} in
    e)
      ENVIRONMENT=$OPTARG
      ;;
    d)
      DESCRIPTION=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: ./backup-db.sh -e [dev|staging|prod] -d [description]" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      echo "Usage: ./backup-db.sh -e [dev|staging|prod] -d [description]" >&2
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

# Set project ID
PROJECT_ID="${PROJECT_PREFIX}-${ENVIRONMENT}"

# Set project as current
gcloud config set project "${PROJECT_ID}"

# Get database instance name
echo "Fetching database instance name..."
DB_INSTANCE=$(gcloud sql instances list --format="value(name)" --filter="labels.environment=${ENVIRONMENT}")

if [[ -z "$DB_INSTANCE" ]]; then
  echo "No database instance found for environment ${ENVIRONMENT}" >&2
  exit 1
fi

echo "Creating backup for database instance ${DB_INSTANCE}..."
gcloud sql backups create --instance=${DB_INSTANCE} --description="${DESCRIPTION}"

echo "Backup created successfully!"
echo ""
echo "To list all backups:"
echo "gcloud sql backups list --instance=${DB_INSTANCE}"