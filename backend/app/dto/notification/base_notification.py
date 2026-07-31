from dataclasses import dataclass, field
from app.dto.notification.recipient import Recipient
from app.core.enums.notification_type import NotificationType


@dataclass(frozen=True)
class BaseNotificationDTO:
    recipient: Recipient
    notification_type: NotificationType = field(init=False)