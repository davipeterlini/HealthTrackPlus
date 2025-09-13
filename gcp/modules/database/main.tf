/**
 * Database Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Cloud SQL PostgreSQL instance
 * - Database user
 * - Database
 * - Optional read replicas
 * - Backup configuration
 */

# Random suffix to ensure unique instance names
resource "random_id" "db_name_suffix" {
  byte_length = 4
}

# Cloud SQL PostgreSQL Instance
resource "google_sql_database_instance" "main" {
  name             = "${var.project_prefix}-db-${var.environment}-${random_id.db_name_suffix.hex}"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id

  settings {
    tier              = var.db_instance_tier
    availability_type = var.high_availability ? "REGIONAL" : "ZONAL"
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_network_id
      
      authorized_networks {
        name  = "CloudRunServices"
        value = "35.235.240.0/20" # Cloud Run services range
      }
    }
    
    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = var.backup_retention_days
        retention_unit   = "COUNT"
      }
    }
    
    database_flags {
      name  = "max_connections"
      value = var.db_max_connections
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }
    
    database_flags {
      name  = "log_connections"
      value = "on"
    }
    
    database_flags {
      name  = "log_disconnections"
      value = "on"
    }

    database_flags {
      name  = "log_min_duration_statement"
      value = "1000" # Log queries taking more than 1 second
    }
    
    disk_size         = var.db_disk_size_gb
    disk_type         = "PD_SSD"
    disk_autoresize   = true
    
    maintenance_window {
      day          = var.maintenance_window_day
      hour         = var.maintenance_window_hour
      update_track = "stable"
    }
    
    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }
  }

  deletion_protection = var.environment == "prod" ? true : false
  
  depends_on = [var.network_dependency]
}

# Read replica for scaling reads (only for staging and prod)
resource "google_sql_database_instance" "read_replica" {
  count                = var.environment != "dev" && var.read_replicas_count > 0 ? var.read_replicas_count : 0
  name                 = "${var.project_prefix}-db-${var.environment}-replica-${count.index}-${random_id.db_name_suffix.hex}"
  master_instance_name = google_sql_database_instance.main.name
  region               = var.region
  database_version     = "POSTGRES_15"
  project              = var.project_id

  replica_configuration {
    failover_target = false
  }

  settings {
    tier              = var.replica_instance_tier
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_network_id
    }
    
    disk_size       = var.db_disk_size_gb
    disk_type       = "PD_SSD"
    disk_autoresize = true
    
    database_flags {
      name  = "max_connections"
      value = var.db_max_connections
    }
  }
}

# Create database
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

# Create users
resource "google_sql_user" "app_user" {
  name     = var.db_user
  instance = google_sql_database_instance.main.name
  password = var.db_password
  project  = var.project_id
}

# Additional admin user for management
resource "google_sql_user" "admin_user" {
  name     = var.db_admin_user
  instance = google_sql_database_instance.main.name
  password = var.db_admin_password
  project  = var.project_id
}