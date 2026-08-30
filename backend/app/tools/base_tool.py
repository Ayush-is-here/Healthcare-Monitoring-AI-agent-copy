from abc import ABC, abstractmethod
from app.agents.state import HealthInsightState
from app.dto.agent.tool_payload.tool_result import ToolResult
from sqlalchemy.orm import Session


class BaseTool(ABC):


    @abstractmethod
    def execute(
        self,
        state: HealthInsightState,
        db: Session
        ) -> ToolResult:
        ...