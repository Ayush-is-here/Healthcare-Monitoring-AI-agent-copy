from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.services.ai.adapters.gemini_adapter import GeminiAdapter
from app.tools.tool_registry import ToolRegistry
from app.agents.tool_executor import ToolExecutor


def get_ai_adapter() -> BaseAIAdapter:
    return GeminiAdapter()

def get_planner(
        ai_adapter: BaseAIAdapter
        ) -> "Planner":

    from app.agents.planner import Planner

    return Planner(ai_adapter=ai_adapter)

def get_tool_registry(
        ai_adapter: BaseAIAdapter
) -> ToolRegistry:

    return ToolRegistry(
        ai_adapter=ai_adapter
    )

def get_tool_executor(
        ai_adapter: BaseAIAdapter
) -> ToolExecutor:

    registry = get_tool_registry(ai_adapter=ai_adapter)

    return ToolExecutor(registry=registry)

    
def get_health_agent() -> "HealthAgent":

    from app.agents.health_agent import HealthAgent


    ai_adapter = get_ai_adapter()
    planner = get_planner(ai_adapter=ai_adapter)
    tool_executor = get_tool_executor(ai_adapter=ai_adapter)

    return HealthAgent(
        ai_adapter=ai_adapter,
        planner=planner,
        executor=tool_executor
    )

def get_health_insight_service() -> "HealthInsightService":
    from app.services.ai.health_insight_service import HealthInsightService
    return HealthInsightService(health_agent=get_health_agent())