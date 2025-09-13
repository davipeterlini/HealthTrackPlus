output "db_password_secret_id" {
  description = "Secret ID for database password"
  value       = google_secret_manager_secret.db_password.id
}

output "stripe_secret_key_id" {
  description = "Secret ID for Stripe API key"
  value       = google_secret_manager_secret.stripe_secret_key.id
}

output "stripe_webhook_secret_id" {
  description = "Secret ID for Stripe webhook secret"
  value       = google_secret_manager_secret.stripe_webhook_secret.id
}

output "firebase_server_key_id" {
  description = "Secret ID for Firebase server key"
  value       = google_secret_manager_secret.firebase_server_key.id
}

output "cloud_armor_policy_id" {
  description = "ID of the Cloud Armor security policy (if enabled)"
  value       = var.enable_cloud_armor ? google_compute_security_policy.security_policy[0].id : null
}

output "cloud_armor_policy_name" {
  description = "Name of the Cloud Armor security policy (if enabled)"
  value       = var.enable_cloud_armor ? google_compute_security_policy.security_policy[0].name : null
}

output "kms_key_id" {
  description = "ID of the KMS key for encryption (if enabled)"
  value       = var.enable_cmek ? google_kms_crypto_key.key[0].id : null
}

output "identity_platform_config_name" {
  description = "Name of the Identity Platform configuration"
  value       = google_identity_platform_config.default.name
}