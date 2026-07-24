from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.dashboard.dashboard import DashboardOverviewResponse
from app.services.dashboard.dashboard_service import DashboardService
from app.schemas.analytics.dashboard_analytics import DashboardAnalyticsResponse
from app.services.analytics.analytics_service import AnalyticsService



router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse
)
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return DashboardService.get_overview(
        db=db,
        user_id=current_user.id
    )


@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse
)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return AnalyticsService.get_dashboard_analytics(
        db=db,
        user_id=current_user.id
    )