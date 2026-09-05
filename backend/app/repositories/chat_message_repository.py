from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.enum import ChatRole
from app.models.chat_message import ChatMessage



class ChatMessageRepository:

    @staticmethod
    def add(
        db: Session,
        user_id: UUID,
        role: ChatRole,
        content: str
    ) -> ChatMessage:

        chat_message = ChatMessage(
            user_id=user_id,
            role=role,
            content=content
        )

        db.add(chat_message)
        db.commit()
        db.refresh(chat_message)

        return chat_message

    @staticmethod
    def list_recent(
            db: Session,
            user_id: UUID,
            limit: int
    ) -> list[ChatMessage]:

        rows = db.scalars(
            select(ChatMessage).
            where(ChatMessage.user_id==user_id).
            order_by(ChatMessage.created_at.desc()).
            limit(limit)
        ).all()

        return list(reversed(rows))