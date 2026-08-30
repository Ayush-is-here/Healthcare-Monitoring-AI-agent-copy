import uuid
from fastapi import Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from app.core.config import settings
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from app.database.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated = "auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login"
)

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, stored_hash):
    return pwd_context.verify(password, stored_hash)

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    to_encode.update({"exp":int(expire.timestamp())})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.jwt_algorithm
    )

    return encoded_jwt

def get_current_user(token:str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("Iam inside get current user")
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        user_id_str = payload.get("sub")

        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    
        user_id = uuid.UUID(user_id_str)

    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not validate credentials")
    

    query = select(User).where(User.id== user_id)
    result = db.execute(query)
    current_user = result.scalar_one_or_none()

    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
            )
    
    return current_user