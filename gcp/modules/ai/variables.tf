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

variable "deploy_custom_model" {
  description = "Whether to deploy a custom ML model"
  type        = bool
  default     = false
}

variable "model_artifact_uri" {
  description = "GCS URI for the model artifacts"
  type        = string
  default     = ""
}

variable "model_container_image" {
  description = "Container image for serving the model"
  type        = string
  default     = "us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-8:latest"
}

variable "machine_type" {
  description = "Machine type for the model endpoint"
  type        = string
  default     = "n1-standard-4"
}

variable "accelerator_type" {
  description = "Accelerator type for the model endpoint"
  type        = string
  default     = "ACCELERATOR_TYPE_UNSPECIFIED"
}

variable "accelerator_count" {
  description = "Number of accelerators for the model endpoint"
  type        = number
  default     = 0
}

variable "min_replica_count" {
  description = "Minimum number of replicas for the model endpoint"
  type        = number
  default     = 1
}

variable "max_replica_count" {
  description = "Maximum number of replicas for the model endpoint"
  type        = number
  default     = 2
}

variable "service_account_email" {
  description = "Email of the service account to use for the model endpoint"
  type        = string
}

variable "network" {
  description = "Network to deploy the model endpoint to"
  type        = string
  default     = ""
}

variable "enable_gemini_tuning" {
  description = "Whether to enable Gemini model tuning"
  type        = bool
  default     = false
}

variable "gemini_base_model" {
  description = "Base model for Gemini tuning"
  type        = string
  default     = "gemini-1.0-pro-002"
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