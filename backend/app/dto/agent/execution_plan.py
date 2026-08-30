from pydantic import BaseModel, Field
from app.tools.enum import ToolType
from app.dto.agent.execution_result import ExecutionResult


class ExecutionPlan(BaseModel):

    steps: list[ToolType] = Field(default_factory=list)
    decision_summary: str | None = None