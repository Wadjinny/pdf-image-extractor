from typing import List
from pydantic import BaseModel, ConfigDict

class PdfUploadResponse(BaseModel):
    """Response model for PDF upload endpoint."""
    message: str
    image_count: int
    filename: str
    image_urls: List[str] = []
    
    model_config = ConfigDict(from_attributes=True)

class ErrorResponse(BaseModel):
    """Generic error response model."""
    detail: str
    
    model_config = ConfigDict(from_attributes=True)

class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    version: str
    
    model_config = ConfigDict(from_attributes=True)

class ImageResponse(BaseModel):
    """Image response model."""
    id: str
    url: str
    pdf_id: str
    
    model_config = ConfigDict(from_attributes=True) 