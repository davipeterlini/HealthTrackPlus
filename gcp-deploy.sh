#!/bin/bash

# GCP Deployment Script for HealthTrack Plus
set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
REGION="us-central1"
SERVICE_NAME="healthtrack-app"
DATABASE_INSTANCE="healthtrack-db"

echo "🚀 Starting GCP deployment for HealthTrack Plus..."

# 1. Set up GCP project
echo "📋 Setting up GCP project..."
gcloud config set project $PROJECT_ID

# 2. Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  storage-component.googleapis.com

# 3. Create Cloud SQL instance (PostgreSQL)
echo "🗄️ Creating Cloud SQL PostgreSQL instance..."
gcloud sql instances create $DATABASE_INSTANCE \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04 \
  --maintenance-release-channel=production

# 4. Create database
echo "📊 Creating database..."
gcloud sql databases create healthtrackplus --instance=$DATABASE_INSTANCE

# 5. Create database user
echo "👤 Creating database user..."
gcloud sql users create healthtrack \
  --instance=$DATABASE_INSTANCE \
  --password=$(openssl rand -base64 32)

# 6. Create Cloud Storage bucket for file uploads
echo "🪣 Creating Cloud Storage bucket..."
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$PROJECT_ID-healthtrack-uploads

# 7. Build and deploy to Cloud Run
echo "🏗️ Building and deploying to Cloud Run..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 8. Deploy to Cloud Run with environment variables
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="DATABASE_URL=postgresql://healthtrack:PASSWORD@/healthtrackplus?host=/cloudsql/$PROJECT_ID:$REGION:$DATABASE_INSTANCE" \
  --add-cloudsql-instances=$PROJECT_ID:$REGION:$DATABASE_INSTANCE \
  --memory=1Gi \
  --cpu=1 \
  --concurrency=100 \
  --timeout=300 \
  --max-instances=10

# 9. Set up custom domain (optional)
echo "🌐 Setting up custom domain mapping..."
# gcloud run domain-mappings create --service=$SERVICE_NAME --domain=your-domain.com --region=$REGION

# 10. Configure Cloud CDN for static assets
echo "⚡ Setting up Cloud CDN..."
gcloud compute backend-buckets create healthtrack-static-backend \
  --gcs-bucket-name=$PROJECT_ID-healthtrack-uploads

echo "✅ Deployment completed successfully!"
echo "🔗 Your app is available at: $(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')"

# Display important information
echo ""
echo "📋 Important Information:"
echo "- Database Instance: $DATABASE_INSTANCE"
echo "- Storage Bucket: gs://$PROJECT_ID-healthtrack-uploads"
echo "- Region: $REGION"
echo ""
echo "🔧 Next steps:"
echo "1. Update your environment variables with the actual database password"
echo "2. Run database migrations: npm run db:push"
echo "3. Configure your custom domain if needed"
echo "4. Set up monitoring and alerting"