import logging
import sys
from typing import Any, Dict, Optional
from pathlib import Path
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

from .config import settings

# Create logs directory if it doesn't exist
log_dir = Path(settings.temp_dir) / "logs"
log_dir.mkdir(parents=True, exist_ok=True)

# Configure logging format
class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging."""
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add extra fields if available
        if hasattr(record, "extra"):
            log_data["extra"] = record.extra
            
        return json.dumps(log_data)

def setup_logger(name: str) -> logging.Logger:
    """Set up a logger with both file and console handlers."""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())
    logger.addHandler(console_handler)
    
    # File handler
    file_handler = RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(JSONFormatter())
    logger.addHandler(file_handler)
    
    return logger

# Create main logger
logger = setup_logger("pdf_extractor")

def log_info(message: str, extra: Optional[Dict[str, Any]] = None) -> None:
    """Log an info message with optional extra data."""
    logger.info(message, extra={"extra": extra} if extra else None)

def log_error(error: Exception, extra: Optional[Dict[str, Any]] = None) -> None:
    """Log an error with optional extra data."""
    error_data = {
        "error_type": type(error).__name__,
        "error_message": str(error),
        **(extra or {})
    }
    logger.error(str(error), extra={"extra": error_data}) 