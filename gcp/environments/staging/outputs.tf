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

output "read_replica_names" {
  description = "Names of the read replica instances"
  value       = module.database.read_replica_instance_names
}

output "cloud_run_url" {
  description = "URL of the Cloud Run service"
  value       = module.compute.cloud_run_service_url
}

output "load_balancer_ip" {
  description = "IP address of the load balancer"
  value       = module.compute.load_balancer_ip
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

output "model_endpoint_name" {
  description = "Name of the Vertex AI model endpoint"
  value       = module.ai.model_endpoint_name
}