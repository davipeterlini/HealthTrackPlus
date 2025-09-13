output "vpc_network_name" {
  description = "Name of the VPC network"
  value       = module.network.vpc_network_name
}

output "db_instance_name" {
  description = "Name of the database instance"
  value       = module.database.db_instance_name
}

output "db_instance_connection_name" {
  description = "Connection name of the database instance"
  value       = module.database.db_instance_connection_name
}

output "db_instance_ip" {
  description = "Private IP address of the database instance"
  value       = module.database.db_instance_ip_address
}

output "read_replica_instance_names" {
  description = "Names of the read replica instances"
  value       = module.database.read_replica_instance_names
}

output "primary_cloud_run_url" {
  description = "URL of the primary region Cloud Run service"
  value       = module.compute.cloud_run_service_url
}

output "secondary_cloud_run_url" {
  description = "URL of the secondary region Cloud Run service (if multi-region enabled)"
  value       = var.multi_region ? module.compute_secondary[0].cloud_run_service_url : null
}

output "primary_load_balancer_ip" {
  description = "IP address of the primary region load balancer"
  value       = module.compute.load_balancer_ip
}

output "global_load_balancer_ip" {
  description = "IP address of the global load balancer (if multi-region enabled)"
  value       = var.multi_region ? google_compute_global_address.global_lb_ip[0].address : null
}

output "medical_exams_bucket" {
  description = "Name of the medical exams bucket"
  value       = module.storage.medical_exams_bucket_name
}

output "media_bucket" {
  description = "Name of the media bucket"
  value       = module.storage.media_bucket_name
}

output "educational_content_bucket" {
  description = "Name of the educational content bucket"
  value       = module.storage.educational_content_bucket_name
}

output "backups_bucket" {
  description = "Name of the backups bucket"
  value       = module.storage.backups_bucket_name
}

output "payment_webhook_url" {
  description = "URL of the payment webhook function"
  value       = module.compute.payment_webhook_url
}

output "ai_model_endpoint" {
  description = "Name of the AI model endpoint"
  value       = module.ai.model_endpoint_name
}