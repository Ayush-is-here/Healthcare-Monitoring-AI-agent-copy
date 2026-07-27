from app.services.ai.rule_engine.rules.base_rule import BaseRule
from app.schemas.rule_engine.rule_result import RuleResult
from app.schemas.ai.health_context import HealthContext
from app.models.enum import MetricType
from app.core.enums.rule_priority import RulePriority

class HighHeartRateRule(BaseRule):

    def __init__(
            self,
            threshold: float = 140
    ):
        self.threshold = threshold

    def evaluate(
            self,
            context: HealthContext
    ) -> RuleResult:

        for metric in context.latest_metrics:
            if metric.metric_type == MetricType.HEART_RATE:
                value = metric.value
                if value > self.threshold:
                    return RuleResult(
                        triggered=True,
                        rule_name= "high_heart_rate",
                        priority=RulePriority.HIGH,
                        reason=f"Heart rate of {metric.value} exceeds threshold of {self.threshold} BPM."
                    )
                return RuleResult(
                    triggered=False,
                    rule_name="high_heart_rate",
                    priority=None,
                    reason=f"Heart rate within acceptable range."
                    )

        return RuleResult(
            triggered=False,
            rule_name="high_heart_rate",
            priority=None,
            reason="No active heart rate metric found."
        )