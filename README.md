# TrackMe Education

TrackMe Education (TME) is an open-source, self-hostable Education & Learner Management System (ELMS).

## Goals
- AWS-native architecture
- Fully containerised local development
- Microservice-based backend
- Multi-tenant SaaS-ready design

## Repository Structure
- `apps/`       → User-facing applications (Frontend) and API entry points (Gateway).
- `services/`   → Backend microservices organized by educational domain.
- `packages/`   → Shared libraries, types, and utilities used across the monorepo.
- `infra/`      → Infrastructure as Code and local AWS parity tools (LocalStack).

## Documentation Index

### Applications
- [**Frontend**](./apps/frontend/README.md) - The main React user interface.
- [**API Gateway**](./apps/api-gateway/README.md) - Routing and security layer for all service requests.

### Service Domains

#### [Academic & Learning](./services/Academic%20&%20Learning/README.md)
- [Assessment & Grading](./services/Academic%20&%20Learning/Assessment%20&%20Grading/README.md)
- [Course & Curriculum](./services/Academic%20&%20Learning/Course%20&%20Curriculum/README.md)
- [Learning Management System (LMS)](./services/Academic%20&%20Learning/Learning%20Management%20System/README.md)
- [Scheduling & Timetable](./services/Academic%20&%20Learning/Scheduling%20&%20Timetable/README.md)

#### [Administrative](./services/Administrative/README.md)
- [Admissions](./services/Administrative/Admissions/README.md)
- [Identity & Access Management (IAM)](./services/Administrative/Identity%20&%20Access%20Management/README.md)
- [Staff Information](./services/Administrative/Staff%20Information/README.md)
- [Student Information (SIS)](./services/Administrative/Student%20Information/README.md)

#### [Operations & Communication](./services/Operations%20&%20Communication/README.md)
- [Attendance](./services/Operations%20&%20Communication/Attendance/README.md)
- [Finance & Fees](./services/Operations%20&%20Communication/Finance%20&%20Fees/README.md)
- [Library](./services/Operations%20&%20Communication/Library/README.md)
- [Notifications](./services/Operations%20&%20Communication/Notifications/README.md)

## Local Development
Docker and Docker Compose are used to simulate AWS services locally.
