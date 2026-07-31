from app.dto.notification.base_notification import BaseNotificationDTO
from dataclasses import dataclass
from app.core.enums.notification_type import NotificationType


@dataclass(frozen=True)
class HealthInsightNotificationDTO(BaseNotificationDTO):

    
    summary: str
    recommendations: tuple[str, ...]


    def __post_init__(self):
        object.__setattr__(
            self,
            "notification_type",
            NotificationType.HEALTH_INSIGHT
        )

        object.__setattr__(
            self,
            "recommendations",
            tuple(self.recommendations)
        )