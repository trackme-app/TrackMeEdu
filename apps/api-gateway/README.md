# Education Management System - API Gateway

## Overview
The API Gateway serves as the single entry point for all client requests in the Education Management System. It abstracts the underlying microservices architecture, providing a unified API for the frontend.

## Responsibilities
- **Request Routing**: Proxies incoming requests to the appropriate microservice (e.g., User Service, Schedule Service).
- **Authentication & Authorization**: Validates JWT tokens and enforces access control in coordination with the IAM Service.
- **Rate Limiting**: Protects backend services from abuse and ensures high availability.
- **CORS Management**: Handles Cross-Origin Resource Sharing for the frontend application.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Proxy**: http-proxy-middleware

## Architecture
The gateway acts as a "Reverse Proxy". It does not store data itself but orchestrates communication between the frontend and the domain-specific services located in the `/services` directory.
