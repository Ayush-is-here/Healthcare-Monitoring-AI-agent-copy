from pydantic import BaseModel
from app.dto.agent.tool_payload.base_tool_payload import BaseToolPayload
from app.tools.enum import ToolType


class ToolResult(BaseModel):

    tool_type: ToolType
    payload: BaseToolPayload