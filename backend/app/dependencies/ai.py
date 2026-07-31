from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.services.ai.adapters.gemini_adapter import GeminiAdapter
from app.services.ai.health_insight_service import HealthInsightService
from app.agents.health_agent import HealthAgent

def get_ai_adapter() -> BaseAIAdapter:
    return GeminiAdapter()


def get_health_agent() -> HealthAgent:

    return HealthAgent(ai_adapter=get_ai_adapter())

def get_health_insight_service() -> HealthInsightService:

    return HealthInsightService(health_agent=get_health_agent())