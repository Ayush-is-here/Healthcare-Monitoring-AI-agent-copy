import resend
from app.core.config import settings
from app.services.email.email_client import EmailClient

class ResendEmailClient(EmailClient):

    def __init__(self):
        resend.api_key = settings.resend_api_key

    def send(
            self,
            recipient: str,
            subject: str,
            body: str
    ) -> None:
        
        resend.Emails.send(
            {
                "from": "onboarding@resend.dev",  #change to "settings.otification_sender_email"
                "to": recipient,  #change to ""recipient" later
                "subject": subject,
                "text": body
            }
        )
        