/**
 * Storage Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Cloud Storage buckets for various data types
 * - Lifecycle policies for cost optimization
 * - IAM permissions
 * - Firebase Hosting configuration
 */

# Create buckets with appropriate storage classes and lifecycle policies

# Medical Exams Bucket
resource "google_storage_bucket" "medical_exams" {
  name          = "${var.project_prefix}-medical-exams-${var.environment}-${var.project_id}"
  location      = var.bucket_location
  project       = var.project_id
  storage_class = var.medical_exams_storage_class
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = var.enable_versioning
  }
  
  lifecycle_rule {
    condition {
      age = var.medical_exams_nearline_age
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
  
  lifecycle_rule {
    condition {
      age = var.medical_exams_coldline_age
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
  
  # Compliance and retention policy for medical records
  retention_policy {
    is_locked        = var.environment == "prod" ? true : false
    retention_period = var.medical_exams_retention_period
  }
}

# Media Bucket (user-uploaded photos, etc.)
resource "google_storage_bucket" "media" {
  name          = "${var.project_prefix}-media-${var.environment}-${var.project_id}"
  location      = var.bucket_location
  project       = var.project_id
  storage_class = var.media_storage_class
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = var.enable_versioning
  }
  
  lifecycle_rule {
    condition {
      age = var.media_nearline_age
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

# Educational Content Bucket (videos, PDFs)
resource "google_storage_bucket" "educational_content" {
  name          = "${var.project_prefix}-educational-content-${var.environment}-${var.project_id}"
  location      = var.bucket_location
  project       = var.project_id
  storage_class = "STANDARD"
  
  uniform_bucket_level_access = true
  
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["Content-Type", "Access-Control-Allow-Origin"]
    max_age_seconds = 3600
  }
}

# Backups Bucket
resource "google_storage_bucket" "backups" {
  name          = "${var.project_prefix}-backups-${var.environment}-${var.project_id}"
  location      = var.bucket_location
  project       = var.project_id
  storage_class = "NEARLINE"
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
  
  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "ARCHIVE"
    }
  }
}

# Functions Source Bucket
resource "google_storage_bucket" "functions" {
  name          = "${var.project_prefix}-functions-${var.environment}-${var.project_id}"
  location      = var.bucket_location
  project       = var.project_id
  storage_class = "STANDARD"
  
  uniform_bucket_level_access = true
}

# Firebase Hosting Configuration
resource "google_storage_bucket" "firebase_hosting" {
  name          = "${var.project_prefix}-hosting-${var.environment}-${var.project_id}"
  location      = "US"  # Firebase Hosting requires US location
  project       = var.project_id
  storage_class = "STANDARD"
  
  uniform_bucket_level_access = true
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"  # For SPA routing
  }
  
  cors {
    origin          = var.cors_origins
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["Content-Type", "Access-Control-Allow-Origin"]
    max_age_seconds = 3600
  }
}

# IAM Permissions for Service Account
resource "google_storage_bucket_iam_member" "medical_exams_admin" {
  bucket = google_storage_bucket.medical_exams.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.service_account_email}"
}

resource "google_storage_bucket_iam_member" "media_admin" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.service_account_email}"
}

resource "google_storage_bucket_iam_member" "educational_content_viewer" {
  bucket = google_storage_bucket.educational_content.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${var.service_account_email}"
}

resource "google_storage_bucket_iam_member" "functions_admin" {
  bucket = google_storage_bucket.functions.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${var.service_account_email}"
}

# Public access to educational content (for authenticated users)
resource "google_storage_bucket_iam_member" "educational_content_public" {
  count  = var.enable_public_educational_content ? 1 : 0
  bucket = google_storage_bucket.educational_content.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}