output "health_dataset_id" {
  description = "ID of the Vertex AI health dataset"
  value       = google_vertex_ai_dataset.health_dataset.id
}

output "health_dataset_name" {
  description = "Name of the Vertex AI health dataset"
  value       = google_vertex_ai_dataset.health_dataset.display_name
}

output "model_endpoint_id" {
  description = "ID of the model endpoint (if deployed)"
  value       = var.deploy_custom_model ? google_vertex_ai_endpoint.medical_analysis_endpoint[0].id : null
}

output "model_endpoint_name" {
  description = "Name of the model endpoint (if deployed)"
  value       = var.deploy_custom_model ? google_vertex_ai_endpoint.medical_analysis_endpoint[0].display_name : null
}

output "model_id" {
  description = "ID of the deployed model (if deployed)"
  value       = var.deploy_custom_model ? google_vertex_ai_model.medical_analysis_model[0].id : null
}

output "tuning_job_id" {
  description = "ID of the Gemini tuning job (if enabled)"
  value       = var.enable_gemini_tuning ? google_vertex_ai_tuning_job.gemini_tuning_job[0].id : null
}