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

variable "bucket_location" {
  description = "Location for storage buckets"
  type        = string
  default     = "US"
}

variable "enable_versioning" {
  description = "Whether to enable versioning on buckets"
  type        = bool
  default     = true
}

variable "medical_exams_storage_class" {
  description = "Default storage class for medical exams bucket"
  type        = string
  default     = "STANDARD"
}

variable "media_storage_class" {
  description = "Default storage class for media bucket"
  type        = string
  default     = "STANDARD"
}

variable "medical_exams_nearline_age" {
  description = "Age in days to transition medical exams to Nearline storage"
  type        = number
  default     = 90
}

variable "medical_exams_coldline_age" {
  description = "Age in days to transition medical exams to Coldline storage"
  type        = number
  default     = 365
}

variable "media_nearline_age" {
  description = "Age in days to transition media to Nearline storage"
  type        = number
  default     = 60
}

variable "medical_exams_retention_period" {
  description = "Retention period in seconds for medical exams (default 7 years)"
  type        = number
  default     = 220752000  # 7 years in seconds
}

variable "enable_public_educational_content" {
  description = "Whether to allow public access to educational content"
  type        = bool
  default     = false
}

variable "service_account_email" {
  description = "Email of the service account to grant access to buckets"
  type        = string
}

variable "cors_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["*"]
}