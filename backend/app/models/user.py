from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, String, Enum
import uuid 
from app.models.enum import UserRole
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(254),
        nullable=False,
        unique=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.PATIENT,
        nullable=False
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        default= datetime.now,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        default= datetime.now,
        onupdate=datetime.now,
        nullable=False
    )