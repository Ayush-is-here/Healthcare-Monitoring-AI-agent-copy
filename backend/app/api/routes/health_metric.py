from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import get_current_user

from app.models.user import User

from app.schemas.health_metric import (
    HealthMetricCreate,
    HealthMetricUpdate,
    HealthMetricResponse,
)
from app.services.health_metric_service import HealthMetricService

router = APIRouter(
    prefix="/health-metrics",
    tags=["Health Metrics"]
)

@router.patch("/{metric_id}", response_model=HealthMetricResponse)
def update(
    metric_id: UUID,
    metric_data: HealthMetricUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    return HealthMetricService.update_metric(
        db=db,
        user_id=current_user.id,
        metric_data=metric_data,
        metric_id=metric_id
    )

@router.post(
        "/",
        response_model=HealthMetricResponse,
        status_code=status.HTTP_201_CREATED
        )
def create(
    metric_data: HealthMetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    
    return HealthMetricService.create_metric(
        db=db,
        user_id=current_user.id,
        metric_data=metric_data
    )

@router.delete("/{metric_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    metric_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)

):
    
    HealthMetricService.delete(
        db=db,
        user_id=current_user.id,
        metric_id=metric_id
    )
    
    return {
        "success": True,
        "message": "Health metric record successfully deleted from database."
    }
    
    
@router.get("/", response_model=list[HealthMetricResponse])
def list_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list[HealthMetricResponse]:
    
    return HealthMetricService.list_metrics(
        db=db,
        user_id=current_user.id
    )
    