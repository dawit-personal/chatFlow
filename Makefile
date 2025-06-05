.PHONY: up build down migrate-up migrate-down logs logs-top100 test fresh-db

# Default target: bring up the services and build if necessary
# Usage: make up
#    or: make
up:
	@echo "Starting Docker services and building if necessary..."
	docker compose up --build -d 

# Alias for up, also builds
# Usage: make build
build: up

# Bring down the services
# Usage: make down
down:
	@echo "Stopping Docker services..."
	docker compose down

# Clean up volumes
# Usage: make volume-clean
volume-clean:
	@echo "Cleaning up volumes..."
	docker compose down -v

# Run all pending database migrations
# Usage: make migrate-up
migrate-up:
	@echo "Running database migrations up..."
	docker compose exec backend npx sequelize-cli db:migrate
	@echo "Migrations up completed."

# Rollback the last database migration
# Usage: make migrate-down
migrate-down:
	@echo "Rolling back the last database migration..."
	docker compose exec backend npx sequelize-cli db:migrate:undo
	@echo "Migration rollback completed."

# Usage: make migrate-down-step N=2 ( rollback 2 migrations) - addint it hear future as equelize-cli@^7 does not exist on the public NPM registry yet
migrate-down-step:
	@echo "Rolling back $(N) migrations..."
	docker compose exec backend npx sequelize-cli db:migrate:undo --step $(N)
	@echo "Rolled back $(N) migrations."

# Run application tests
# Usage: make test
test:
	@echo "Running application tests..."
	docker compose exec backend npm test
	@echo "Tests completed."

# View logs for the app service (and other services if specified), follows new logs.
# Usage: make logs
# Usage: make logs SERVICE=backend # or SERVICE=postgres if you name your db service postgres
logs:
	@echo "Tailing logs (last 100 lines)..."
	docker compose logs -f --tail="100" $(SERVICE)

# View the last 100 log lines for the app service (and other services if specified).
# Usage: make logs-top100
# Usage: make logs-top100 SERVICE=backend # or SERVICE=postgres if you name your db service postgres
logs-top100:
	@echo "Showing last 100 log lines..."
	docker compose logs --tail="100" $(SERVICE)

# Generate a repository class file for the given model name.
# Usage: make repository MODEL=UserProfile
# This runs a Node.js script that creates the repository file (e.g., userProfile.repository.js)
# inside the repositories directory with basic CRUD methods scaffolded.
repository:
	@echo "Generating repository for model: $(MODEL)..."
	node tools/createRepository.js $(MODEL)

# Install a regular dependency (pass the package name as: make docker-npm-install PACKAGE=your-package)
docker-npm-install:
	docker compose exec backend npm install $(PACKAGE)


# Usage:
# Makefile for common git commands
#
# Usage:
#   make commit m="your commit message"
#
# Example:
#   make commit m="fix: add CORS middleware for frontend requests"
#
# This will:
#   1. Check if a commit message (-m) is provided, else exit with error.
#   2. Prompt you if you want to add a detailed multiline description.
#      - If yes, enter the description (finish input with Ctrl+D).
#      - If no, it will use only the commit message.
#   3. Add all changes (git add .)
#   4. Commit them with the full commit message.
#   5. Enable Husky debugging via HUSKY_DEBUG=1 environment variable.

commit:
	@if [ -z "$(m)" ]; then \
		echo "❌ Error: Please provide a commit message using make commit m=\"your message\""; \
		exit 1; \
	fi; \
	echo "Do you want to add a detailed description to the commit message? (y/n)"; \
	read add_desc; \
	if [ "$$add_desc" = "y" ] || [ "$$add_desc" = "Y" ]; then \
		echo "Enter your detailed description (end with Ctrl+D):"; \
		desc=$$(cat); \
		full_msg="$(m)$$'\n\n'$$desc"; \
	else \
		full_msg="$(m)"; \
	fi; \
	HUSKY_DEBUG=1 git add . && git commit -m "$$full_msg"


# To make `make logs` and `make logs-top100` work without specifying SERVICE, define a default
SERVICE := backend 