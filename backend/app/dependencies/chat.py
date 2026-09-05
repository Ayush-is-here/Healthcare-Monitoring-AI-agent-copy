from app.dependencies.ai import get_ai_adapter


def get_chat_service() -> "ChatService":
    from app.services.ai.chat_service import ChatService

    return ChatService(ai_adapter=get_ai_adapter())