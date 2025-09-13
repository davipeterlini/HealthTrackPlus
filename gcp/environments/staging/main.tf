/**
 * Staging Environment Configuration for HealthTrackPlus
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
  #   bucket = "healthtrackplus-terraform-state-staging"
  #   prefix = "terraform/state"
  # }
}

locals {
  environment = "staging"
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
  
  # Staging-specific settings
  enable_versioning                = true
  medical_exams_retention_period   = 63072000  # 2 years in seconds for staging
  medical_exams_nearline_age       = 60        # Move to Nearline after 60 days
  medical_exams_coldline_age       = 180       # Move to Coldline after 180 days
  
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
  
  # Staging-specific settings
  db_instance_tier   = "db-custom-2-7680"  # 2 vCPU, 7.5GB RAM for staging
  db_disk_size_gb    = 50
  high_availability  = true               # HA for staging
  read_replicas_count = 1                 # One read replica for staging
  
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
  
  # Staging-specific settings
  enable_cloud_armor   = true
  enable_cmek          = true
  
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
  api_cpu           = "2"
  api_memory        = "2Gi"
  api_min_instances = "1"  # Keep at least 1 instance warm
  api_max_instances = "10"
  api_allow_unauthenticated = false
  
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
  enable_load_balancer = true
  enable_https         = true
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
  
  # Staging-specific settings
  deploy_custom_model = true
  model_artifact_uri  = var.model_artifact_uri
  model_container_image = var.model_container_image
  
  machine_type     = "n1-standard-4"
  min_replica_count = 1
  max_replica_count = 3
  
  enable_gemini_tuning = true
  gemini_base_model    = "gemini-1.0-pro-002"
  gemini_training_data_uri = var.gemini_training_data_uri
  gemini_eval_data_uri = var.gemini_eval_data_uri
  gemini_validation_data_uri = var.gemini_validation_data_uri
  
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
  
  # Threshold settings
  latency_threshold_ms = 1500  # 1.5 seconds
  error_rate_threshold = 0.05  # 5%
  db_cpu_threshold     = 0.85  # 85%
  
  depends_on = [
    google_project_service.required_apis,
    module.compute,
    module.database
  ]
}