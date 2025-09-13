/**
 * Production Environment Configuration for HealthTrackPlus
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

  # Configure a GCS backend for state storage
  backend "gcs" {
    bucket = "healthtrackplus-terraform-state-prod"
    prefix = "terraform/state"
  }
}

locals {
  environment = "prod"
  regions     = [var.region, var.secondary_region]
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

# Create secondary region networking if using multi-region
module "network_secondary" {
  count = var.multi_region ? 1 : 0
  
  source = "../../modules/network"

  project_id         = var.project_id
  project_prefix     = var.project_prefix
  environment        = "${local.environment}-secondary"
  region             = var.secondary_region
  private_subnet_cidr = var.secondary_private_subnet_cidr
  public_subnet_cidr = var.secondary_public_subnet_cidr
  
  depends_on = [google_project_service.required_apis]
}

# Storage module
module "storage" {
  source = "../../modules/storage"

  project_id      = var.project_id
  project_prefix  = var.project_prefix
  environment     = local.environment
  bucket_location = "US" # Multi-region for production
  
  service_account_email = google_service_account.app_service_account.email
  
  # Production-specific settings
  enable_versioning                = true
  medical_exams_retention_period   = 220752000  # 7 years in seconds for production
  medical_exams_nearline_age       = 90         # Move to Nearline after 90 days
  medical_exams_coldline_age       = 365        # Move to Coldline after 365 days
  
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
  
  # Production-specific settings
  db_instance_tier   = "db-custom-8-16384"  # 8 vCPU, 16GB RAM for production
  db_disk_size_gb    = 500
  high_availability  = true                # HA for production
  read_replicas_count = var.db_read_replicas_count
  replica_instance_tier = "db-custom-8-16384"
  
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

# Create VPC connector for Cloud Run in primary region
resource "google_vpc_access_connector" "connector" {
  name          = "${var.project_prefix}-vpc-connector-${local.environment}"
  region        = var.region
  network       = module.network.vpc_network_name
  ip_cidr_range = var.connector_cidr
  
  depends_on = [google_project_service.required_apis]
}

# Create VPC connector in secondary region if using multi-region
resource "google_vpc_access_connector" "connector_secondary" {
  count         = var.multi_region ? 1 : 0
  name          = "${var.project_prefix}-vpc-connector-${local.environment}-secondary"
  region        = var.secondary_region
  network       = module.network.vpc_network_name
  ip_cidr_range = var.secondary_connector_cidr
  
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
  
  # Production-specific settings
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

# Primary region compute module
module "compute" {
  source = "../../modules/compute"

  project_id        = var.project_id
  project_prefix    = var.project_prefix
  environment       = local.environment
  region            = var.region
  
  # Container details
  image_tag         = var.api_image_tag
  
  # Cloud Run configuration
  api_cpu           = "4"
  api_memory        = "8Gi"
  api_min_instances = var.api_min_instances
  api_max_instances = var.api_max_instances
  api_container_concurrency = 80
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

# Secondary region compute module (if multi-region is enabled)
module "compute_secondary" {
  count = var.multi_region ? 1 : 0
  
  source = "../../modules/compute"

  project_id        = var.project_id
  project_prefix    = var.project_prefix
  environment       = "${local.environment}-secondary"
  region            = var.secondary_region
  
  # Container details
  image_tag         = var.api_image_tag
  
  # Cloud Run configuration
  api_cpu           = "4"
  api_memory        = "8Gi"
  api_min_instances = var.api_min_instances
  api_max_instances = var.api_max_instances
  api_container_concurrency = 80
  api_allow_unauthenticated = false
  
  vpc_connector     = google_vpc_access_connector.connector_secondary[0].id
  
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
    module.security,
    module.network_secondary[0]
  ]
}

# Global load balancer for multi-region setup
resource "google_compute_global_address" "global_lb_ip" {
  count   = var.multi_region ? 1 : 0
  name    = "${var.project_prefix}-global-lb-ip-${local.environment}"
  project = var.project_id
}

# Health check for backend services
resource "google_compute_health_check" "health_check" {
  count               = var.multi_region ? 1 : 0
  name                = "${var.project_prefix}-health-check-${local.environment}"
  project             = var.project_id
  timeout_sec         = 5
  check_interval_sec  = 10
  
  http_health_check {
    port               = 80
    port_specification = "USE_FIXED_PORT"
    request_path       = "/api/health"
  }
}

# AI module
module "ai" {
  source = "../../modules/ai"

  project_id       = var.project_id
  project_prefix   = var.project_prefix
  environment      = local.environment
  region           = var.region
  
  # Production-specific settings
  deploy_custom_model = true
  model_artifact_uri  = var.model_artifact_uri
  model_container_image = var.model_container_image
  
  machine_type     = "n1-standard-8"
  accelerator_type = var.model_accelerator_type
  accelerator_count = var.model_accelerator_count
  min_replica_count = 2
  max_replica_count = 10
  
  enable_gemini_tuning = true
  gemini_base_model    = var.gemini_base_model
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
  
  # Production threshold settings - stricter than other environments
  latency_threshold_ms = 1000  # 1 second
  error_rate_threshold = 0.01  # 1%
  db_cpu_threshold     = 0.8   # 80%
  
  depends_on = [
    google_project_service.required_apis,
    module.compute,
    module.database
  ]
}