export interface Course {
  id: string;              // Unique identifier
  name: string;            // Course name
  description?: string;    // Optional course description
  createdAt?: string;      // ISO date string
  updatedAt?: string;      // ISO date string
}