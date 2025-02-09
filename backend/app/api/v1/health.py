from fastapi import APIRouter
from ...schemas.responses import HealthCheck

router = APIRouter()

@router.get(
    "/health",
    response_model=HealthCheck,
    description="Health check endpoint"
)
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        HealthCheck: Status information
    """
    return HealthCheck(status="healthy") 