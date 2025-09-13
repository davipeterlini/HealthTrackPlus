/**
 * VPC Network Module for HealthTrackPlus
 * 
 * This module sets up the VPC networking infrastructure including:
 * - VPC network with custom subnetting
 * - Subnets for different environments and services
 * - Firewall rules
 * - Cloud NAT for outbound connectivity
 * - Private Service Access for managed services
 */

# VPC Network
resource "google_compute_network" "vpc_network" {
  name                    = "${var.project_prefix}-vpc-${var.environment}"
  auto_create_subnetworks = false
  description             = "VPC Network for ${var.project_prefix} ${var.environment} environment"
  routing_mode            = "GLOBAL"
  project                 = var.project_id
}

# Subnets
resource "google_compute_subnetwork" "private_subnet" {
  name                     = "${var.project_prefix}-private-subnet-${var.environment}"
  ip_cidr_range            = var.private_subnet_cidr
  region                   = var.region
  network                  = google_compute_network.vpc_network.id
  project                  = var.project_id
  private_ip_google_access = true
  
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Public Subnet (for load balancers and NAT gateway)
resource "google_compute_subnetwork" "public_subnet" {
  name                     = "${var.project_prefix}-public-subnet-${var.environment}"
  ip_cidr_range            = var.public_subnet_cidr
  region                   = var.region
  network                  = google_compute_network.vpc_network.id
  project                  = var.project_id
  
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Cloud Router for NAT Gateway
resource "google_compute_router" "router" {
  name    = "${var.project_prefix}-router-${var.environment}"
  region  = var.region
  network = google_compute_network.vpc_network.id
  project = var.project_id
}

# NAT Gateway
resource "google_compute_router_nat" "nat" {
  name                               = "${var.project_prefix}-nat-${var.environment}"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  project                            = var.project_id
  
  subnetwork {
    name                    = google_compute_subnetwork.private_subnet.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
  
  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Private Service Connection (for Cloud SQL, etc.)
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.project_prefix}-private-ip-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_network.id
  project       = var.project_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Firewall Rules

# Allow internal traffic within VPC
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.project_prefix}-allow-internal-${var.environment}"
  network = google_compute_network.vpc_network.name
  project = var.project_id

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
  }

  allow {
    protocol = "udp"
  }

  source_ranges = [var.private_subnet_cidr]
}

# Allow health checks from Google Cloud
resource "google_compute_firewall" "allow_health_checks" {
  name    = "${var.project_prefix}-allow-health-checks-${var.environment}"
  network = google_compute_network.vpc_network.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "8080"]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22", "209.85.152.0/22", "209.85.204.0/22"]
}

# Allow IAP access to instances
resource "google_compute_firewall" "allow_iap" {
  name    = "${var.project_prefix}-allow-iap-${var.environment}"
  network = google_compute_network.vpc_network.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["22", "3389"]
  }

  source_ranges = ["35.235.240.0/20"]
}

# Allow load balancer access
resource "google_compute_firewall" "allow_lb" {
  name    = "${var.project_prefix}-allow-lb-${var.environment}"
  network = google_compute_network.vpc_network.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["lb-backend"]
}

# Optional: VPC Service Controls if needed
# resource "google_access_context_manager_service_perimeter" "service_perimeter" {
#   count = var.enable_vpc_service_controls ? 1 : 0
#   # ... service perimeter configuration
# }