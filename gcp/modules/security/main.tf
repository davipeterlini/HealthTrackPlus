/**
 * Security Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Secret Manager secrets
 * - Cloud Armor security policies
 * - Firebase Auth / Identity Platform
 * - IAM roles and permissions
 */

# Secret Manager secrets
resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"
  project   = var.project_id
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "db_password_version" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "stripe_secret_key" {
  secret_id = "stripe-secret-key"
  project   = var.project_id
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "stripe_secret_key_version" {
  secret      = google_secret_manager_secret.stripe_secret_key.id
  secret_data = var.stripe_secret_key
}

resource "google_secret_manager_secret" "stripe_webhook_secret" {
  secret_id = "stripe-webhook-secret"
  project   = var.project_id
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "stripe_webhook_secret_version" {
  secret      = google_secret_manager_secret.stripe_webhook_secret.id
  secret_data = var.stripe_webhook_secret
}

resource "google_secret_manager_secret" "firebase_server_key" {
  secret_id = "firebase-server-key"
  project   = var.project_id
  
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "firebase_server_key_version" {
  secret      = google_secret_manager_secret.firebase_server_key.id
  secret_data = var.firebase_server_key
}

# Identity Platform (Firebase Auth) configuration
resource "google_identity_platform_config" "default" {
  project = var.project_id
  
  autodelete_anonymous_users = true
  
  # Configure sign-in providers
  sign_in {
    allow_duplicate_emails = false
    
    email {
      enabled           = true
      password_required = true
    }
    
    phone_number {
      enabled = true
      test_phone_numbers = var.environment != "prod" ? {
        "+15555550100" = "000000"
        "+15555550101" = "111111"
      } : {}
    }
  }
  
  # Multi-factor authentication
  mfa {
    state = var.environment == "prod" ? "ENABLED" : "DISABLED"
    
    provider_configs {
      state = "ENABLED"
      totp {
        issuer = "HealthTrackPlus"
      }
    }
  }
}

# Set up OAuth providers
resource "google_identity_platform_oauth_idp_config" "google" {
  name         = "google.com"
  project      = var.project_id
  display_name = "Google"
  enabled      = true
  
  client_id     = var.google_client_id
  client_secret = var.google_client_secret
}

resource "google_identity_platform_oauth_idp_config" "apple" {
  name         = "apple.com"
  project      = var.project_id
  display_name = "Apple"
  enabled      = true
  
  client_id     = var.apple_client_id
  client_secret = var.apple_client_secret
}

# Set up email templates
resource "google_identity_platform_config" "email_templates" {
  project = var.project_id
  
  email {
    reset_password_template {
      body    = var.reset_password_email_body
      subject = var.reset_password_email_subject
    }
    
    verify_email_template {
      body    = var.verify_email_body
      subject = var.verify_email_subject
    }
    
    callback_uri = "https://${var.domain_name}/auth/callback"
  }
}

# Cloud Armor security policy
resource "google_compute_security_policy" "security_policy" {
  count       = var.enable_cloud_armor ? 1 : 0
  name        = "${var.project_prefix}-security-policy-${var.environment}"
  description = "Security policy for ${var.project_prefix} ${var.environment}"
  project     = var.project_id
  
  # Default rule - deny all traffic that doesn't match any of the rules below
  rule {
    action      = "deny(403)"
    priority    = 2147483647
    description = "Default denial rule"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
  }
  
  # Rule to allow traffic from allowed countries
  rule {
    action      = "allow"
    priority    = 1000
    description = "Allow traffic from allowed countries"
    match {
      expr {
        expression = "origin.region_code == 'US' || origin.region_code == 'CA'"
      }
    }
  }
  
  # Rule to block SQL injection
  rule {
    action      = "deny(403)"
    priority    = 2000
    description = "Block SQL injection"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }
  }
  
  # Rule to block XSS
  rule {
    action      = "deny(403)"
    priority    = 2010
    description = "Block XSS"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }
  }
  
  # Rate limit rule
  rule {
    action      = "rate_based_ban"
    priority    = 3000
    description = "Rate limit"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      rate_limit_threshold {
        count        = 100
        interval_sec = 60
      }
      ban_duration_sec = 600
      exceed_action    = "deny(429)"
    }
  }
}

# KMS Key for sensitive data encryption
resource "google_kms_key_ring" "keyring" {
  count    = var.enable_cmek ? 1 : 0
  name     = "${var.project_prefix}-keyring-${var.environment}"
  location = var.region
  project  = var.project_id
}

resource "google_kms_crypto_key" "key" {
  count           = var.enable_cmek ? 1 : 0
  name            = "${var.project_prefix}-key-${var.environment}"
  key_ring        = google_kms_key_ring.keyring[0].id
  rotation_period = "7776000s" # 90 days
  purpose         = "ENCRYPT_DECRYPT"
  
  version_template {
    algorithm = "GOOGLE_SYMMETRIC_ENCRYPTION"
    protection_level = "SOFTWARE"
  }
}

# Grant KMS permissions to service account
resource "google_kms_crypto_key_iam_member" "crypto_key_user" {
  count         = var.enable_cmek ? 1 : 0
  crypto_key_id = google_kms_crypto_key.key[0].id
  role          = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  member        = "serviceAccount:${var.service_account_email}"
}