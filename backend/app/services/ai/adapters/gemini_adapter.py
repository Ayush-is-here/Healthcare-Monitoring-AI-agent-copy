from app.services.ai.adapters.base_ai_adapter import BaseAIAdapter
from app.core.config import settings
from google import genai
from google.genai.types import GenerateContentConfig
from app.core.exceptions.ai import AIProviderException
from app.schemas.ai.health_insight_response import HealthInsightResponse

class GeminiAdapter(BaseAIAdapter):

    def __init__(self):
        api_key = settings.gemini_api_key

        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-3.1-flash-lite"

    def generate(
        self,
        system_instruction: str,
        user_prompt: str,
        response_schema: type | None = None
    ) -> str:

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_prompt,

                config=GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2,

                    # JSON mode only when a schema defines the shape.
                    # Schema-less callers expect plain text.
                    response_mime_type=(
                        "application/json"
                        if response_schema is not None
                        else "text/plain"
                    ),
                    response_schema=response_schema
                )
            )
            return response.text

        except Exception as e:
            raise AIProviderException(
                "Failed to communicate with LLM provider."
            ) from e