from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from app.models.enum import UserRole

class UserCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str | None 
    role: UserRole