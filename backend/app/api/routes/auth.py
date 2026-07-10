from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from app.database.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from sqlalchemy import select
from app.core.security import hash_password, verify_password
from app.core.security import create_access_token

router = APIRouter()

@router.post("/register",
             response_model= RegisterResponse,
             status_code=status.HTTP_201_CREATED
             )
def register(user: RegisterRequest, db: Session = Depends(get_db)):
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

@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest, db: Session = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email or password")
    
    is_valid = verify_password(user.password, existing_user.password_hash)

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email or password")
    
    access_token = create_access_token(data ={
        "sub": str(existing_user.id)
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }