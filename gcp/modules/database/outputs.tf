output "db_instance_name" {
  description = "The name of the Cloud SQL instance"
  value       = google_sql_database_instance.main.name
}

output "db_instance_connection_name" {
  description = "The connection name of the Cloud SQL instance"
  value       = google_sql_database_instance.main.connection_name
}

output "db_instance_ip_address" {
  description = "The private IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.main.private_ip_address
}

output "db_instance_self_link" {
  description = "The self link of the Cloud SQL instance"
  value       = google_sql_database_instance.main.self_link
}

output "db_name" {
  description = "The name of the database"
  value       = google_sql_database.database.name
}

output "db_user" {
  description = "The name of the database user"
  value       = google_sql_user.app_user.name
}

output "read_replica_instance_names" {
  description = "The names of the read replica instances"
  value       = var.read_replicas_count > 0 ? google_sql_database_instance.read_replica[*].name : []
}

output "read_replica_connection_names" {
  description = "The connection names of the read replica instances"
  value       = var.read_replicas_count > 0 ? google_sql_database_instance.read_replica[*].connection_name : []
}