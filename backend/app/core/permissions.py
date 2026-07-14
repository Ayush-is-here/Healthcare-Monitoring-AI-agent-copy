from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import User
from app.models.enum import UserRole

def require_roles(*allowed_roles: UserRole) -> User:

    def verify_role(
    current_user: User = Depends(get_current_user),
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource."
            )
        
        return current_user
    
    return verify_role