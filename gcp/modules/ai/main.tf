/**
 * AI Module for HealthTrackPlus
 * 
 * This module sets up:
 * - Vertex AI endpoints for model hosting
 * - Model management resources
 * - Integration with other services
 */

# Create a Vertex AI dataset for health data analysis
resource "google_vertex_ai_dataset" "health_dataset" {
  display_name          = "${var.project_prefix}-health-dataset-${var.environment}"
  metadata_schema_uri   = "gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml"
  region                = var.region
  project               = var.project_id
}

# Upload the model to Model Registry
resource "google_vertex_ai_model" "medical_analysis_model" {
  count                 = var.deploy_custom_model ? 1 : 0
  display_name          = "${var.project_prefix}-medical-analysis-${var.environment}"
  artifact_uri          = var.model_artifact_uri
  region                = var.region
  project               = var.project_id
  
  container_spec {
    image_uri    = var.model_container_image
    command      = []
    args         = []
    
    env {
      name  = "MODEL_NAME"
      value = "medical-analysis"
    }
    
    env {
      name  = "ENVIRONMENT"
      value = var.environment
    }
    
    ports {
      container_port = 8080
    }
    
    health_route {
      port     = 8080
      path     = "/health"
    }
    
    predict_route {
      port     = 8080
      path     = "/predict"
    }
  }
}

# Create an endpoint to host the model
resource "google_vertex_ai_endpoint" "medical_analysis_endpoint" {
  count        = var.deploy_custom_model ? 1 : 0
  display_name = "${var.project_prefix}-medical-endpoint-${var.environment}"
  region       = var.region
  project      = var.project_id
  
  network      = var.network
  
  depends_on = [
    google_vertex_ai_model.medical_analysis_model[0]
  ]
}

# Deploy the model to the endpoint
resource "google_vertex_ai_model_deployment" "medical_analysis_deployment" {
  count           = var.deploy_custom_model ? 1 : 0
  endpoint        = google_vertex_ai_endpoint.medical_analysis_endpoint[0].id
  model           = google_vertex_ai_model.medical_analysis_model[0].id
  display_name    = "${var.project_prefix}-medical-deployment-${var.environment}"
  dedicated_resources {
    machine_spec {
      machine_type = var.machine_type
      accelerator_type = var.accelerator_type
      accelerator_count = var.accelerator_count
    }
    min_replica_count = var.min_replica_count
    max_replica_count = var.max_replica_count
  }
  traffic_split {
    key = google_vertex_ai_model.medical_analysis_model[0].name
    value = 100
  }
  
  project = var.project_id
}

# Online prediction IAM permission for service account
resource "google_project_iam_member" "vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${var.service_account_email}"
}

# Vertex AI model IAM permissions
resource "google_vertex_ai_endpoint_iam_member" "endpoint_invoker" {
  count    = var.deploy_custom_model ? 1 : 0
  project  = var.project_id
  region   = var.region
  endpoint = google_vertex_ai_endpoint.medical_analysis_endpoint[0].endpoint_id
  role     = "roles/aiplatform.modelUser"
  member   = "serviceAccount:${var.service_account_email}"
}

# Create Generative AI Model Tuning Job if enabled
resource "google_vertex_ai_tuning_job" "gemini_tuning_job" {
  count               = var.enable_gemini_tuning ? 1 : 0
  region              = var.region
  project             = var.project_id
  display_name        = "${var.project_prefix}-gemini-tuning-${var.environment}"
  service_account     = var.service_account_email
  
  large_model_reference {
    name = var.gemini_base_model
  }

  hyperparameters {
    learning_rate        = 0.0002
    batch_size           = 8
    training_steps       = 1000
    train_steps_per_eval = 100
  }

  dataset_uri            = var.gemini_training_data_uri
  evaluation_dataset_uri = var.gemini_eval_data_uri
  validation_dataset_uri = var.gemini_validation_data_uri
}