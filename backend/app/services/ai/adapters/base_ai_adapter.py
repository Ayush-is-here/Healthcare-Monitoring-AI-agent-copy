from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar("T")

class BaseAIAdapter(ABC):

    @abstractmethod
    def generate(
        self,
        system_instruction: str,
        user_prompt: str,
        response_schema: type[T] | None = None
    ) -> str:
        ...