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
  description = "The GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

# Network variables
variable "private_subnet_cidr" {
  description = "CIDR range for the private subnet"
  type        = string
  default     = "10.0.0.0/20"
}

variable "public_subnet_cidr" {
  description = "CIDR range for the public subnet"
  type        = string
  default     = "10.0.16.0/24"
}

variable "connector_cidr" {
  description = "CIDR range for the VPC connector"
  type        = string
  default     = "10.8.0.0/28"
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

# API variables
variable "api_image_tag" {
  description = "The tag of the API image to deploy"
  type        = string
  default     = "latest"
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
  default     = "dev.healthtrackplus.com"
}

# Alerting variables
variable "alert_email" {
  description = "Email address to send alerts to"
  type        = string
  default     = "dev-alerts@healthtrackplus.com"
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
  default     = "#dev-alerts"
}

# Functions version
variable "functions_version" {
  description = "Version of the Cloud Functions source code"
  type        = string
  default     = "0.1"
}