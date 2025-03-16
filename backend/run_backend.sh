#!/bin/bash

#get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment
if [ "$ENV" = "prod" ]; then
    set -a
    source $SCRIPT_DIR/../.env.prod
    set +a
    RELOAD=""
    cd $SCRIPT_DIR
    echo "Starting backend in production mode"
    poetry run uvicorn app.main:app --host 0.0.0.0 --port $API_PORT
else
    set -a
    source $SCRIPT_DIR/../.env.dev
    set +a
    RELOAD="--reload"
    cd $SCRIPT_DIR
    echo "Starting backend in development mode"
    poetry run uvicorn app.main:app --host 0.0.0.0 --port $API_PORT --reload
fi
