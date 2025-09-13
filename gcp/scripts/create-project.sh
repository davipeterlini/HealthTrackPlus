#!/bin/bash
# Script to create and configure a new GCP project for HealthTrackPlus
# Usage: ./create-project.sh -e [dev|staging|prod] -b [billing-account-id] -o [organization-id]

set -e

# Default values
PROJECT_PREFIX="healthtrackplus"
ENVIRONMENT=""
BILLING_ACCOUNT=""
ORGANIZATION_ID=""
REGION="us-central1"

# Parse command line arguments
while getopts ":e:b:o:r:" opt; do
  case ${opt} in
    e)
      ENVIRONMENT=$OPTARG
      ;;
    b)
      BILLING_ACCOUNT=$OPTARG
      ;;
    o)
      ORGANIZATION_ID=$OPTARG
      ;;
    r)
      REGION=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: ./create-project.sh -e [dev|staging|prod] -b [billing-account-id] -o [organization-id] -r [region]" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      echo "Usage: ./create-project.sh -e [dev|staging|prod] -b [billing-account-id] -o [organization-id] -r [region]" >&2
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

if [[ -z "$BILLING_ACCOUNT" ]]; then
  echo "Billing account ID (-b) is required" >&2
  exit 1
fi

# Set project ID
PROJECT_ID="${PROJECT_PREFIX}-${ENVIRONMENT}"

# Create project
echo "Creating project: ${PROJECT_ID}"
if [[ -n "$ORGANIZATION_ID" ]]; then
  gcloud projects create "${PROJECT_ID}" --organization="${ORGANIZATION_ID}" --name="${PROJECT_PREFIX} ${ENVIRONMENT}"
else
  gcloud projects create "${PROJECT_ID}" --name="${PROJECT_PREFIX} ${ENVIRONMENT}"
fi

# Set project as current
gcloud config set project "${PROJECT_ID}"

# Link billing account
echo "Linking billing account ${BILLING_ACCOUNT} to project ${PROJECT_ID}"
gcloud billing projects link "${PROJECT_ID}" --billing-account="${BILLING_ACCOUNT}"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicenetworking.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable identitytoolkit.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudkms.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable firebasehosting.googleapis.com

# Create service account for Terraform
echo "Creating Terraform service account..."
SA_NAME="terraform-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create "${SA_NAME}" \
    --description="Service account for Terraform deployments" \
    --display-name="Terraform Deployer"

# Grant necessary roles to the service account
echo "Granting necessary roles to the service account..."
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/owner"

# Create a key for the service account
echo "Creating a key for the service account..."
gcloud iam service-accounts keys create "credentials-${ENVIRONMENT}.json" \
    --iam-account="${SA_EMAIL}"

# Create a bucket for Terraform state
echo "Creating a bucket for Terraform state..."
gsutil mb -p "${PROJECT_ID}" -l "${REGION}" "gs://${PROJECT_ID}-terraform-state"
gsutil versioning set on "gs://${PROJECT_ID}-terraform-state"

echo "Project setup complete!"
echo "Service account credentials saved to credentials-${ENVIRONMENT}.json"
echo "Terraform state will be stored in gs://${PROJECT_ID}-terraform-state"
echo ""
echo "Next steps:"
echo "1. Configure your environment folder with necessary tfvars"
echo "2. Initialize Terraform with the created backend"
echo "3. Run Terraform plan and apply to deploy resources"