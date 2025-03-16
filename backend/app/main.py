from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .core.config import settings
from .api.v1 import health, pdf


# Get frontend URL from environment variable, default to http://localhost:5173 for development
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")

app = FastAPI(
    title=settings.project_name,
    description="API for extracting images from PDF files"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Image-Count"]  # Add X-Image-Count to exposed headers
)

# Include routers
app.include_router(health.router, prefix=settings.api_str, tags=["health"])
app.include_router(pdf.router, prefix=settings.api_str, tags=["pdf"]) 