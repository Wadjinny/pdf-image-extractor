#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if Poetry is installed
if ! command -v poetry >/dev/null 2>&1; then
    handle_error "Poetry is not installed. Please install Poetry first."
fi

# Navigate to backend directory
cd backend || handle_error "Backend directory not found"

# Clean and reinstall dependencies
echo "Cleaning poetry environment..."
poetry env remove --all 2>/dev/null || true

echo "Installing backend dependencies..."
poetry install --no-dev || handle_error "Failed to install backend dependencies"

# Start production server
echo "Starting backend production server..."
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers --forwarded-allow-ips='*' 