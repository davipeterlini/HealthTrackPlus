variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "project_prefix" {
  description = "Prefix used for resource naming"
  type        = string
  default     = "healthtrackplus"
}

variable "region" {
  description = "The primary GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

variable "secondary_region" {
  description = "The secondary GCP region for multi-region setup"
  type        = string
  default     = "us-east1"
}

variable "multi_region" {
  description = "Whether to deploy in multiple regions"
  type        = bool
  default     = false
}

# Network variables - Primary Region
variable "private_subnet_cidr" {
  description = "CIDR range for the private subnet in primary region"
  type        = string
  default     = "10.0.0.0/20"
}

variable "public_subnet_cidr" {
  description = "CIDR range for the public subnet in primary region"
  type        = string
  default     = "10.0.16.0/24"
}

variable "connector_cidr" {
  description = "CIDR range for the VPC connector in primary region"
  type        = string
  default     = "10.8.0.0/28"
}

# Network variables - Secondary Region
variable "secondary_private_subnet_cidr" {
  description = "CIDR range for the private subnet in secondary region"
  type        = string
  default     = "10.1.0.0/20"
}

variable "secondary_public_subnet_cidr" {
  description = "CIDR range for the public subnet in secondary region"
  type        = string
  default     = "10.1.16.0/24"
}

variable "secondary_connector_cidr" {
  description = "CIDR range for the VPC connector in secondary region"
  type        = string
  default     = "10.9.0.0/28"
}

# Database variables
variable "db_name" {
  description = "The name of the default database to create"
  type        = string
  default     = "healthtrackplus"
}

variable "db_user" {
  description = "The name of the application database user"
  type        = string
  default     = "app"
}

variable "db_password" {
  description = "The password for the database user"
  type        = string
  sensitive   = true
}

variable "db_admin_user" {
  description = "The name of the admin database user"
  type        = string
  default     = "admin"
}

variable "db_admin_password" {
  description = "The password for the admin database user"
  type        = string
  sensitive   = true
}

variable "db_read_replicas_count" {
  description = "Number of database read replicas to create"
  type        = number
  default     = 2
}

# API variables
variable "api_image_tag" {
  description = "The tag of the API image to deploy"
  type        = string
  default     = "production"
}

variable "api_min_instances" {
  description = "Minimum number of instances for Cloud Run"
  type        = string
  default     = "2"
}

variable "api_max_instances" {
  description = "Maximum number of instances for Cloud Run"
  type        = string
  default     = "100"
}

# Payment variables
variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook secret"
  type        = string
  sensitive   = true
  default     = ""
}

# Authentication variables
variable "firebase_server_key" {
  description = "Firebase server key for push notifications"
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "apple_client_id" {
  description = "Apple Sign-In client ID"
  type        = string
  default     = ""
}

variable "apple_client_secret" {
  description = "Apple Sign-In client secret"
  type        = string
  sensitive   = true
  default     = ""
}

# Domain name
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "app.healthtrackplus.com"
}

# Alerting variables
variable "alert_email" {
  description = "Email address to send alerts to"
  type        = string
  default     = "alerts@healthtrackplus.com"
}

variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  sensitive   = true
  default     = ""
}

variable "slack_channel" {
  description = "Slack channel for alerts"
  type        = string
  default     = "#alerts"
}

# Functions version
variable "functions_version" {
  description = "Version of the Cloud Functions source code"
  type        = string
  default     = "1.0"
}

# AI model variables
variable "model_artifact_uri" {
  description = "GCS URI for the model artifacts"
  type        = string
  default     = ""
}

variable "model_container_image" {
  description = "Container image for serving the model"
  type        = string
  default     = "us-docker.pkg.dev/vertex-ai/prediction/tf2-gpu.2-8:latest"
}

variable "model_accelerator_type" {
  description = "Accelerator type for the model endpoint"
  type        = string
  default     = "NVIDIA_TESLA_T4"
}

variable "model_accelerator_count" {
  description = "Number of accelerators for the model endpoint"
  type        = number
  default     = 1
}

variable "gemini_base_model" {
  description = "Base model for Gemini tuning"
  type        = string
  default     = "gemini-1.5-pro-001"
}

variable "gemini_training_data_uri" {
  description = "GCS URI for Gemini training data"
  type        = string
  default     = ""
}

variable "gemini_eval_data_uri" {
  description = "GCS URI for Gemini evaluation data"
  type        = string
  default     = ""
}

variable "gemini_validation_data_uri" {
  description = "GCS URI for Gemini validation data"
  type        = string
  default     = ""
}