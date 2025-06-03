## Project Structure 

This project is structured to support a scalable Node.js backend application. Key features of the structure include:

*   **Layered Architecture:** Code is organized into layers for API handling (`src/api`), business logic (`src/services`), data access (`src/repositories`), and utilities (`src/utils`).
*   **Configuration:** Application configuration is managed in the `config/` directory and through environment variables (`.env`).
*   **Root Files:** Core startup (`server.js`), package management (`package.json`), and Docker configuration (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) are located in the project root.
*   **Modularity:** Distinct directories for `middlewares`, `sockets`, `db` (for database related files like migrations/seeds), and `tests` promote modular design.

##  🧱 Tech Stack

* Runtime: Node.js

* Framework: Express.js

* Database: PostgreSQL (via Sequelize ORM)

* Authentication: Bcrypt for password hashing

* Validation: Joi

* Containerization: Docker + Docker Compose

* Testing (planned): Jest / Supertest

* Realtime (planned): Socket.IO

## 🗂️ Project Structure

``` 
chatflow/
├── src/
│ ├── api/
│ │ ├── controllers/ # Route handlers (e.g., auth.controller.js)
│ │ └── routes/ # Express route definitions (e.g., auth.routes.js)
│ ├── services/ # Business logic (e.g., auth.service.js)
│ ├── repositories/ # Data access (e.g., user.repository.js)
│ ├── middlewares/ # Custom middleware (e.g., validation middleware)
│ └── utils/ # Helpers (e.g., password hashing)
├── db/
│ ├── models/ # Sequelize models
│ └── migrations/ # Sequelize migrations
├── config/ # Sequelize config (config.json)
├── Dockerfile # App container definition
├── docker-compose.yml # Multi-container orchestration
├── .env # Environment variables
└── README.md # Project documentation 
``` 

## Application Architecture

The application follows a layered architectural pattern to ensure separation of concerns and maintainability. The typical request lifecycle is as follows:

1.  **Route (`src/api/routes/`)**: Defines the API endpoints and HTTP methods. It receives the incoming request.
2.  **Middleware (`src/middlewares/` & `src/utils/validators.js`)**: Functions that process the request before it reaches the controller. This includes:
    *   Input validation (e.g., using Joi).
    *   Authentication and authorization checks (to be added).
    *   Logging, error handling, etc.
3.  **Controller (`src/api/controllers/`)**: Receives the validated request from the middleware. It parses the request (body, params, query), calls the appropriate service layer function to handle the business logic, and then formats and sends the HTTP response (data or error) back to the client.
4.  **Service (`src/services/`)**: Contains the core business logic of the application. It orchestrates operations, performs calculations, and interacts with the repository layer for data access. It's kept independent of the HTTP layer.
5.  **Repository (`src/repositories/`)**: Abstracts the data access logic. It's responsible for all direct interactions with the database (e.g., querying, creating, updating, deleting records). This layer allows the service layer to be independent of the specific database technology or ORM being used.
6.  **Database**: The persistent storage for the application. (Currently in-memory for `UserRepository`, with plans for PostgreSQL).

Here's a visual representation using a Mermaid diagram:

```mermaid
graph LR
    subgraph "Client Interaction"
        A[Client Request]
        H[Client Response]
    end
    subgraph "Application Core"
        B(Route)
        C(Middleware)
        D{Controller}
        E[Service]
        F[Repository]
    end
    subgraph "Data Layer"
        G[(Database)]
    end
    A --> B;
    B --> C;
    C --> D;
    D --> E;
    E --> F;
    F --> G;
    D --> H; // Controller sends response back to client
```
This diagram shows the request flowing from the client to the Route, through Middleware to the Controller. The Controller uses the Service, which in turn uses the Repository to interact with the Database. The Controller then sends a response back to the Client.

## 🚀 Node.js Backend Starter (Docker Dev Setup)

This is a Node.js backend project set up for local development using Docker and Docker Compose.

### 📦 Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js]()
- 
## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:dawit-personal/chatFlow.git
cd chatFlow
```

### 2. Create a .env File
```env
MY_PORT=3000
NODE_ENV=development
```

### 3. Start the App with Docker Compose

```
docker compose up --build
```

This will

* Build and start the Express server
* Set up the PostgreSQL database
* Run migrations automatically

## API Usage

* Register: POST /auth/register