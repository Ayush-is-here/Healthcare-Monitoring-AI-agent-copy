from fastapi import APIRouter
from app.schemas.medication_reminder import (
    MedicationReminderResponse,
    MedicationReminderUpdate,
    MedicationReminderCreate
)
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database.session import get_db
from app.models.user import User
from app.core.security import get_current_user
from uuid import UUID
from app.services.medication_reminder_service import MedicationReminderService
from fastapi import status

router = APIRouter(
    prefix="/medication-reminders",
    tags=["Medication Reminders"]
)

@router.patch("/{medication_reminder_id}", response_model=MedicationReminderResponse)
def update(
    medication_reminder_id: UUID,
    medication_reminder_data: MedicationReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    return MedicationReminderService.update_medication_reminder(
        db=db,
        user_id=current_user.id,
        medication_reminder_id=medication_reminder_id,
        medication_reminder_data=medication_reminder_data
    )

@router.post("/", response_model=MedicationReminderResponse,
             status_code=status.HTTP_201_CREATED)
def create(
    medication_reminder_data: MedicationReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return MedicationReminderService.create_medication_reminder(
        db=db,
        user_id=current_user.id,
        medication_reminder_data=medication_reminder_data
    )

@router.delete("/{medication_reminder_id}",
               status_code=status.HTTP_200_OK)
def delete(
    medication_reminder_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    MedicationReminderService.delete_medication_reminder(
        db=db,
        user_id=current_user.id,
        medication_reminder_id=medication_reminder_id
    )

    return {
            "success": True,
            "message": "Medication reminder record successfully deleted from database."
            }

@router.get("/{medication_id}/reminders",
            response_model=list[MedicationReminderResponse],
            status_code=status.HTTP_200_OK)
def list_medication_reminders(
    medication_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return MedicationReminderService.list_medication_reminders(
        db=db,
        user_id=current_user.id,
        medication_id=medication_id
    )