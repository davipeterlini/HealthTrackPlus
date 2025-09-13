variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "project_prefix" {
  description = "Prefix used for resource naming"
  type        = string
  default     = "healthtrackplus"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "region" {
  description = "The GCP region to deploy resources"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe API secret key"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook secret"
  type        = string
  sensitive   = true
}

variable "firebase_server_key" {
  description = "Firebase server key for push notifications"
  type        = string
  sensitive   = true
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

variable "reset_password_email_subject" {
  description = "Subject for reset password email"
  type        = string
  default     = "Reset your HealthTrackPlus password"
}

variable "reset_password_email_body" {
  description = "Body for reset password email"
  type        = string
  default     = "Hello {email},<br><br>Click <a href='{link}'>here</a> to reset your password.<br><br>If you didn't request this, you can ignore this email.<br><br>Thanks,<br>The HealthTrackPlus Team"
}

variable "verify_email_subject" {
  description = "Subject for email verification"
  type        = string
  default     = "Verify your HealthTrackPlus email"
}

variable "verify_email_body" {
  description = "Body for email verification"
  type        = string
  default     = "Hello {email},<br><br>Click <a href='{link}'>here</a> to verify your email address.<br><br>Thanks,<br>The HealthTrackPlus Team"
}

variable "domain_name" {
  description = "Domain name for application"
  type        = string
  default     = "app.healthtrackplus.com"
}

variable "enable_cloud_armor" {
  description = "Whether to enable Cloud Armor security policy"
  type        = bool
  default     = true
}

variable "enable_cmek" {
  description = "Whether to enable customer-managed encryption keys"
  type        = bool
  default     = false
}

variable "service_account_email" {
  description = "Email of the service account to grant permissions to"
  type        = string
}