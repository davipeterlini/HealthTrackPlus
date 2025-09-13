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

output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = module.compute.cloud_run_service_url
}

output "medical_exams_bucket" {
  description = "Name of the medical exams bucket"
  value       = module.storage.medical_exams_bucket_name
}

output "media_bucket" {
  description = "Name of the media bucket"
  value       = module.storage.media_bucket_name
}

output "payment_webhook_url" {
  description = "URL of the payment webhook function"
  value       = module.compute.payment_webhook_url
}