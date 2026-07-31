from app.schemas.ai.health_context import HealthContext
from app.schemas.ai.health_insight_response import HealthInsightResponse
from app.schemas.rule_engine.rule_result import RuleResult
from app.agents.health_agent import HealthAgent

class HealthInsightService:

    def __init__(
            self,
            health_agent: HealthAgent
    ):
        self.health_agent = health_agent

    def get_health_insight(
            self,
            health_context: HealthContext,
            triggered_rules: list[RuleResult]
            ) -> HealthInsightResponse:


        return self.health_agent.run(
            health_context=health_context,
            triggered_rules=triggered_rules
        )