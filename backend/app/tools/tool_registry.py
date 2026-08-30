from app.tools.enum import ToolType
from app.tools.base_tool import BaseTool
from app.tools.clinical_knowledge_tool import ClinicalKnowledgeTool
from app.tools.medication_tool import MedicationTool
from app.core.exceptions.tools import ToolNotRegisteredError
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter

class ToolRegistry:

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
            ):

        self._tools: dict[ToolType, BaseTool] = {
            ToolType.CLINICAL_RESEARCH: ClinicalKnowledgeTool(ai_adapter),
            ToolType.MEDICATION: MedicationTool(ai_adapter)
        }


    def get_tool_registry(
            self,
            tool_type: ToolType
    ) -> BaseTool:

        try:
            return self._tools[tool_type]

        except KeyError:
            raise ToolNotRegisteredError(f"Tool '{tool_type.value}' is not registered."
            )