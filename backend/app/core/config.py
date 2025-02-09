from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    api_v1_str: str = "/api/v1"
    project_name: str = "PDF Image Extractor"
    version: str = "1.0.0"
    
    # CORS Settings
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",
    ]
    
    # File Upload Settings
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = [".pdf"]
    
    # Storage Settings
    temp_dir: str = "/tmp/pdf-extractor"
    
    class Config:
        case_sensitive = False
        env_file = ".env"
        extra = "allow"  # Allow extra fields from environment variables

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

settings = get_settings() 