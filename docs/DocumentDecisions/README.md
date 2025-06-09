# Architectural Decision:

## Why MonoRepo

For a small-scale chat application, a monorepo provides several advantages that simplify development and deployment without overengineering the setup.

#### Benefits

1. Simplified Development Workflow
   - One unified repository for backend, frontend, and RTC (Socket.IO) services.
   - Easier to run, test, and debug locally — just docker-compose up.
2. Tighter Coordination Between Services
   - Changes across the backend and RTC can be coordinated and committed atomically.
3. Centralized Configuration
   - .env variables managed in the root directory can be shared across services using Docker Compose, avoiding duplication.
4. Scalability (within reason)
   - While it starts small, this monorepo structure allows for future modularization or service isolation if needed (e.g., extracting services to microservices later).

### Why Separate RTC (Socket.IO) Service?

#### Justification

- Single Responsibility Principle: The RTC server handles only real-time messaging logic (connection, disconnection, events
- Fault Isolation: If the WebSocket layer crashes, the REST API remains unaffected.
- Improved Scaling Potential:
  - You can horizontally scale the RTC service independently later.
- Lightweight, Stateless Design:
  - RTC can be deployed as a small Node.js service, easier to containerize and update.

### What is the Limitation of monorepo

1. Tight Coupling in Git History
   - Changes to frontend/backend in a single commit can cause noise or friction if teams scale.
2. DevOps Complexity Still Exists
   - Even in a monorepo, managing containers, networks, and services requires discipline.
3. Deployment Lockstep
   - All services are deployed together unless specifically configured otherwise, which may limit flexibility for partial rollouts.

## Backend Architecture: Layered Design Decision

### Layers Overview

The following structure align wiht Separation of Concerns (SoC) principles

- Route Layer: Defines endpoint paths and connects them to controllers.
- Controller Layer: Handles request/response logic.
- Service Layer: Contains business logic.
- Repository Layer: Handles data persistence (via ORM Sequelize).
- Middleware: Applied for cross-cutting concerns like validation and authentication.

### Advantages

- Separation of concerns: Each layer does one thing well.
- Testability: Services and repositories can be unit tested in isolation
- Scalability: Easy to grow the system without creating tightly coupled spaghetti code.
- Reusability: Business logic is reusable across different routes or input methods (e.g., API, CLI, socket)

### Why Use Repository as Singleton

- Shared DB instance: Keeps the DB model or connection scoped centrally.
- Less overhead: Avoids repeated instantiation.
- Consistency: Shared state or configuration across usage (e.g., transaction options).

### Overall Benefits of This Structure

- Clear separation of responsibilities.
- Easier to onboard new devs (logical flow from route → controller → service → repository).
- Promotes testable, maintainable, and scalable codebase.
- Easy to apply cross-cutting concerns (auth, validation, logging) via middleware.

## Why You Use Migration Files

- database schema to be reproducible and version-controlled across development, staging, and production environments.
- working with a team or across environments (e.g., Docker), so syncing DB schema with code is critical.
- Safe structured evolution of your DB over time

## Why You Use Transactions to Enforce ACID Principles

Using transactions ensures that a set of DB operations either all succeed or none of them are applied — preserving data integrity.

This align with

- Atomicity All operations in a transaction are treated as a single unit.
- Consistency Data always transitions from one valid state to another.
- Isolation Concurrent transactions don’t interfere with each other.
- Durability Once committed, data changes persist even if the system crashes.

### Why This Decision:

- Dealing with multi-step operations (e.g., creating a group chat, its members, and its first message).
- Avoid partial writes that could leave the system in an inconsistent state.
- Need reliability, especially for chat where real-time experience and integrity matter.

## Why You Use Jest with Mocking and Layered Test Organization

You chose Jest because it's a powerful, easy-to-use testing framework that:

- Requires minimal setup
- Supports mocking out of the box
- Provides fast test execution with clear output

### Organizing Tests by Layer (controller, service, middleware, etc.)

You separated tests by layer to reflect your clean architecture, making each layer independently testable and maintainable.

## Why Use a Docker Compose File for Deployment

- Multi-Service Management is Easy
  - BACKEND (API logic)
  - Frontend (UI)
  - RTC -Real Time communciation (Socket.io)
  - postgres (databse)

Instead of running each container manually, Docker Compose allows you to define and spin them up with a single command (docker-compose up).

and also all services, networks, volumes, ports, and environment variables in one docker-compose.yml file. This centralization:

# Additional Info

## Repository Generator Tool

To automate boilerplate and enforce consistent architecture in your Node.js project, this tool generates a standardized Repository class for any Sequelize model.

just run this and the repsoitory class with basic CRED oepration will be created

```
make repository MODEL=UserProfile

```

### Benefits

- Saves time
- Enahnce Consistency
- Apply the DRY Principle

## Makefile

The Makefile is a developer productivity tool that provides a simple interface to manage the full lifecycle of your app and environment reliably and efficiently.

### What problems are you solving?

- Complex, repetitive Docker commands — simplified.
- Manual migration management — automated and error-resistant.
- Development task fragmentation — centralized in one place.
- Inconsistent workflow across devs/environments — standardized commands.
- Fast developer onboarding — by providing simple, consistent commands to run common tasks, new team members can quickly get up and running without memorizing complex Docker or migration commands
- Avoiding typos and command mistakes — single trusted commands.
- Better control over logs and test running without remembering Docker exec syntax.

## Hskey

It is a tool that helps automate and enforce Git hooks (scripts that run at specific points in the Git lifecycle, like before a commit or push). Its main responsibility is to

### Benefits

- Prevent bad code from entering the repository by running checks (like linting, tests, formatting) automatically before commits or pushes.
- Enforce code quality and consistency by making sure pre-commit or pre-push hooks run reliably across all developers’ machines.
- Improve developer workflow by catching errors early, which reduces broken builds or code review feedback later on.
- Integrate seamlessly with Git, triggering tasks such as running ESLint, Prettier, tests, or commit message validation automatically.
