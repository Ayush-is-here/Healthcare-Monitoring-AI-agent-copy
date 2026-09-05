from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.ai.health_context import HealthContext
from app.schemas.ai.chat import ChatResponse
from app.repositories.chat_message_repository import ChatMessageRepository
from app.models.enum import ChatRole
from app.services.ai.prompt.chat_prompt_builder import ChatPromptBuilder
from app.services.ai.prompt.chat_system_instruction import ChatSystemInstruction


class ChatService:

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
            ):

        self.ai_adapter = ai_adapter

    def chat(
      self,
      db: Session,
      user_id: UUID,
      health_context: HealthContext,
      message: str
    ) -> ChatResponse:

        message = message.strip()

        ChatMessageRepository.add(
            db=db,
            user_id=user_id,
            role=ChatRole.USER,
            content=message
        )

        history = ChatMessageRepository.list_recent(
            db=db,
            user_id=user_id,
            limit=10
        )

        context_block = ChatPromptBuilder.build_context_block(
            health_context=health_context
        )

        conversation_lines: list[str] = ["# CONVERSATION"]
        for msg in history:
            speaker = "Patient" if msg.role == ChatRole.USER else "Assistant"
            conversation_lines.append(f"{speaker}: {msg.content}")
        conversation_text = "\n".join(conversation_lines)

        user_prompt = f"{context_block}\n\n{conversation_text}"

        reply_text = self.ai_adapter.generate(
            system_instruction=ChatSystemInstruction.build_system_instruction(),
            user_prompt=user_prompt,
            response_schema=None
        )

        ChatMessageRepository.add(
            db=db,
            user_id=user_id,
            role=ChatRole.ASSISTANT,
            content=reply_text
        )

        return ChatResponse(reply=reply_text)