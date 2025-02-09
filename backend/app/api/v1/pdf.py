from fastapi import APIRouter, UploadFile, File, HTTPException, Response, Query, status
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Any

from ...services.pdf_service import PdfService
from ...schemas.pdf import PdfUploadResponse, ErrorResponse
from ...core.config import settings

router = APIRouter()

@router.post(
    "/extract-images",
    responses={
        200: {
            "content": {
                "application/json": {
                    "model": PdfUploadResponse
                },
                "application/zip": {
                    "description": "ZIP file containing extracted images"
                }
            },
            "description": "Successful Response"
        },
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def upload_pdf(
    files: list[UploadFile] = File(..., description="PDF files to extract images from"),
    download: bool = Query(False, description="Whether to download the ZIP file directly")
) -> Any:
    """
    Upload multiple PDF files and extract images from them.
    If download=True, returns a ZIP file containing all extracted images.
    Otherwise, returns a JSON response with the extraction results.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No files provided"
        )
    
    total_image_count = 0
    all_zip_data = []
    
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
            zip_data, image_count = await PdfService.extract_images(file)
            all_zip_data.append(zip_data)
            total_image_count += image_count
        
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
            # Return JSON response with headers
            response = JSONResponse(
                content=PdfUploadResponse(
                    message=f"Successfully extracted images from {len(files)} files",
                    image_count=total_image_count,
                    filename="multiple_files"
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