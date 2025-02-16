import fitz
from typing import BinaryIO, Tuple, List
import io
import zipfile
from datetime import datetime
import os
from pathlib import Path
from uuid import uuid4
from PIL import Image
from fastapi import UploadFile, HTTPException

from ..core.logger import logger, log_error
from ..core.errors import PDFProcessingError, NoImagesFoundError, InvalidPDFError
from ..core.config import settings

class PdfService:
    @staticmethod
    def ensure_temp_dirs():
        """Ensure temporary directories exist"""
        Path(settings.temp_dir).joinpath("images").mkdir(parents=True, exist_ok=True)
    
    @staticmethod
    async def cleanup_old_images():
        """Clean up images older than the configured retention period"""
        # TODO: Implement cleanup of old images
        pass

    @staticmethod
    async def extract_images(file: UploadFile) -> Tuple[bytes, int, List[str]]:
        """
        Extract images from a PDF file, save them to disk, and return their IDs
        Returns:
            tuple: (ZIP file bytes, number of images, list of image IDs)
        """
        try:
            PdfService.ensure_temp_dirs()
            content = await file.read()
            pdf_document = fitz.open(stream=content, filetype="pdf")
            
            # Create a unique ID for this PDF
            pdf_id = str(uuid4())
            pdf_dir = Path(settings.temp_dir).joinpath("images", pdf_id)
            pdf_dir.mkdir(exist_ok=True)
            
            # Create a ZIP file in memory
            zip_buffer = io.BytesIO()
            image_ids = []
            
            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                image_count = 0
                
                for page_num in range(pdf_document.page_count):
                    page = pdf_document[page_num]
                    image_list = page.get_images()
                    
                    for img_index, img in enumerate(image_list):
                        xref = img[0]
                        base_image = pdf_document.extract_image(xref)
                        image_bytes = base_image["image"]
                        
                        # Convert to PIL Image for potential processing
                        image = Image.open(io.BytesIO(image_bytes))
                        
                        # Generate unique filename
                        image_filename = f"page_{page_num + 1}_image_{img_index + 1}.{image.format.lower() if image.format else 'png'}"
                        image_path = pdf_dir.joinpath(image_filename)
                        
                        # Save image to disk
                        image.save(image_path, format=image.format or 'PNG')
                        image_ids.append(f"{pdf_id}/{image_filename}")
                        
                        # Also add to ZIP
                        img_buffer = io.BytesIO()
                        image.save(img_buffer, format=image.format or 'PNG')
                        img_buffer.seek(0)
                        zip_file.writestr(image_filename, img_buffer.getvalue())
                        image_count += 1
                        
            zip_buffer.seek(0)
            return zip_buffer.getvalue(), image_count, image_ids
            
        except Exception as e:
            # Clean up on error
            if 'pdf_dir' in locals() and pdf_dir.exists():
                import shutil
                shutil.rmtree(pdf_dir)
            raise HTTPException(
                status_code=500,
                detail=f"Error processing PDF: {str(e)}"
            )
        finally:
            if 'pdf_document' in locals():
                pdf_document.close()
            await file.seek(0)  # Reset file pointer for potential reuse

    @staticmethod
    async def extract_images_from_pdfs(files: list[BinaryIO]) -> tuple[bytes, int]:
        """
        Extract images from multiple PDF files and return them as a ZIP file.
        
        Args:
            files: List of file-like objects containing PDF data
            
        Returns:
            tuple: (ZIP file as bytes, number of images extracted)
            
        Raises:
            PDFProcessingError: If there's an error processing the PDF
            NoImagesFoundError: If no images are found in any PDF
            InvalidPDFError: If a PDF file is invalid or corrupted
        """
        zip_buffer = io.BytesIO()
        total_images = 0
        
        try:
            with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
                for pdf_file in files:
                    try:
                        pdf_content = await pdf_file.read()
                        pdf_stream = io.BytesIO(pdf_content)
                        
                        try:
                            doc = fitz.open(stream=pdf_stream, filetype="pdf")
                        except Exception as e:
                            logger.error(f"Error opening PDF {pdf_file.filename}: {str(e)}")
                            raise InvalidPDFError(f"Could not open file: {str(e)}") from e
                        
                        file_images = 0
                        seen_xrefs = set()
                        
                        for page_num, page in enumerate(doc, 1):
                            for img in page.get_images():
                                xref = img[0]
                                if xref not in seen_xrefs:
                                    seen_xrefs.add(xref)
                                    try:
                                        base_image = doc.extract_image(xref)
                                        image_data = base_image["image"]
                                        ext = base_image["ext"]
                                        
                                        filename = f"{pdf_file.filename}_page{page_num}_img{file_images + 1}.{ext}"
                                        zip_file.writestr(filename, image_data)
                                        file_images += 1
                                        total_images += 1
                                    except Exception as e:
                                        log_error(e, {
                                            "pdf_file": pdf_file.filename,
                                            "page": page_num,
                                            "xref": xref
                                        })
                                        continue
                        
                        doc.close()
                        logger.info(f"Processed {pdf_file.filename}: found {file_images} images")
                        
                    except InvalidPDFError:
                        raise
                    except Exception as e:
                        raise PDFProcessingError(str(e), pdf_file.filename) from e
            
            if total_images == 0:
                raise NoImagesFoundError("No images found in any of the provided PDFs")
            
            zip_buffer.seek(0)
            return zip_buffer.getvalue(), total_images
            
        except (NoImagesFoundError, InvalidPDFError, PDFProcessingError):
            raise
        except Exception as e:
            log_error(e, {"context": "zip_creation"})
            raise PDFProcessingError("Failed to create ZIP file") from e

    @staticmethod
    async def combine_zip_files(zip_data_list: list[bytes]) -> bytes:
        """
        Combine multiple ZIP files into a single ZIP file.
        
        Args:
            zip_data_list: List of ZIP files as bytes
            
        Returns:
            bytes: Combined ZIP file
        """
        output_buffer = io.BytesIO()
        
        with zipfile.ZipFile(output_buffer, 'w') as output_zip:
            for index, zip_data in enumerate(zip_data_list):
                with zipfile.ZipFile(io.BytesIO(zip_data)) as input_zip:
                    for filename in input_zip.namelist():
                        # Add prefix to avoid filename conflicts
                        new_filename = f"pdf_{index + 1}/{filename}"
                        output_zip.writestr(new_filename, input_zip.read(filename))
        
        output_buffer.seek(0)
        return output_buffer.getvalue() 