from typing import List, Union
from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
import json
import os


def parse_json_string(value: Union[str, list]) -> List[str]:
    """Parse a JSON string into a list, with error handling."""
    if isinstance(value, list):
        return value
    if not value:
        return []
    
    # Remove any surrounding quotes
    value = value.strip('"\'')
    
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        # If JSON parsing fails, try splitting by comma
        return [item.strip().strip('"\'') for item in value.strip('[]').split(',')]


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    api_str: str = "/api"
    project_name: str = "PDF Image Extractor"
    version: str = "1.0.0"
    api_port: int = 8000
    
    # CORS Settings
    backend_cors_origins: List[str] = ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"]
    
    # File Upload Settings
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = [".pdf"]
    
    # Storage Settings
    temp_dir: str = str(Path(__file__).parent.parent.parent / "tmp" / "pdf-extractor")
    
    @property
    def cors_origins(self) -> List[str]:
        """Get the CORS origins as a list."""
        if isinstance(self.backend_cors_origins, list):
            return self.backend_cors_origins
        return parse_json_string(self.backend_cors_origins)
    
    @property
    def server_url(self) -> str:
        # Use environment port or default to api_port
        port = int(os.getenv("PORT", str(self.api_port)))
        return f"http://localhost:{port}"
    
    class Config:
        case_sensitive = False
        env_file = ".env"
        extra = "allow"

        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str) -> any:
            if field_name in ["allowed_extensions", "backend_cors_origins"]:
                return parse_json_string(raw_val)
            return raw_val


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings() 