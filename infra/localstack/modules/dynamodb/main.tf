# List of DynamoDB tables
locals {
  tables = [
    # Academic & Learning Domain
    "Exams",
    "Grades",
    "ReportCards",
    "Courses",
    "Syllabi",
    "Programs",
    "Assignments",
    "Submissions",
    "DiscussionForums",
    "Quizzes",
    "Timetables",
    "ResourceBookings",

    # Administrative Domain
    "Applications",
    "AdmissionDocuments",
    "Users",
    "UserRoles",
    "Roles",
    "RolePermissions",
    "Permissions",
    "AuditLogs",
    "StaffProfiles",
    "EmploymentContracts",
    "StudentProfiles",
    "AcademicHistory",
    "UserGuardians",
    "Guardians",

    # Operations & Communication Domain
    "AttendanceRecords",
    "FeeStructures",
    "Invoices",
    "Payments",
    "Scholarships",
    "LibraryAssets",
    "CirculationLogs",
    "Reservations",
    "Templates",
    "NotificationLogs",
    "UserPreferences"
  ]
}

# Create DynamoDB tables dynamically
resource "aws_dynamodb_table" "tables" {
  for_each = toset(local.tables)

  name           = each.key
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "tenantId"
  range_key      = "id"

  attribute {
    name = "tenantId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }
  
  tags = {
    Environment = "local"
  }
  
  # Destroy table on terraform destroy
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "tenants" {
  name           = "Tenants"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = "local"
  }

  lifecycle {
    prevent_destroy = false
  }
}
