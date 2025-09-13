/**
 * Monitoring Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Cloud Monitoring dashboards
 * - Custom alerts
 * - Logging configuration
 * - Error reporting
 * - Uptime checks
 */

# Create a monitoring notification channel (email)
resource "google_monitoring_notification_channel" "email" {
  display_name = "Email Alerts - ${var.environment}"
  type         = "email"
  project      = var.project_id
  
  labels = {
    email_address = var.alert_email
  }
}

# Create a monitoring notification channel (Slack)
resource "google_monitoring_notification_channel" "slack" {
  count        = var.slack_webhook_url != "" ? 1 : 0
  display_name = "Slack Alerts - ${var.environment}"
  type         = "slack"
  project      = var.project_id
  
  labels = {
    channel_name = var.slack_channel
  }
  
  sensitive_labels {
    auth_token = var.slack_webhook_url
  }
}

# Uptime check for API service
resource "google_monitoring_uptime_check_config" "api_uptime_check" {
  display_name = "${var.project_prefix}-api-uptime-${var.environment}"
  timeout      = "10s"
  period       = "60s"
  project      = var.project_id
  
  http_check {
    path           = "/api/health"
    port           = 443
    request_method = "GET"
    use_ssl        = true
    validate_ssl   = true
  }
  
  monitored_resource {
    type = "uptime_url"
    labels = {
      host = var.api_domain
    }
  }
  
  content_matchers {
    content = "ok"
    matcher = "CONTAINS_STRING"
  }
}

# Create a monitoring dashboard for API performance
resource "google_monitoring_dashboard" "api_dashboard" {
  dashboard_json = <<EOF
{
  "displayName": "${var.project_prefix}-api-dashboard-${var.environment}",
  "gridLayout": {
    "widgets": [
      {
        "title": "Request Count",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/request_count\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_RATE"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "Latency",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/request_latencies\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_PERCENTILE_99"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "Memory Utilization",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/container/memory/utilizations\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "CPU Utilization",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/container/cpu/utilizations\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      }
    ]
  }
}
EOF
  project = var.project_id
}

# Create a monitoring dashboard for database performance
resource "google_monitoring_dashboard" "db_dashboard" {
  dashboard_json = <<EOF
{
  "displayName": "${var.project_prefix}-db-dashboard-${var.environment}",
  "gridLayout": {
    "widgets": [
      {
        "title": "CPU Utilization",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.db_instance_name}\" AND metric.type=\"cloudsql.googleapis.com/database/cpu/utilization\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "Memory Utilization",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.db_instance_name}\" AND metric.type=\"cloudsql.googleapis.com/database/memory/utilization\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "Active Connections",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.db_instance_name}\" AND metric.type=\"cloudsql.googleapis.com/database/postgresql/num_backends\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      },
      {
        "title": "Disk Utilization",
        "xyChart": {
          "dataSets": [
            {
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.db_instance_name}\" AND metric.type=\"cloudsql.googleapis.com/database/disk/utilization\"",
                  "aggregation": {
                    "alignmentPeriod": "60s",
                    "perSeriesAligner": "ALIGN_MEAN"
                  }
                }
              },
              "plotType": "LINE"
            }
          ]
        }
      }
    ]
  }
}
EOF
  project = var.project_id
}

# Alert policy for high API latency
resource "google_monitoring_alert_policy" "api_latency_alert" {
  display_name = "${var.project_prefix}-api-latency-alert-${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "High API Latency"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/request_latencies\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = var.latency_threshold_ms
      
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_PERCENTILE_95"
      }
    }
  }
  
  notification_channels = concat(
    [google_monitoring_notification_channel.email.name],
    var.slack_webhook_url != "" ? [google_monitoring_notification_channel.slack[0].name] : []
  )
  
  project = var.project_id
}

# Alert policy for high error rate
resource "google_monitoring_alert_policy" "api_error_alert" {
  display_name = "${var.project_prefix}-api-error-alert-${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "High API Error Rate"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"4xx\" OR metric.labels.response_code_class=\"5xx\""
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = var.error_rate_threshold
      
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
  
  notification_channels = concat(
    [google_monitoring_notification_channel.email.name],
    var.slack_webhook_url != "" ? [google_monitoring_notification_channel.slack[0].name] : []
  )
  
  project = var.project_id
}

# Alert policy for database CPU utilization
resource "google_monitoring_alert_policy" "db_cpu_alert" {
  display_name = "${var.project_prefix}-db-cpu-alert-${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "High Database CPU Utilization"
    condition_threshold {
      filter          = "resource.type=\"cloudsql_database\" AND resource.labels.database_id=\"${var.db_instance_name}\" AND metric.type=\"cloudsql.googleapis.com/database/cpu/utilization\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = var.db_cpu_threshold
      
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
  
  notification_channels = concat(
    [google_monitoring_notification_channel.email.name],
    var.slack_webhook_url != "" ? [google_monitoring_notification_channel.slack[0].name] : []
  )
  
  project = var.project_id
}

# Log metric for authentication failures
resource "google_logging_metric" "auth_failures" {
  name        = "${var.project_prefix}_auth_failures_${var.environment}"
  description = "Count of authentication failures"
  filter      = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.api_service_name}\" AND textPayload:\"Authentication failed\""
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
  }
  project = var.project_id
}

# Alert policy for authentication failures
resource "google_monitoring_alert_policy" "auth_failures_alert" {
  display_name = "${var.project_prefix}-auth-failures-alert-${var.environment}"
  combiner     = "OR"
  conditions {
    display_name = "High Authentication Failures Rate"
    condition_threshold {
      filter          = "metric.type=\"logging.googleapis.com/user/${google_logging_metric.auth_failures.name}\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = var.auth_failure_threshold
      
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
  
  notification_channels = concat(
    [google_monitoring_notification_channel.email.name],
    var.slack_webhook_url != "" ? [google_monitoring_notification_channel.slack[0].name] : []
  )
  
  project = var.project_id
}