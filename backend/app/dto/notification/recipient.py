from dataclasses import dataclass


@dataclass(frozen=True)
class Recipient:
    name: str
    email: str