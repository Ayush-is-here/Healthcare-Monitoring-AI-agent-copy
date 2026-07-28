from pydantic import BaseModel, ConfigDict


class HealthInsightResponse(BaseModel):

    summary: str
    key_findings: list[str]
    risk_assessment: list[str]
    recommendations: list[str]
    when_to_seek_care: str