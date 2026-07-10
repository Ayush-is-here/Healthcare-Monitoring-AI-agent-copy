from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from app.models.enum import UserRole

class RegisterRequest(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

class RegisterResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str | None 
    role: UserRole

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str