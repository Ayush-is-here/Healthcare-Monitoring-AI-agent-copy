from app.services.ai.rule_engine.rules.base_rule import BaseRule
from app.services.ai.rule_engine.rules.metric.high_heart_rate_rule import HighHeartRateRule



class RuleRegistry:

    @staticmethod
    def get_rules() -> list[BaseRule]:

        rules =  [
            HighHeartRateRule()
        ]

        return rules