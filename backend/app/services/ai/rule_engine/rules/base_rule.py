from abc import ABC, abstractmethod
from app.schemas.ai.health_context import HealthContext
from app.schemas.rule_engine.rule_result import RuleResult


class BaseRule(ABC):

    @abstractmethod
    def evaluate(
        self,
        context: HealthContext
    ) -> RuleResult:
        ...