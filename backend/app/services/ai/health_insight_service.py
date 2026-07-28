from app.schemas.ai.health_context import HealthContext
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.services.ai.rule_engine.engine import RuleEngine
from app.services.ai.prompt.system_instruction import SystemInstruction
from app.services.ai.prompt.prompt_builder import PromptBuilder
import json
from app.schemas.ai.health_insight_response import HealthInsightResponse



class HealthInsightService:

    def __init__(
            self,
            ai_adapter: BaseAIAdapter
            ):
        self.ai_adapter = ai_adapter

    def get_health_insight(
            self,
            health_context: HealthContext
            ) -> HealthInsightResponse:

        rule_evaluation_results = RuleEngine.run(health_context)

        triggered_rules = rule_evaluation_results.triggered_rule_results

        system_instruction = SystemInstruction.build_system_instruction()

        user_prompt = PromptBuilder.build_prompt(
            health_context=health_context,
            triggered_rules=triggered_rules
        )

        response = self.ai_adapter.generate(
            system_instruction=system_instruction,
            user_prompt=user_prompt
        )

        parsed_response = json.loads(response)

        health_insight = HealthInsightResponse.model_validate(
            parsed_response
        )

        return health_insight