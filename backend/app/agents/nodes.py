from app.agents.state import HealthInsightState
from app.services.ai.prompt.prompt_builder import PromptBuilder
from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.services.ai.prompt.system_instruction import SystemInstruction
import json
from app.schemas.ai.health_insight_response import HealthInsightResponse
from json import JSONDecodeError
from app.core.exceptions.ai import (
    AIValidationException,
    AIResponseParsingException
)
from pydantic import ValidationError
from typing import Any


def prompt_node(state: HealthInsightState) -> dict[str, Any]:

    user_prompt = PromptBuilder.build_prompt(
        health_context=state.health_context,
        triggered_rules=state.triggered_rules
    )

    return {
        "user_prompt": user_prompt
    }

def generate_response_node(
        state: HealthInsightState,
        ai_adapter: BaseAIAdapter
        ) -> dict[str, Any]:

    system_instruction = SystemInstruction.build_system_instruction()

    raw_response = ai_adapter.generate(
        system_instruction=system_instruction,
        user_prompt=state.user_prompt
    )

    return {
        "raw_ai_response": raw_response
    }

def parser_node(
        state: HealthInsightState
        ) -> dict[str, Any]:

    try:
        parsed_response = json.loads(
            state.raw_ai_response
            )

    except JSONDecodeError as e:
        raise AIResponseParsingException(
            "AI returned invalid JSON."
        ) from e

    try:
        health_insight = (
            HealthInsightResponse.model_validate(
                parsed_response
            )
        )

    except ValidationError as e:
        raise AIValidationException(
            "AI response validation failed."
        ) from e


    return {
        "health_insight": health_insight
    }