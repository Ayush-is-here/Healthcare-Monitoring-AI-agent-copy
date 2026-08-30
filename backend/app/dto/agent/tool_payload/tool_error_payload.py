from app.dto.agent.tool_payload.base_tool_payload import BaseToolPayload


class ToolErrorPayload(BaseToolPayload):

    error: str
