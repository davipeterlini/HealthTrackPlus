/**
 * Compute Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Cloud Run services for backend API
 * - Cloud Functions for specific microservices
 * - Load balancer configuration
 * - Cloud Scheduler for cron jobs
 */

locals {
  service_account_email = google_service_account.service_account.email
  image_tag             = var.image_tag != "" ? var.image_tag : "latest"
}

# Service account for Cloud Run
resource "google_service_account" "service_account" {
  account_id   = "${var.project_prefix}-sa-${var.environment}"
  display_name = "Service Account for ${var.project_prefix} ${var.environment}"
  project      = var.project_id
}

# Grant required roles to the service account
resource "google_project_iam_member" "cloud_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${local.service_account_email}"
}

resource "google_project_iam_member" "storage_object_user" {
  project = var.project_id
  role    = "roles/storage.objectUser"
  member  = "serviceAccount:${local.service_account_email}"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${local.service_account_email}"
}

# Cloud Run service for backend API
resource "google_cloud_run_service" "api" {
  name     = "${var.project_prefix}-api-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = "${var.container_registry}/${var.project_id}/${var.api_image_name}:${local.image_tag}"
        
        resources {
          limits = {
            cpu    = "${var.api_cpu}"
            memory = "${var.api_memory}"
          }
        }
        
        env {
          name  = "NODE_ENV"
          value = var.environment
        }
        
        env {
          name  = "DB_HOST"
          value = "/cloudsql/${var.db_instance_connection_name}"
        }
        
        # Database connection environment variables
        env {
          name  = "DB_NAME"
          value = var.db_name
        }
        
        env {
          name  = "DB_USER"
          value = var.db_user
        }
        
        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = "db-password"
              key  = "latest"
            }
          }
        }
        
        # Add application-specific environment variables
        dynamic "env" {
          for_each = var.api_env_vars
          content {
            name  = env.key
            value = env.value
          }
        }
        
        # Add Cloud SQL connection
        volume_mounts {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }
      
      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.db_instance_connection_name]
        }
      }
      
      service_account_name = local.service_account_email
      
      # Set container concurrency
      container_concurrency = var.api_container_concurrency
      
      # Set timeout
      timeout_seconds = var.api_timeout_seconds
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = var.api_min_instances
        "autoscaling.knative.dev/maxScale" = var.api_max_instances
        "run.googleapis.com/vpc-access-connector" = var.vpc_connector
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
        "run.googleapis.com/cloudsql-instances"   = var.db_instance_connection_name
        "run.googleapis.com/client-name"          = "terraform"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true

  depends_on = [
    google_project_iam_member.cloud_sql,
    google_project_iam_member.storage_object_user,
    google_project_iam_member.secret_accessor
  ]
}

# Allow unauthenticated access to the API if enabled
resource "google_cloud_run_service_iam_member" "api_public" {
  count    = var.api_allow_unauthenticated ? 1 : 0
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
  project  = var.project_id
}

# Cloud Functions for specific microservices
resource "google_cloudfunctions_function" "ai_processor" {
  name        = "${var.project_prefix}-ai-processor-${var.environment}"
  description = "Function to process medical exams with AI"
  runtime     = "nodejs18"
  project     = var.project_id
  region      = var.region

  available_memory_mb   = 4096
  source_archive_bucket = var.functions_bucket
  source_archive_object = var.ai_processor_source_zip
  entry_point           = "processExam"
  timeout               = 540 # 9 minutes for long processing

  service_account_email = local.service_account_email

  event_trigger {
    event_type = "google.storage.object.finalize"
    resource   = var.medical_exams_bucket
  }

  environment_variables = {
    DB_NAME     = var.db_name
    DB_USER     = var.db_user
    DB_HOST     = "/cloudsql/${var.db_instance_connection_name}"
    ENVIRONMENT = var.environment
  }

  secret_environment_variables {
    key        = "DB_PASSWORD"
    project_id = var.project_id
    secret     = "db-password"
    version    = "latest"
  }
}

resource "google_cloudfunctions_function" "payment_webhook" {
  name        = "${var.project_prefix}-payment-webhook-${var.environment}"
  description = "Function to handle Stripe payment webhooks"
  runtime     = "nodejs18"
  project     = var.project_id
  region      = var.region

  available_memory_mb   = 1024
  source_archive_bucket = var.functions_bucket
  source_archive_object = var.payment_webhook_source_zip
  entry_point           = "stripeWebhook"
  timeout               = 60 # 1 minute

  service_account_email = local.service_account_email

  trigger_http = true

  environment_variables = {
    DB_NAME     = var.db_name
    DB_USER     = var.db_user
    DB_HOST     = "/cloudsql/${var.db_instance_connection_name}"
    ENVIRONMENT = var.environment
  }

  secret_environment_variables {
    key        = "DB_PASSWORD"
    project_id = var.project_id
    secret     = "db-password"
    version    = "latest"
  }

  secret_environment_variables {
    key        = "STRIPE_SECRET_KEY"
    project_id = var.project_id
    secret     = "stripe-secret-key"
    version    = "latest"
  }

  secret_environment_variables {
    key        = "STRIPE_WEBHOOK_SECRET"
    project_id = var.project_id
    secret     = "stripe-webhook-secret"
    version    = "latest"
  }
}

