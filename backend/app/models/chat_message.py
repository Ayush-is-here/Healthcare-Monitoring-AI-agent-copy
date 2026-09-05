from sqlalchemy import Index
from app.database.base import Base

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, Enum, Text

import uuid

from app.models.enum import ChatRole

from datetime import datetime





class ChatMessage(Base):

    __tablename__= "chat_messages"

    __table_args__ = (
    Index("ix_chat_messages_user_created", "user_id", "created_at"),
)

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    role: Mapped[ChatRole] = mapped_column(
        Enum(ChatRole),
        nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        nullable=False
    )
    