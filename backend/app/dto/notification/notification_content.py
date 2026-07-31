from dataclasses import dataclass


@dataclass(frozen=True)
class NotificationContent:
    title: str
    body: str