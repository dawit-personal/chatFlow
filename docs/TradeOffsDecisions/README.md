## Trade-offs and Decisions

## Key technical decisions made

Given the limited timeline and defined scope of the project, all key technical decisions were made with a focus on developer productivity, requirement coverage, and sensible defaults that balance speed and maintainability.

- Technology Stack Selection
  - Decision
    - Use familiar, stable technologies like Node.js, Socket.IO, PostgreSQL to maximize productivity and leverage strong community support.
  - Trade-off
    - Sacrificed potential benefits of newer technologies (e.g., TypeScript, gRPC, Protobuf) that may offer better performance or scalability but require more ramp-up time.
- Real-time Communication
  - Decision
    - Use Socket.IO instead of raw WebSocket for real-time features due to its built-in reconnection handling, rooms, and rich ecosystem.
  - Trade-off
    - Socket.IO adds some overhead compared to raw WebSocket but reduces development complexity and speeds up delivery.
- Database Performance
  - Decision
    - Implement indexing to optimize read-heavy queries (like fetching messages), improving user experience.
  - Trade-off
    - Indexing slows down write operations slightly, but this is acceptable given the chat app’s read-heavy nature.
- Deployment & Environment Setup
  - Decision
    - Use Docker Compose to automate environment setup locally, enabling quick and consistent onboarding.
  - Trade-off
    - Docker Compose lacks advanced orchestration and auto-scaling features compared to Kubernetes, limiting production scalability.
- Codebase Organization
  - Decision
    - Adopt a monorepo JavaScript stack for consistency, code reuse, and fast iteration across backend
  - Trade-off
    - Monorepos can increase complexity and limit modularity as projects grow, but speed and consistency were prioritized.
- Project Focus
  - Decision
    - Focus on delivering a working prototype with core functionality within the deadline.
  - Trade-off
    - Postponed advanced scalability features like microservices, job queues, and rate limiting, which can be added later.
- API Design
  - Decision
    - Defer API versioning implementation to avoid last-minute breaking changes.
  - Trade-off
- Authentication
  - Decision
    - Implement access token-based authentication initially, with schema support for refresh tokens.
  - Trade-off
    - Not using refresh tokens limits token management and security features but meets the one-week deadline.

## Alternative approaches considered

- TypeScript over JavaScript
  - Initially considered using TypeScript to benefit from static typing, better tooling, and fewer runtime errors. However, given the tight deadline, I opted for JavaScript to move faster with fewer build and type management overheads.
- gRPC/Protocol Buffers or GraphQL
  - Explored using gRPC with Protocol Buffers or GraphQL for more efficient data transfer and schema-based APIs. However, the project requirements explicitly mandated RESTful APIs, so I followed REST conventions for endpoint design and communication.
- Manual Setup vs. Docker Compose
  - Setting up each environment manually was initially explored, but using Docker Compose was chosen to improve reproducibility, automate setup, and simplify onboarding for other developers.
- SOC 2 Compliance Readiness
  - Considered implementing early steps toward SOC 2 compliance such as structured logging, access control, and audit trails. These were deprioritized given the limited time and non-production scope, but the architecture and tooling choices support future compliance efforts.
- API Versioning Strategy
  - I intended to implement URL-based API versioning (e.g., /v1/users) to ensure backward compatibility and allow iterative improvements without breaking existing clients. However, I realized just before submitting the assignment that versioning had not been fully implemented. To avoid breaking existing code, I decided to postpone it for future iterations. The routing structure is designed to support versioning easily when added later.
- Token Management
  - Considered using PASETO (Platform-Agnostic Security Tokens) instead of JWT for enhanced security and simplicity, but opted to stick with JWT due to familiarity and time constraints. PASETO remains a viable option for future improvements.
- Authentication Tokens
  - Considered implementing refresh tokens for better security and seamless user sessions. However, to meet the one-week deadline, the system currently relies mainly on access tokens. The UserLogins table is designed to support refresh tokens for future enhancements.

## What you'd do differently with more time

- Implement API versioning to ensure backward compatibility and smoother iterative updates without breaking existing clients.
- Introduce microservices architecture to improve scalability and maintainability, allowing independent deployment and scaling of components.
- Replace REST with gRPC and Protobuf for more efficient communication, especially for real-time features.
- Add robust authentication with refresh tokens and consider PASETO for enhanced security.
- Incorporate RabbitMQ and Redis adapters to improve asynchronous processing and real-time event synchronization across instances.
- Set up proper load testing with tools like k6 to identify bottlenecks and optimize performance.
- Adopt TypeScript for improved code quality and maintainability.
- Enforce CI/CD pipelines with automated testing and deployment for better reliability.
- Implement comprehensive logging, monitoring, and alerting for production readiness.
- Migrate from Docker Compose to Kubernetes for container orchestration to improve scalability, fault tolerance, and automated deployment in production environments.
- Emit events only to the relevant connected users (e.g., friends or chat participants) instead of broadcasting to all clients, reducing unnecessary network traffic and improving scalability.
- Add Swagger/OpenAPI Documentation
  - Provide a live, interactive API reference to improve collaboration and onboarding.
  - Also containerize Swagger UI as a standalone service in docker-compose.yml for local and shared access.
