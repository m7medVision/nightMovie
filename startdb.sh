#!/usr/bin/env bash

# Define database details (improve security by storing them elsewhere)
DB_NAME="next-payload-3"
DB_USER="payload"
DB_HOST="localhost"  # Assuming container runs on the same machine
DB_PASSWORD="password"  # Avoid using "password" in production

# Check for docker installation
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed. Please install docker and try again."
  echo "Docker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

# Check if container is already running
if docker ps -a --format '{{.Names}}' | grep -Eq "^${DB_NAME}$"; then
  docker stop "$DB_NAME" >/dev/null
  docker rm "$DB_NAME" >/dev/null
  echo "Existing container '$DB_NAME' was stopped and removed."
fi

# Build the connection string
CONNECTION_STRING="postgres://postgres:${DB_PASSWORD}@${DB_HOST}:5432/"

# Start the container with generated password
docker run --name "$DB_NAME" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -d -p 5432:5432 docker.io/postgres

echo "Database container '$DB_NAME' was successfully created."
echo "**Connection String:** $CONNECTION_STRING"  # Print the connection string

# (Optional) Consider storing the password securely (e.g., environment variables)


