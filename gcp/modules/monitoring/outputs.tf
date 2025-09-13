output "email_notification_channel_id" {
  description = "ID of the email notification channel"
  value       = google_monitoring_notification_channel.email.id
}

output "slack_notification_channel_id" {
  description = "ID of the Slack notification channel (if configured)"
  value       = var.slack_webhook_url != "" ? google_monitoring_notification_channel.slack[0].id : null
}

output "api_uptime_check_id" {
  description = "ID of the API uptime check"
  value       = google_monitoring_uptime_check_config.api_uptime_check.id
}

output "api_dashboard_name" {
  description = "Name of the API dashboard"
  value       = google_monitoring_dashboard.api_dashboard.dashboard_json
}

output "db_dashboard_name" {
  description = "Name of the database dashboard"
  value       = google_monitoring_dashboard.db_dashboard.dashboard_json
}

output "auth_failures_metric_name" {
  description = "Name of the authentication failures metric"
  value       = google_logging_metric.auth_failures.name
}