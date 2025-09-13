output "medical_exams_bucket_name" {
  description = "Name of the medical exams bucket"
  value       = google_storage_bucket.medical_exams.name
}

output "medical_exams_bucket_url" {
  description = "URL of the medical exams bucket"
  value       = google_storage_bucket.medical_exams.url
}

output "media_bucket_name" {
  description = "Name of the media bucket"
  value       = google_storage_bucket.media.name
}

output "media_bucket_url" {
  description = "URL of the media bucket"
  value       = google_storage_bucket.media.url
}

output "educational_content_bucket_name" {
  description = "Name of the educational content bucket"
  value       = google_storage_bucket.educational_content.name
}

output "educational_content_bucket_url" {
  description = "URL of the educational content bucket"
  value       = google_storage_bucket.educational_content.url
}

output "backups_bucket_name" {
  description = "Name of the backups bucket"
  value       = google_storage_bucket.backups.name
}

output "functions_bucket_name" {
  description = "Name of the functions source bucket"
  value       = google_storage_bucket.functions.name
}

output "firebase_hosting_bucket_name" {
  description = "Name of the Firebase hosting bucket"
  value       = google_storage_bucket.firebase_hosting.name
}