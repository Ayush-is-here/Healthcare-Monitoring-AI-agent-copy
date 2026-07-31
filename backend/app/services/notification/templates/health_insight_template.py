from app.dto.notification.notification_content import NotificationContent
from app.dto.notification.health_insight_notification import HealthInsightNotificationDTO


def build_health_insight_template(
        notification: HealthInsightNotificationDTO
        ) ->NotificationContent:

    recommendation_text = (
        "\n".join(f"• {recommendation}" for recommendation in notification.recommendations)
        if notification.recommendations
        else "• No specific recommendations recorded for this cycle."
    )
    
    return NotificationContent(
        title="Health Alert: Unusual Health Pattern Detected",
        body=f"""Hello {notification.recipient.name},

Our healthcare monitoring system detected one or more unusual patterns in your recent health data.

Summary
-------
{notification.summary}

Recommended Actions
-------------------
{recommendation_text}

This notification is informational and should not replace professional medical advice. If your symptoms are severe or worsening, please contact your healthcare provider promptly.""".strip()
    )