from fastapi import APIRouter, Depends, status
from app.database.session import get_db
from app.core.security import get_current_user
from sqlalchemy.orm import Session
from app.schemas.patient_profile import PatientProfileUpdate, PatientProfileResponse, PatientProfileCreate
from app.models.user import User
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profile",
    tags=["Patient Profile"]
)

@router.patch("/", response_model=PatientProfileResponse)
def update_profile(
    profile_data: PatientProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    ):
    return ProfileService.update_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_data
    )

@router.post("/profile",
             response_model=PatientProfileResponse,
             status_code=status.HTTP_201_CREATED
             )
def create_profile(
    profile_data: PatientProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session= Depends(get_db),
    ):
    return ProfileService.create_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_data
    )
@router.get("/",response_model=PatientProfileResponse,status_code=status.HTTP_200_OK)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ProfileService.get_profile(
        db=db,
        user_id=current_user.id
    )