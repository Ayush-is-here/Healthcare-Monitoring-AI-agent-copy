from abc import ABC, abstractmethod


class BaseAIAdapter(ABC):

    @abstractmethod
    def generate(
        self,
        system_instruction: str,
        user_prompt: str
    ) -> str:
        ...