# Allow unauthenticated access to the payment webhook
resource "google_cloudfunctions_function_iam_member" "payment_webhook_public" {
  project        = var.project_id
  region         = var.region
  cloud_function = google_cloudfunctions_function.payment_webhook.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}

resource "google_cloudfunctions_function" "notifications" {
  name        = "${var.project_prefix}-notifications-${var.environment}"
  description = "Function to send push notifications"
  runtime     = "nodejs18"
  project     = var.project_id
  region      = var.region

  available_memory_mb   = 1024
  source_archive_bucket = var.functions_bucket
  source_archive_object = var.notifications_source_zip
  entry_point           = "sendNotification"
  timeout               = 60 # 1 minute

  service_account_email = local.service_account_email

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/${var.project_id}/topics/notifications"
  }

  environment_variables = {
    ENVIRONMENT = var.environment
  }

  secret_environment_variables {
    key        = "FIREBASE_SERVER_KEY"
    project_id = var.project_id
    secret     = "firebase-server-key"
    version    = "latest"
  }
}

# Cloud Scheduler for cron jobs
resource "google_cloud_scheduler_job" "daily_health_summary" {
  name             = "${var.project_prefix}-daily-health-summary-${var.environment}"
  description      = "Generate daily health summaries for users"
  schedule         = "0 5 * * *" # 5 AM daily
  time_zone        = "Etc/UTC"
  attempt_deadline = "320s"
  project          = var.project_id
  region           = var.region

  retry_config {
    retry_count          = 3
    max_retry_duration   = "120s"
    min_backoff_duration = "10s"
    max_backoff_duration = "60s"
    max_doublings        = 3
  }

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_service.api.status[0].url}/api/cron/daily-summaries"
    
    oidc_token {
      service_account_email = local.service_account_email
      audience              = google_cloud_run_service.api.status[0].url
    }
  }
}

# Cloud Scheduler for database maintenance
resource "google_cloud_scheduler_job" "database_maintenance" {
  name             = "${var.project_prefix}-db-maintenance-${var.environment}"
  description      = "Perform database maintenance tasks"
  schedule         = "0 3 * * 0" # 3 AM on Sundays
  time_zone        = "Etc/UTC"
  attempt_deadline = "600s"
  project          = var.project_id
  region           = var.region

  retry_config {
    retry_count          = 1
    max_retry_duration   = "60s"
    min_backoff_duration = "10s"
    max_backoff_duration = "30s"
    max_doublings        = 2
  }

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_service.api.status[0].url}/api/cron/db-maintenance"
    
    oidc_token {
      service_account_email = local.service_account_email
      audience              = google_cloud_run_service.api.status[0].url
    }
  }
}

# Load Balancer configuration (optional)
resource "google_compute_global_address" "default" {
  count   = var.enable_load_balancer ? 1 : 0
  name    = "${var.project_prefix}-lb-ip-${var.environment}"
  project = var.project_id
}

resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  count                 = var.enable_load_balancer ? 1 : 0
  name                  = "${var.project_prefix}-neg-${var.environment}"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  project               = var.project_id
  
  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_backend_service" "default" {
  count       = var.enable_load_balancer ? 1 : 0
  name        = "${var.project_prefix}-backend-${var.environment}"
  project     = var.project_id
  protocol    = "HTTP"
  port_name   = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.serverless_neg[0].id
  }

  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

resource "google_compute_url_map" "default" {
  count           = var.enable_load_balancer ? 1 : 0
  name            = "${var.project_prefix}-url-map-${var.environment}"
  project         = var.project_id
  default_service = google_compute_backend_service.default[0].id
}

resource "google_compute_target_http_proxy" "default" {
  count   = var.enable_load_balancer ? 1 : 0
  name    = "${var.project_prefix}-http-proxy-${var.environment}"
  project = var.project_id
  url_map = google_compute_url_map.default[0].id
}

resource "google_compute_global_forwarding_rule" "default" {
  count      = var.enable_load_balancer ? 1 : 0
  name       = "${var.project_prefix}-lb-rule-${var.environment}"
  project    = var.project_id
  target     = google_compute_target_http_proxy.default[0].id
  port_range = "80"
  ip_address = google_compute_global_address.default[0].address
}

# HTTPS with Google-managed certificate (optional)
resource "google_compute_managed_ssl_certificate" "default" {
  count    = var.enable_load_balancer && var.enable_https ? 1 : 0
  name     = "${var.project_prefix}-ssl-cert-${var.environment}"
  project  = var.project_id
  
  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_target_https_proxy" "default" {
  count            = var.enable_load_balancer && var.enable_https ? 1 : 0
  name             = "${var.project_prefix}-https-proxy-${var.environment}"
  project          = var.project_id
  url_map          = google_compute_url_map.default[0].id
  ssl_certificates = [google_compute_managed_ssl_certificate.default[0].id]
}

resource "google_compute_global_forwarding_rule" "https" {
  count      = var.enable_load_balancer && var.enable_https ? 1 : 0
  name       = "${var.project_prefix}-lb-https-rule-${var.environment}"
  project    = var.project_id
  target     = google_compute_target_https_proxy.default[0].id
  port_range = "443"
  ip_address = google_compute_global_address.default[0].address
}