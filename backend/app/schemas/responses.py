from pydantic import BaseModel

class HealthCheck(BaseModel):
    status: str

class ErrorResponse(BaseModel):
    detail: str 