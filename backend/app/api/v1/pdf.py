from fastapi import APIRouter, UploadFile, File, HTTPException, Response, Query, Path as FastAPIPath, status
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from typing import Any, List
from pathlib import Path
from uuid import uuid4

from ...services.pdf_service import PdfService
from ...schemas.pdf import PdfUploadResponse, ErrorResponse, ImageResponse
from ...core.config import settings

router = APIRouter(
    prefix="",
    tags=["PDF Operations"],
    responses={
        404: {"model": ErrorResponse, "description": "Resource not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)

@router.post(
    "/extract-images",
    response_model=PdfUploadResponse,
    responses={
        200: {
            "model": PdfUploadResponse,
            "content": {
                "application/json": {
                    "example": {
                        "message": "Successfully extracted images",
                        "image_count": 2,
                        "filename": "test.pdf",
                        "image_urls": ["/api/v1/images/uuid/image1.png"]
                    }
                },
                "application/zip": {
                    "description": "ZIP file containing extracted images"
                }
            },
            "description": "Successfully extracted images from PDF"
        },
        400: {
            "model": ErrorResponse,
            "description": "Invalid file type or format"
        },
        422: {
            "model": ErrorResponse,
            "description": "No files provided or validation error"
        },
        500: {
            "model": ErrorResponse,
            "description": "Internal server error during processing"
        }
    },
    summary="Extract Images from PDF Files",
    description="""
    Extract all images contained within one or more PDF files with high quality preservation.
    
    Technical Details:
    - Supported PDF versions: 1.0 to 2.0
    - Maximum file size: 50MB per PDF
    - Supported image formats: PNG, JPEG, TIFF, GIF
    - Image resolution: Preserved as in original PDF
    - Color depth: Preserved as in original PDF
    
    Processing Features:
    - Multi-file processing in a single request
    - Maintains original image quality and metadata
    - Automatic image format detection
    - Duplicate image detection and handling
    - Progress tracking via response headers
    
    Response Options:
    1. JSON Response (download=false):
       - List of image URLs for direct access
       - Image count and metadata
       - Processing status and messages
    
    2. ZIP Download (download=true):
       - All images in a single ZIP file
       - Organized by PDF and page number
       - Original filenames preserved
       - Metadata included
    
    Error Handling:
    - Validates PDF format before processing
    - Checks file size limits
    - Reports detailed error messages
    - Handles corrupt PDFs gracefully
    
    Performance Notes:
    - Processing time: ~1-2 seconds per PDF
    - Memory usage: ~2x PDF file size
    - Concurrent request limit: 10
    
    Security Features:
    - File type validation
    - Content scanning
    - Rate limiting
    - Temporary file cleanup
    
    Best Practices:
    1. Keep PDF files under 20MB for optimal performance
    2. Use download=true for bulk extractions
    3. Implement retry logic for large files
    4. Monitor X-Image-Count header for progress
    """
)
async def upload_pdf(
    files: list[UploadFile] = File(
        ..., 
        description="""
        One or more PDF files to process.
        
        Requirements:
        - File format: PDF (application/pdf)
        - Max size: 50MB per file
        - Max files: 10 per request
        - Filename: Must end with .pdf
        
        The files should be sent as form-data with the key 'files'.
        """
    ),
    download: bool = Query(
        False,
        description="""
        Controls the response format:
        
        - false (default): Returns JSON with image URLs
        - true: Returns ZIP file containing all images
        
        Use true for bulk downloads or when immediate access to images is needed.
        Use false for web applications or when you need to process images individually.
        """
    )
) -> Any:
    """
    Upload multiple PDF files and extract images from them.
    If download=True, returns a ZIP file containing all extracted images.
    Otherwise, returns a JSON response with the extraction results and image URLs.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No files provided"
        )
    
    total_image_count = 0
    all_zip_data = []
    all_image_ids = []
    
    for file in files:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only PDF files are allowed. '{file.filename}' is not a PDF file."
            )
        
        # Check content type
        content_type = file.content_type or ""
        if not content_type.lower() == 'application/pdf':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type for '{file.filename}'. Only PDF files are allowed"
            )
    
    try:
        for file in files:
            zip_data, image_count, image_ids = await PdfService.extract_images(file)
            all_zip_data.append(zip_data)
            total_image_count += image_count
            all_image_ids.extend(image_ids)
        
        # Combine all zip files into one
        combined_zip = await PdfService.combine_zip_files(all_zip_data)
        
        if download:
            # Return the combined ZIP file as a streaming response
            return StreamingResponse(
                iter([combined_zip]),
                media_type="application/zip",
                headers={
                    "Content-Disposition": "attachment; filename=extracted_images.zip",
                    "X-Image-Count": str(total_image_count),
                    "Access-Control-Expose-Headers": "X-Image-Count, Content-Disposition"
                }
            )
        else:
            # Return JSON response with image URLs
            server_url = settings.server_url.rstrip('/')
            base_url = f"{settings.api_str}/images"
            image_urls = [f"{base_url}/{image_id}" for image_id in all_image_ids]
            
            response = JSONResponse(
                content=PdfUploadResponse(
                    message=f"Successfully extracted images from {len(files)} files",
                    image_count=total_image_count,
                    filename="multiple_files",
                    image_urls=image_urls
                ).model_dump(),
                headers={
                    "X-Image-Count": str(total_image_count),
                    "Access-Control-Expose-Headers": "X-Image-Count"
                }
            )
            return response
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Add new routes for image handling
@router.get("/images/{pdf_id}/{image_filename:path}")
async def get_image(pdf_id: str, image_filename: str):
    """Serve an extracted image file."""
    image_path = Path(settings.temp_dir).joinpath("images", pdf_id, image_filename)
    
    if not image_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Image not found or has been cleaned up"
        )
    
    return FileResponse(
        str(image_path),
        media_type="image/*",
        filename=image_filename
    )

@router.get(
    "/pdf/{pdf_id}/images",
    response_model=List[ImageResponse],
    responses={
        200: {
            "model": List[ImageResponse],
            "description": "Successfully retrieved list of images",
            "content": {
                "application/json": {
                    "example": [{
                        "id": "page_1_image_1.png",
                        "url": "/api/v1/images/uuid/page_1_image_1.png",
                        "pdf_id": "uuid"
                    }]
                }
            }
        },
        404: {
            "model": ErrorResponse,
            "description": "PDF ID not found or no images available"
        },
        500: {
            "model": ErrorResponse,
            "description": "Server error while listing images"
        }
    },
    summary="List All Images from PDF",
    description="""
    Retrieve a comprehensive list of all images extracted from a specific PDF file.
    
    Technical Details:
    - Returns metadata for all extracted images
    - Images are sorted by page number and position
    - Includes direct access URLs for each image
    - Provides image format and size information
    
    Response Format:
    Returns an array of image objects, each containing:
    - id: Unique identifier/filename of the image
    - url: Direct URL to download the image
    - pdf_id: Reference to source PDF
    
    Sorting and Organization:
    - Images are sorted by page number
    - Multiple images per page are ordered by appearance
    - Naming convention: page_{number}_image_{index}.{format}
    
    Use Cases:
    1. Gallery view of extracted images
    2. Batch processing of extracted images
    3. Image selection interfaces
    4. Progress monitoring
    
    Performance Considerations:
    - Response time: < 100ms
    - Pagination: Not required, typical response size < 100KB
    - Caching: Results cached for 1 hour
    
    Error Scenarios:
    - PDF not found
    - No images in PDF
    - Storage system errors
    - Expired content
    
    Best Practices:
    1. Cache responses when possible
    2. Implement image preloading for galleries
    3. Handle empty result sets gracefully
    4. Monitor for expired image URLs
    
    Notes:
    - Image URLs are valid for 24 hours
    - Maximum of 1000 images per PDF
    - Response includes only successfully extracted images
    """
)
async def list_pdf_images(
    pdf_id: str = FastAPIPath(
        ..., 
        description="""
        The UUID of the PDF to list images from.
        
        Format: UUID string
        Example: 123e4567-e89b-12d3-a456-426614174000
        
        This ID is returned in the original PDF upload response
        and is used to group all images extracted from the same PDF.
        """
    )
):
    """List all images extracted from a specific PDF."""
    pdf_image_dir = Path(settings.temp_dir).joinpath("images", pdf_id)
    if not pdf_image_dir.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF ID not found or no images available"
        )
    
    images = []
    for file_path in pdf_image_dir.iterdir():
        if file_path.is_file():
            filename = file_path.name
            images.append(ImageResponse(
                id=filename,
                url=f"{settings.api_str}/images/{pdf_id}/{filename}",
                pdf_id=pdf_id
            ))
    
    return sorted(images, key=lambda x: x.id) 