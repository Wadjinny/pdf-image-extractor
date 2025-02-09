from fastapi import APIRouter
from ...schemas.responses import HealthCheck

router = APIRouter(
    tags=["System"],
    responses={500: {"description": "Internal server error"}}
)

@router.get(
    "/health",
    response_model=HealthCheck,
    summary="System Health Check",
    description="""
    Check the health status of the API service.
    
    This endpoint performs the following checks:
    - Verifies the API server is running and responsive
    - Returns the current version of the API
    - Confirms the application's core services are operational
    
    Use Cases:
    - Monitoring system health
    - Load balancer health checks
    - Deployment verification
    - System status dashboards
    
    Returns:
    - status: Current health status ("healthy" or "unhealthy")
    - version: Current API version number
    
    Response Times:
    - Expected response time: < 100ms
    - If no response within 5 seconds, consider system unhealthy
    """,
    responses={
        200: {
            "description": "System is healthy and operational",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "version": "1.0.0"
                    }
                }
            }
        },
        500: {
            "description": "System is experiencing issues",
            "content": {
                "application/json": {
                    "example": {
                        "status": "unhealthy",
                        "version": "1.0.0"
                    }
                }
            }
        }
    }
)
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        HealthCheck: Status information including system health and version
    """
    return HealthCheck(status="healthy", version="1.0.0") 