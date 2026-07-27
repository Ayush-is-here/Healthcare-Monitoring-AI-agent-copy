from app.schemas.ai.health_context import HealthContext
from app.schemas.rule_engine.rule_evaluation_result import RuleEvaluationResult
from app.services.ai.rule_engine.registry import RuleRegistry
from app.schemas.rule_engine.rule_result import RuleResult
from datetime import datetime, UTC

class RuleEngine:

    @staticmethod
    def run(
        context: HealthContext
    ) -> RuleEvaluationResult:

        rules = RuleRegistry.get_rules()

        triggered_rule_results: list[RuleResult] = []

        for rule in rules:
            result = rule.evaluate(context)

            if result.triggered:
                triggered_rule_results.append(result)


        return RuleEvaluationResult(
            should_run_agent=bool(triggered_rule_results),
            triggered_rule_results=triggered_rule_results,
            evaluation_time=datetime.now(UTC)
        )