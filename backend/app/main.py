from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from .core.config import settings
from .api.v1 import health, pdf

app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_str}/openapi.json",
    docs_url=f"{settings.api_v1_str}/docs",
    redoc_url=f"{settings.api_v1_str}/redoc",
    version=settings.version,
    description="API for extracting images from PDF files"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Image-Count"]  # Add X-Image-Count to exposed headers
)

# Include routers
app.include_router(health.router, prefix=settings.api_v1_str, tags=["health"])
app.include_router(pdf.router, prefix=settings.api_v1_str, tags=["pdf"]) 