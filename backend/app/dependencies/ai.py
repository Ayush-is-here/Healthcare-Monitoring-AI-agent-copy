from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.services.ai.adapters.gemini_adapter import GeminiAdapter
from fastapi import Depends
from app.services.ai.health_insight_service import HealthInsightService


def get_ai_adapter() -> BaseAIAdapter:
    return GeminiAdapter()

def get_health_insight_service(
        ai_adapter: BaseAIAdapter = Depends(get_ai_adapter)
) -> HealthInsightService:

    return HealthInsightService(ai_adapter=ai_adapter)