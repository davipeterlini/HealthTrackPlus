#!/bin/bash
# Script to restore database from backup for HealthTrackPlus
# Usage: ./restore-db.sh -e [dev|staging|prod] -b [backup-id]

set -e

# Default values
PROJECT_PREFIX="healthtrackplus"
ENVIRONMENT=""
BACKUP_ID=""

# Parse command line arguments
while getopts ":e:b:" opt; do
  case ${opt} in
    e)
      ENVIRONMENT=$OPTARG
      ;;
    b)
      BACKUP_ID=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: ./restore-db.sh -e [dev|staging|prod] -b [backup-id]" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      echo "Usage: ./restore-db.sh -e [dev|staging|prod] -b [backup-id]" >&2
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

if [[ -z "$BACKUP_ID" ]]; then
  echo "Backup ID (-b) is required" >&2
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

# Check if the backup exists
echo "Checking if backup exists..."
BACKUP_EXISTS=$(gcloud sql backups list --instance=${DB_INSTANCE} --filter="id=${BACKUP_ID}" --format="value(id)")

if [[ -z "$BACKUP_EXISTS" ]]; then
  echo "Backup with ID ${BACKUP_ID} not found for instance ${DB_INSTANCE}" >&2
  echo "Available backups:" >&2
  gcloud sql backups list --instance=${DB_INSTANCE} --format="table(id, window_start_time, status, type, description)" >&2
  exit 1
fi

# Confirm restoration
echo "WARNING: This will restore database ${DB_INSTANCE} from backup ${BACKUP_ID}"
echo "All current data will be overwritten."
read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restoration cancelled."
  exit 0
fi

# Restore backup
echo "Restoring database from backup ${BACKUP_ID}..."
gcloud sql backups restore ${BACKUP_ID} --restore-instance=${DB_INSTANCE}

echo "Restoration initiated successfully!"
echo "Check the restoration status with:"
echo "gcloud sql operations list --instance=${DB_INSTANCE} --filter=\"RESTORE\""