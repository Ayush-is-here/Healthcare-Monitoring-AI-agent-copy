from pydantic import BaseModel
from app.dto.agent.tool_payload.tool_result import ToolResult


class ExecutionResult(BaseModel):

    tool_results: list[ToolResult]