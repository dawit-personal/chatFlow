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