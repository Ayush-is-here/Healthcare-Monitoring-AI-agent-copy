from pydantic import BaseModel, ConfigDict
from app.models.enum import MetricType
from datetime import datetime

class LatestMetricContext(BaseModel):

    metric_type: MetricType 
    value: float
    unit: str
    recorded_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )