from sqlalchemy.orm import Session
from uuid import UUID
from app.models.user import User
from sqlalchemy import select


class UserRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: UUID
    ) -> User | None :
        
        return db.scalars(
            select(User).where(User.id == user_id)
        ).one_or_none()