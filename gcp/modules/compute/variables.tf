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

variable "container_registry" {
  description = "Container registry URL"
  type        = string
  default     = "gcr.io"
}

variable "api_image_name" {
  description = "Name of the API container image"
  type        = string
  default     = "api"
}

variable "image_tag" {
  description = "Tag of the container image to deploy (defaults to latest)"
  type        = string
  default     = ""
}

variable "api_cpu" {
  description = "CPU allocation for Cloud Run service"
  type        = string
  default     = "2"
}

variable "api_memory" {
  description = "Memory allocation for Cloud Run service"
  type        = string
  default     = "2Gi"
}

variable "api_min_instances" {
  description = "Minimum number of instances for Cloud Run service"
  type        = string
  default     = "0"
}

variable "api_max_instances" {
  description = "Maximum number of instances for Cloud Run service"
  type        = string
  default     = "10"
}

variable "api_container_concurrency" {
  description = "Maximum number of concurrent requests per container"
  type        = number
  default     = 80
}

variable "api_timeout_seconds" {
  description = "Maximum request timeout in seconds"
  type        = number
  default     = 60
}

variable "api_env_vars" {
  description = "Environment variables for the API"
  type        = map(string)
  default     = {}
}

variable "api_allow_unauthenticated" {
  description = "Allow unauthenticated access to the API"
  type        = bool
  default     = false
}

variable "vpc_connector" {
  description = "Name of the VPC connector for Cloud Run"
  type        = string
  default     = ""
}

variable "db_instance_connection_name" {
  description = "Cloud SQL instance connection name"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_user" {
  description = "Database user"
  type        = string
}

variable "functions_bucket" {
  description = "Storage bucket containing Cloud Functions source code"
  type        = string
}

variable "ai_processor_source_zip" {
  description = "Path to the AI processor function source zip"
  type        = string
}

variable "payment_webhook_source_zip" {
  description = "Path to the payment webhook function source zip"
  type        = string
}

variable "notifications_source_zip" {
  description = "Path to the notifications function source zip"
  type        = string
}

variable "medical_exams_bucket" {
  description = "Storage bucket for medical exams"
  type        = string
}

variable "enable_load_balancer" {
  description = "Whether to create a load balancer"
  type        = bool
  default     = false
}

variable "enable_https" {
  description = "Whether to enable HTTPS with managed certificate"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Domain name for the HTTPS certificate"
  type        = string
  default     = ""
}