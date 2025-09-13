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

variable "vpc_network_id" {
  description = "The ID of the VPC network"
  type        = string
}

variable "db_instance_tier" {
  description = "The machine type for the Cloud SQL instance"
  type        = string
  default     = "db-custom-4-8192" # 4 vCPUs, 8GB RAM
}

variable "replica_instance_tier" {
  description = "The machine type for read replicas"
  type        = string
  default     = "db-custom-4-8192" # Same as main by default
}

variable "db_disk_size_gb" {
  description = "The disk size for the Cloud SQL instance in GB"
  type        = number
  default     = 100
}

variable "high_availability" {
  description = "Whether to enable high availability for the database instance"
  type        = bool
  default     = false
}

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

variable "read_replicas_count" {
  description = "Number of read replicas to create (0 for none)"
  type        = number
  default     = 0
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "db_max_connections" {
  description = "Maximum number of database connections"
  type        = number
  default     = 100
}

variable "maintenance_window_day" {
  description = "Day of week for maintenance window (1-7 for Monday-Sunday)"
  type        = number
  default     = 7 # Sunday
}

variable "maintenance_window_hour" {
  description = "Hour of day for maintenance window (0-23)"
  type        = number
  default     = 2 # 2 AM
}

variable "network_dependency" {
  description = "Dependency resource to ensure networking is set up first"
  type        = any
  default     = null
}