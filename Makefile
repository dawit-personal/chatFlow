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

# Usage:
# make migrate-create name="create-chats"
migrate-create:
	@if [ -z "$(name)" ]; then \
		echo "❌ Please provide a name: make migrate-create name=YourMigrationName"; \
	else \
		cd backend && npx sequelize-cli migration:generate --name $(name) --migrations-path db/migrations; \
	fi

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
	node backend/tools/createRepository.js $(MODEL)

# Install a regular dependency (pass the package name as: make docker-npm-install PACKAGE=your-package)
docker-npm-install:
	docker compose exec backend npm install $(PACKAGE)

# Usage:
# make branch         → Prompts for branch name and creates it
branch:
	@read -p "Enter new branch name: " branch_name; \
	git checkout -b $$branch_name

# Usage:
# Run `make add` to stage all changes (equivalent to `git add .`)

add:
	git add .

# Usage:
#  make commit m="commit message" [d="detailed description"]
commit:
	@if [ -z "$(m)" ]; then \
		echo "❌ Please provide commit message: make commit m=\"message\""; \
		exit 1; \
	fi; \
	printf "%s\n" "$(m)" > /tmp/commitmsg.txt; \
	HUSKY_DEBUG=1 git commit -F /tmp/commitmsg.txt; \
	rm /tmp/commitmsg.txt

# Makefile

# Usage:
# Run `make rebase` to fetch and rebase the latest changes from origin/main.
# This helps keep a clean, linear commit history by avoiding unnecessary merge commits.
rebase:
	@echo "Pulling latest changes from origin/main with rebase..."
	git pull --rebase origin main

# Usage:
# Run `make push` to push the latest changes to the remote.
push:
	@echo "Pushing to the remote..."
	git push 

# Usage:
# Run `make check-kill-port` to:
# 1. Display which of the common ports (4000, 5000, 5173) are in use
# 2. Prompt you to choose one of them
# 3. Kill the process using that port, if any

check-kill-port:
	@echo "🔍 Checking port usage..."
	@for port in 4000 5000 5173; do \
		echo "\n🔎 Port $$port:"; \
		if lsof -i :$$port > /dev/null; then \
			lsof -i :$$port; \
		else \
			echo "✅ Port $$port is free."; \
		fi; \
	done; \
	echo "\nWhich port do you want to kill?"; \
	echo "1) 4000"; \
	echo "2) 5000"; \
	echo "3) 5173"; \
	read -p "Enter option number (1-3): " option; \
	case $$option in \
		1) port=4000 ;; \
		2) port=5000 ;; \
		3) port=5173 ;; \
		*) echo "❌ Invalid option"; exit 1 ;; \
	esac; \
	echo "🔪 Killing processes on port $$port..."; \
	pids=`lsof -ti :$$port`; \
	if [ -z "$$pids" ]; then \
		echo "✅ No processes found using port $$port."; \
	else \
		echo "Found process IDs: $$pids"; \
		kill -9 $$pids; \
		echo "✅ Killed processes on port $$port."; \
	fi


	
# To make `make logs` and `make logs-top100` work without specifying SERVICE, define a default
SERVICE := backend 