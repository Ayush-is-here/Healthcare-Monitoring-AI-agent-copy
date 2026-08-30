from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.core.security import get_current_user, get_db
from app.repositories.profile_repository import ProfileRepository
from sqlalchemy.orm import Session
from app.services.ai.health_insight_service import HealthInsightService
from app.services.ai.health_context_service import HealthContextService
from app.schemas.ai.health_insight_response import HealthInsightResponse
from app.dependencies.ai import get_health_insight_service
from app.services.ai.rule_engine.engine import RuleEngine



router = APIRouter(
    prefix="/ai",
    tags=["Health Insights"]
)


@router.post("/health-insights",response_model=HealthInsightResponse)
def get_health_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    health_insight_service: HealthInsightService = Depends(get_health_insight_service)
    ) -> HealthInsightResponse :

    patient_profile = ProfileRepository.get_by_user_id(
        db=db,
        user_id=current_user.id
    )

    if patient_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found."
        )

    health_context = HealthContextService.build(
        db=db,
        patient_profile_id=patient_profile.id
    )

    return health_insight_service.get_health_insight(
        health_context=health_context,
        triggered_rules=[],
        user_id = current_user.id
    )