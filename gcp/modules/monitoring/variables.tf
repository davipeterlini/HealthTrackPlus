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

variable "alert_email" {
  description = "Email address to send alerts to"
  type        = string
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

variable "api_service_name" {
  description = "Name of the API service to monitor"
  type        = string
}

variable "db_instance_name" {
  description = "Name of the database instance to monitor"
  type        = string
}

variable "api_domain" {
  description = "Domain name for the API endpoint"
  type        = string
}

variable "latency_threshold_ms" {
  description = "Threshold in milliseconds for latency alerts"
  type        = number
  default     = 1000 # 1 second
}

variable "error_rate_threshold" {
  description = "Threshold for error rate alerts"
  type        = number
  default     = 0.05 # 5%
}

variable "db_cpu_threshold" {
  description = "Threshold for database CPU utilization alerts"
  type        = number
  default     = 0.8 # 80%
}

variable "auth_failure_threshold" {
  description = "Threshold for authentication failure alerts"
  type        = number
  default     = 5 # 5 failures per minute
}