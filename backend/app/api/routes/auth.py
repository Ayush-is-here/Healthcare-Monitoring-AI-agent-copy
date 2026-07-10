from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserResponse
from app.database.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from sqlalchemy import select
from app.core.security import hash_password


router = APIRouter()

@router.post("/register",
             response_model= UserResponse,
             status_code=status.HTTP_201_CREATED
             )
def register(user: UserCreate, db: Session = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code = status.HTTP_409_CONFLICT,
            detail="A user with this email already exists."
        )
    
    hashed_password = hash_password(user.password)

    new_user = User(
        name = user.name,
        email = user.email,
        password_hash = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user