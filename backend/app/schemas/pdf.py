from pydantic import BaseModel

class PdfUploadResponse(BaseModel):
    """Response model for PDF upload endpoint."""
    message: str
    image_count: int
    filename: str | None = None

class ErrorResponse(BaseModel):
    """Generic error response model."""
    detail: str

class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    version: str 