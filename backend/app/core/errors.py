from typing import Optional, Dict, Any
from fastapi import HTTPException, status

class BaseAppException(Exception):
    """Base exception class for application errors."""
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        extra: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.extra = extra or {}
        super().__init__(message)

class PDFProcessingError(BaseAppException):
    """Raised when there's an error processing a PDF file."""
    def __init__(self, message: str, filename: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            extra={"filename": filename} if filename else None
        )

class NoImagesFoundError(BaseAppException):
    """Raised when no images are found in a PDF."""
    def __init__(self, message: str = "No images found in the PDF"):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND
        )

class InvalidPDFError(BaseAppException):
    """Raised when a PDF file is invalid or corrupted."""
    def __init__(self, message: str = "Invalid or corrupted PDF file"):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST
        )

class FileSizeError(BaseAppException):
    """Raised when a file exceeds the maximum allowed size."""
    def __init__(self, max_size: int):
        super().__init__(
            message=f"File size exceeds maximum allowed size of {max_size/1024/1024:.1f}MB",
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            extra={"max_size": max_size}
        )

def handle_app_error(error: Exception) -> HTTPException:
    """Convert application exceptions to FastAPI HTTP exceptions."""
    if isinstance(error, BaseAppException):
        return HTTPException(
            status_code=error.status_code,
            detail={"message": error.message, "extra": error.extra}
        )
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={"message": str(error)}
    ) 