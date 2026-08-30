from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Healthcare Monitoring AI platform"
    database_url: str
    secret_key: str
    access_token_expire_minutes: int
    jwt_algorithm: str
    redis_url: str
    resend_api_key: str
    notification_sender_email: str
    gemini_api_key: str

    pubmed_email: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()