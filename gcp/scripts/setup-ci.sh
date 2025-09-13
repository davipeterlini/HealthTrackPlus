#!/bin/bash
# Script to setup Cloud Build CI/CD pipeline for HealthTrackPlus
# Usage: ./setup-ci.sh -e [dev|staging|prod] -r [repo-name]

set -e

# Default values
PROJECT_PREFIX="healthtrackplus"
ENVIRONMENT=""
REPO_NAME="healthtrackplus"
BRANCH_PATTERN=""
REGION="us-central1"

# Parse command line arguments
while getopts ":e:r:b:g:" opt; do
  case ${opt} in
    e)
      ENVIRONMENT=$OPTARG
      ;;
    r)
      REPO_NAME=$OPTARG
      ;;
    b)
      BRANCH_PATTERN=$OPTARG
      ;;
    g)
      REGION=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: ./setup-ci.sh -e [dev|staging|prod] -r [repo-name] -b [branch-pattern] -g [region]" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      echo "Usage: ./setup-ci.sh -e [dev|staging|prod] -r [repo-name] -b [branch-pattern] -g [region]" >&2
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

# Set branch pattern based on environment if not provided
if [[ -z "$BRANCH_PATTERN" ]]; then
  case ${ENVIRONMENT} in
    dev)
      BRANCH_PATTERN="^develop$"
      ;;
    staging)
      BRANCH_PATTERN="^staging$"
      ;;
    prod)
      BRANCH_PATTERN="^main$"
      ;;
  esac
fi

# Set project as current
gcloud config set project "${PROJECT_ID}"

# Create Artifact Registry repository for Docker images
echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create "${REPO_NAME}-${ENVIRONMENT}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="${PROJECT_PREFIX} ${ENVIRONMENT} container repository"

# Set up Cloud Build trigger for API
echo "Setting up Cloud Build trigger for API..."
gcloud builds triggers create github \
    --name="api-${ENVIRONMENT}-trigger" \
    --repo="${REPO_NAME}" \
    --branch-pattern="${BRANCH_PATTERN}" \
    --build-config="cloudbuild-api.yaml" \
    --included-files="backend/**" \
    --require-approval

# Set up Cloud Build trigger for Frontend
echo "Setting up Cloud Build trigger for Frontend..."
gcloud builds triggers create github \
    --name="frontend-${ENVIRONMENT}-trigger" \
    --repo="${REPO_NAME}" \
    --branch-pattern="${BRANCH_PATTERN}" \
    --build-config="cloudbuild-frontend.yaml" \
    --included-files="frontend/**" \
    --require-approval

# Set up Cloud Build trigger for Infrastructure
echo "Setting up Cloud Build trigger for Infrastructure..."
gcloud builds triggers create github \
    --name="infra-${ENVIRONMENT}-trigger" \
    --repo="${REPO_NAME}" \
    --branch-pattern="${BRANCH_PATTERN}" \
    --build-config="cloudbuild-infra.yaml" \
    --included-files="gcp/environments/${ENVIRONMENT}/**" \
    --require-approval

# Grant Cloud Build service account required permissions
echo "Granting Cloud Build service account required permissions..."
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Allow Cloud Build to deploy to Cloud Run
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/run.admin"

# Allow Cloud Build to act as service account
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/iam.serviceAccountUser"

# Allow Cloud Build to manage Cloud Storage
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/storage.admin"

# Allow Cloud Build to deploy infrastructure with Terraform
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${CLOUD_BUILD_SA}" \
    --role="roles/owner"

echo "CI/CD setup complete!"
echo ""
echo "Next steps:"
echo "1. Connect your GitHub repository to Cloud Build"
echo "2. Create cloudbuild-api.yaml, cloudbuild-frontend.yaml and cloudbuild-infra.yaml files"
echo "3. Push to the configured branch to trigger builds"