export interface Course {
    tenantId?: string; // Tenant identifier for isolation
    id?: string; // Unique identifier
    course_name: string; // Course name
    description?: string; // Optional course description
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    modifiedAt?: string; // ISO date string
}
