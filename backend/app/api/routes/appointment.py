from fastapi import status, APIRouter, Depends
from app.schemas.appointment import AppointmentResponse, AppointmentCreate, AppointmentUpdate
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from uuid import UUID
from app.services.appointment_service import AppointmentService
from app.models.user import User

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post("/",response_model=AppointmentResponse,status_code=status.HTTP_201_CREATED)
def create(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    ):

    return AppointmentService.create_appointment(
        db=db,
        user_id=current_user.id,
        appointment_data=appointment_data
    )

@router.get("/",response_model=list[AppointmentResponse])
def list_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    ) -> list[AppointmentResponse]:
    return AppointmentService.list_appointments(
        db=db,
        user_id=current_user.id
        )

@router.patch(
    "/{appointment_id}",
    response_model=AppointmentResponse
    )
def update(
    appointment_id: UUID,
    appointment_data: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    ):

    return AppointmentService.update_appointment(
        db=db,
        user_id=current_user.id,
        appointment_id=appointment_id,
        appointment_data=appointment_data
    )

@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_200_OK
)
def delete(
    appointment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    AppointmentService.delete_appointment(
        db=db,
        user_id=current_user.id,
        appointment_id=appointment_id
    )

    return {
        "success": True,
        "message": "Appointment record successfully deleted from database."
    }