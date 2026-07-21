from abc import ABC, abstractmethod

class EmailClient(ABC):

    @abstractmethod
    def send(
        self,
        recipient: str,
        subject: str,
        body: str
    ) -> None:
        pass