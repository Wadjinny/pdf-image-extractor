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
poetry install || handle_error "Failed to install backend dependencies"

# Start development server
echo "Starting backend development server..."
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 