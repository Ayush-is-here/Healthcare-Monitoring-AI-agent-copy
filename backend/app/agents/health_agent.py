from app.agents.graph import build_graph
from app.schemas.ai.health_context import HealthContext
from app.schemas.rule_engine.rule_result import RuleResult
from app.agents.state import HealthInsightState
from app.schemas.ai.health_insight_response import HealthInsightResponse
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter



class HealthAgent:

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
    ):

        self.graph = build_graph(ai_adapter=ai_adapter)


    def run(
            self,
            health_context: HealthContext,
            triggered_rules: list[RuleResult]
    ) -> HealthInsightResponse:

        state = HealthInsightState(
            health_context=health_context,
            triggered_rules=triggered_rules
        )

        result = self.graph.invoke(state)

        if result["health_insight"] is None:
            raise RuntimeError(
                "Graph finished without producing Health Insights."
            )

        return result["health_insight"]