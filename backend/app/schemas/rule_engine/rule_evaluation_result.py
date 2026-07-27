from pydantic import BaseModel, ConfigDict
from app.schemas.rule_engine.rule_result import RuleResult
from datetime import datetime

class RuleEvaluationResult(BaseModel):

    should_run_agent: bool
    triggered_rule_results: list[RuleResult]
    evaluation_time: datetime

    model_config = ConfigDict(
        from_attributes=True
    )