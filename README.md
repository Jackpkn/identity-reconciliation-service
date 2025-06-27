# Identity Reconciliation Service

This service reconciles user identities based on email and phone number, linking contact information from multiple sources into a single, unified record. It's designed to be a production-ready solution for FluxKart, helping them provide a personalized customer experience.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
  - [Development](#development)
  - [Production](#production)
- [CI/CD](#ci-cd)
- [Testing](#testing)
- [Logging](#logging)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Identity Reconciliation:** Links contact information (email and phone number) to identify unique users across multiple sources.
- **Primary and Secondary Contacts:** Establishes a "primary" contact and links subsequent contacts as "secondary" to maintain a clear relationship.
- **Database Integration:** Uses PostgreSQL as the primary data store for contact information.
- **Caching:** Implements Redis caching for improved performance and reduced database load. Uses in-memory cache in development mode.
- **RESTful API:** Provides a simple and consistent REST API for identity identification.
- **Dockerized Deployment:** Supports Docker and Docker Compose for easy deployment and scaling.
- **CI/CD Pipelines:** Includes CI/CD workflows for automated testing, building, and deployment.
- **Comprehensive Logging:** Utilizes Winston for detailed logging, including request logging, error logging, and debug logging.
- **Rate Limiting:** Protects the API from abuse with rate limiting middleware.
- **Validation:** Validates all incoming requests against a defined schema.
- **Health Checks:** Provides a health check endpoint for monitoring application status.
- **Metrics:** Exposes metrics for monitoring application performance (configurable).

## Architecture

The service follows a layered architecture:

- **Controllers:** Handle incoming HTTP requests, validate data, and orchestrate the business logic.
- **Services:** Implement the core business logic, including identity reconciliation and contact management.
- **Repositories:** Provide an abstraction layer for accessing and manipulating data in the database.
- **Models:** Define the data structures used throughout the application.
- **Middleware:** Intercept HTTP requests and responses for tasks like logging, authentication, and error handling.
- **Utils:** Contains utility functions for tasks like database connection, caching, and logging.
- **Types:** Defines TypeScript types and interfaces for data structures and API contracts.
- **Config:**  Handles application configuration using environment variables.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm
- PostgreSQL database
- Redis (optional, for production caching)
- Docker (optional, for containerized deployment)
- Docker Compose (optional, for containerized deployment)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Jackpkn/identity-reconciliation-service.git
    cd identity-reconciliation-service
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or npm install
    ```

### Configuration

1.  **Create a `.env` file:**

    Create a `.env` file in the root directory based on the `.env.example` file.

    ```bash
    cp .env.example .env
    ```

2.  **Configure environment variables:**

    Update the `.env` file with your database connection string, Redis URL (if using), and other configuration options.

    ```
    NODE_ENV=development
    PORT=3000
    API_VERSION=v1
    DATABASE_URL=postgresql://postgres:password@localhost:5432/bitespeed_dev
    REDIS_URL=redis://localhost:6379
    REDIS_TTL=3600
    RATE_LIMIT_WINDOW_MS=900000
    RATE_LIMIT_MAX=100
    CORS_ORIGIN=http://localhost:3000
    LOG_LEVEL=info
    LOG_FORMAT=combined
    ENABLE_METRICS=false
    METRICS_PORT=9090
    ```

### Running the Application

1.  **Start the development server:**

    ```bash
    npm dev  # or npm run dev
    ```

    This will start the server with nodemon, which automatically restarts the server on file changes.

2.  **Build and start the production server:**

    ```bash
    npm build      # or npm run build
    npm start      # or npm run start
    ```

## API Endpoints

-   **`POST /identify`**: Identifies and reconciles user identities based on email and phone number.

    ```json
    {
      "email": "user@example.com",
      "phoneNumber": "123-456-7890"
    }
    ```

    Response:

    ```json
    {
      "contact": {
        "primaryContatctId": 1,
        "emails": ["user@example.com", "another@example.com"],
        "phoneNumbers": ["123-456-7890", "987-654-3210"],
        "secondaryContactIds": [2, 3]
      }
    }
    ```

-   **`GET /health`**:  Checks the health status of the service, including database and cache connections.

    Response:

    ```json
    {
      "status": "healthy",
      "timestamp": "2024-01-03T12:00:00.000Z",
      "version": "1.0.0",
      "uptime": 3600,
      "database": {
        "status": "connected",
        "latency": 10
      },
      "cache": {
        "status": "connected",
        "latency": 5
      }
    }
    ```

-   **`GET /stats`**: Returns statistics about the contact database.

    Response:

    ```json
    {
      "stats": {
        "total": 100,
        "primary": 50,
        "secondary": 50
      },
      "timestamp": "2024-01-03T12:00:00.000Z"
    }
    ```

## Docker

### Development

1.  **Build the Docker image:**

    ```bash
    docker build -f docker/Dockerfile -t identity-reconciliation-service .
    ```

2.  **Run the application using Docker Compose:**

    ```bash
    docker-compose -f docker/docker-compose.yml up
    ```

### Production

1.  **Build and push the Docker image to a registry:**

    ```bash
    docker build -f docker/Dockerfile -t https://github.com/Jackpkn/identity-reconciliation-service.git
    docker push https://github.com/Jackpkn/identity-reconciliation-service.git
    ```

2.  **Deploy using Docker Compose in production mode:**

    Ensure you have set up the `DATABASE_URL` and `REDIS_URL` environment variables appropriately in your production environment.

    ```bash
    docker-compose -f docker/docker-compose.prod.yml up -d
    ```

## CI/CD

The project includes CI/CD workflows using GitHub Actions for automated testing, building, and deployment.

-   **.github/workflows/ci.yml**: This workflow runs tests, linting, formatting checks, type checking, and security audits on every push to the `main` and `develop` branches, as well as on pull requests.
-   **.github/workflows/cd.yml**: This workflow builds and deploys the Docker image to a container registry on every push to the `main` branch.

## Logging

The application uses Winston for logging. Logs are written to the console and to files in the `logs` directory. The log level and format can be configured using environment variables.

-   `LOG_LEVEL`: Sets the logging level (e.g., `info`, `debug`, `error`).
-   `LOG_FORMAT`: Sets the log format (e.g., `combined`, `json`).

## Caching

The application uses Redis for caching contact information and API responses.  In development mode, an in-memory cache (`node-cache`) is used if a Redis URL is not provided. The cache TTL (time-to-live) is configurable using the `REDIS_TTL` environment variable.

## Error Handling

The application includes a global error handler that catches unhandled exceptions and sends appropriate error responses to the client.  Errors are logged with detailed information, including the request path, method, and stack trace.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests.
4.  Run the tests to ensure everything is working correctly.
5.  Submit a pull request.
