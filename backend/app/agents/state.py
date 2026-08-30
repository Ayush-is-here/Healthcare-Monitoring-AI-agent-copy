from pydantic import BaseModel, ConfigDict, Field
from app.schemas.ai.health_context import HealthContext
from app.schemas.rule_engine.rule_result import RuleResult
from app.schemas.ai.health_insight_response import HealthInsightResponse
from app.dto.agent.tool_payload.tool_result import ToolResult
from app.tools.enum import ToolType
from uuid import UUID


class HealthInsightState(BaseModel):
    health_context: HealthContext
    triggered_rules: list[RuleResult] = Field(
        default_factory=list
    )

    user_id: UUID

    selected_tools: list[ToolType] = Field(
        default_factory=list
    )
    tool_results: list[ToolResult] = Field(
        default_factory=list
    )

    user_prompt: str | None = None
    raw_ai_response: str | None = None
    health_insight: HealthInsightResponse | None = None

    model_config = ConfigDict(
        from_attributes=True
    )