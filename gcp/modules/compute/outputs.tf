output "cloud_run_service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_service.api.name
}

output "cloud_run_service_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_service.api.status[0].url
}

output "service_account_email" {
  description = "Email of the service account"
  value       = google_service_account.service_account.email
}

output "ai_processor_function_url" {
  description = "Trigger URL for the AI processor function"
  value       = google_cloudfunctions_function.ai_processor.https_trigger_url
}

output "payment_webhook_url" {
  description = "URL for the payment webhook function"
  value       = google_cloudfunctions_function.payment_webhook.https_trigger_url
}

output "load_balancer_ip" {
  description = "IP address of the load balancer (if enabled)"
  value       = var.enable_load_balancer ? google_compute_global_address.default[0].address : null
}