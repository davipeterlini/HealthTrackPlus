/**
 * Development Environment Configuration for HealthTrackPlus
 */

# Configure the Google provider
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Optional: Configure a backend for state storage
  # backend "gcs" {
  #   bucket = "healthtrackplus-terraform-state-dev"
  #   prefix = "terraform/state"
  # }
}

locals {
  environment = "dev"
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "iam.googleapis.com",
    "container.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudfunctions.googleapis.com",
    "storage.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com",
    "sql-component.googleapis.com",
    "sqladmin.googleapis.com",
    "aiplatform.googleapis.com",
    "identitytoolkit.googleapis.com",
    "cloudscheduler.googleapis.com",
    "cloudkms.googleapis.com",
    "firestore.googleapis.com",
    "firebasehosting.googleapis.com"
  ])

  service                    = each.value
  project                    = var.project_id
  disable_dependent_services = false
  disable_on_destroy         = false
}

# Set up service account for the application
resource "google_service_account" "app_service_account" {
  account_id   = "${var.project_prefix}-sa-${local.environment}"
  display_name = "Service Account for ${var.project_prefix} ${local.environment}"
  project      = var.project_id
  
  depends_on = [google_project_service.required_apis]
}

# Network module
module "network" {
  source = "../../modules/network"

  project_id         = var.project_id
  project_prefix     = var.project_prefix
  environment        = local.environment
  region             = var.region
  private_subnet_cidr = var.private_subnet_cidr
  public_subnet_cidr = var.public_subnet_cidr
  
  depends_on = [google_project_service.required_apis]
}

# Storage module
module "storage" {
  source = "../../modules/storage"

  project_id      = var.project_id
  project_prefix  = var.project_prefix
  environment     = local.environment
  bucket_location = var.region
  
  service_account_email = google_service_account.app_service_account.email
  
  # Development-specific settings
  enable_versioning                = false
  medical_exams_retention_period   = 30758400  # 1 year in seconds for dev
  medical_exams_nearline_age       = 30        # Move to Nearline after 30 days
  medical_exams_coldline_age       = 90        # Move to Coldline after 90 days
  
  depends_on = [google_project_service.required_apis]
}

# Database module
module "database" {
  source = "../../modules/database"

  project_id         = var.project_id
  project_prefix     = var.project_prefix
  environment        = local.environment
  region             = var.region
  vpc_network_id     = module.network.vpc_network_id
  
  # Development-specific settings
  db_instance_tier   = "db-custom-1-3840"  # 1 vCPU, 3.75GB RAM for dev
  db_disk_size_gb    = 10
  high_availability  = false
  read_replicas_count = 0
  
  db_name           = var.db_name
  db_user           = var.db_user
  db_password       = var.db_password
  db_admin_user     = var.db_admin_user
  db_admin_password = var.db_admin_password
  
  network_dependency = module.network.vpc_network_id
  
  depends_on = [
    google_project_service.required_apis,
    module.network
  ]
}

# Create VPC connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "${var.project_prefix}-vpc-connector-${local.environment}"
  region        = var.region
  network       = module.network.vpc_network_name
  ip_cidr_range = var.connector_cidr
  
  depends_on = [google_project_service.required_apis]
}

# Security module
module "security" {
  source = "../../modules/security"

  project_id      = var.project_id
  project_prefix  = var.project_prefix
  environment     = local.environment
  region          = var.region
  
  # Secrets
  db_password          = var.db_password
  stripe_secret_key    = var.stripe_secret_key
  stripe_webhook_secret = var.stripe_webhook_secret
  firebase_server_key  = var.firebase_server_key
  
  # OAuth configs
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
  apple_client_id      = var.apple_client_id
  apple_client_secret  = var.apple_client_secret
  
  # Domain
  domain_name          = var.domain_name
  
  # Development-specific settings
  enable_cloud_armor   = false
  enable_cmek          = false
  
  service_account_email = google_service_account.app_service_account.email
  
  depends_on = [google_project_service.required_apis]
}

# Functions source code
resource "google_storage_bucket_object" "ai_processor_source" {
  name   = "functions/ai-processor-${var.functions_version}.zip"
  bucket = module.storage.functions_bucket_name
  source = "../../functions/ai-processor.zip"
}

resource "google_storage_bucket_object" "payment_webhook_source" {
  name   = "functions/payment-webhook-${var.functions_version}.zip"
  bucket = module.storage.functions_bucket_name
  source = "../../functions/payment-webhook.zip"
}

resource "google_storage_bucket_object" "notifications_source" {
  name   = "functions/notifications-${var.functions_version}.zip"
  bucket = module.storage.functions_bucket_name
  source = "../../functions/notifications.zip"
}

# Compute module
module "compute" {
  source = "../../modules/compute"

  project_id        = var.project_id
  project_prefix    = var.project_prefix
  environment       = local.environment
  region            = var.region
  
  # Container details
  image_tag         = var.api_image_tag
  
  # Cloud Run configuration
  api_cpu           = "1"
  api_memory        = "512Mi"
  api_min_instances = "0"
  api_max_instances = "2"
  api_allow_unauthenticated = true
  
  vpc_connector     = google_vpc_access_connector.connector.id
  
  # Database connection
  db_instance_connection_name = module.database.db_instance_connection_name
  db_name           = module.database.db_name
  db_user           = var.db_user
  
  # Cloud Functions
  functions_bucket  = module.storage.functions_bucket_name
  medical_exams_bucket = module.storage.medical_exams_bucket_name
  ai_processor_source_zip = google_storage_bucket_object.ai_processor_source.name
  payment_webhook_source_zip = google_storage_bucket_object.payment_webhook_source.name
  notifications_source_zip = google_storage_bucket_object.notifications_source.name
  
  # Additional environment variables
  api_env_vars     = {
    NODE_ENV       = local.environment
    STRIPE_PUBLISHABLE_KEY = var.stripe_publishable_key
    STORAGE_BUCKET = module.storage.media_bucket_name
  }
  
  # Load Balancer settings
  enable_load_balancer = false
  enable_https         = false
  domain_name          = var.domain_name
  
  depends_on = [
    google_project_service.required_apis,
    module.database,
    module.storage,
    module.security
  ]
}

# AI module
module "ai" {
  source = "../../modules/ai"

  project_id       = var.project_id
  project_prefix   = var.project_prefix
  environment      = local.environment
  region           = var.region
  
  # Development-specific settings
  deploy_custom_model = false
  enable_gemini_tuning = false
  
  service_account_email = google_service_account.app_service_account.email
  network               = module.network.vpc_network_id
  
  depends_on = [google_project_service.required_apis]
}

# Monitoring module
module "monitoring" {
  source = "../../modules/monitoring"

  project_id       = var.project_id
  project_prefix   = var.project_prefix
  environment      = local.environment
  
  # Alerting
  alert_email      = var.alert_email
  slack_webhook_url = var.slack_webhook_url
  slack_channel    = var.slack_channel
  
  # Resources to monitor
  api_service_name = module.compute.cloud_run_service_name
  db_instance_name = module.database.db_instance_name
  api_domain       = var.domain_name
  
  # Threshold settings (more relaxed for development)
  latency_threshold_ms = 2000  # 2 seconds
  error_rate_threshold = 0.1   # 10%
  db_cpu_threshold     = 0.9   # 90%
  
  depends_on = [
    google_project_service.required_apis,
    module.compute,
    module.database
  ]
}