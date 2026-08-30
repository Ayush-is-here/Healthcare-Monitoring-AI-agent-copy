from app.agents.state import HealthInsightState
from app.dto.agent.execution_plan import ExecutionPlan
from app.tools.tool_registry import ToolRegistry
from app.dto.agent.execution_result import ExecutionResult
from app.dto.agent.tool_payload.tool_result import ToolResult
from app.dto.agent.tool_payload.tool_error_payload import ToolErrorPayload

import logging


logger = logging.getLogger(__name__)


class ToolExecutor:

    def __init__(self,registry: ToolRegistry):

        self._registry = registry


    def execute(
            self,
            plan: ExecutionPlan,
            state: HealthInsightState
    ) -> ExecutionResult:

        results: list[ToolResult] = []

        for tool_type in plan.steps:

            # A single failing tool must not discard the whole
            # insight. Record the failure in the payload so the
            # model can see the gap instead of guessing.
            try:
                tool = self._registry.get_tool_registry(tool_type)
                result = tool.execute(state)

            except Exception as e:
                logger.exception(
                    "Tool '%s' failed during execution.",
                    tool_type.value
                )

                result = ToolResult(
                    tool_type=tool_type,
                    payload=ToolErrorPayload(
                        error=(
                            f"This tool failed to execute "
                            f"({type(e).__name__}: {e}). Its data is "
                            f"unavailable for this analysis."
                        )
                    )
                )

            results.append(result)

        return ExecutionResult(
            tool_results=results
        )