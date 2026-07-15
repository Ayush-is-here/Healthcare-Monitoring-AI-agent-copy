from fastapi import APIRouter, status, Depends
from app.schemas.medication import MedicationResponse, MedicationUpdate, MedicationCreate
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.security import get_current_user, get_db
from app.services.medication_service import MedicationService
from app.models.user import User


router = APIRouter(
    prefix="/medications",
    tags=["Medications"]
)

@router.post("/",response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create(
    medication: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    return MedicationService.create_medication(
        medication_data=medication,
        user_id=current_user.id,
        db=db
    )


@router.get("/",response_model=list[MedicationResponse])
def list_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ) -> list[MedicationResponse]:

    return MedicationService.list_medications(
        db=db,
        user_id=current_user.id
    )

@router.delete("/{medication_id}",status_code=status.HTTP_200_OK)
def delete(
    medication_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    MedicationService.delete_medication(
        db=db,
        user_id=current_user.id,
        medication_id=medication_id
    )
    

    return{
        "success": True,
        "message": "Medication record successfully deleted from database."
    }

@router.patch("/{medication_id}",response_model=MedicationResponse)
def update(
    medication_id: UUID,
    medication_data: MedicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
    ):

    return MedicationService.update_medication(
        db=db,
        user_id=current_user.id,
        medication_id=medication_id,
        medication_data=medication_data
    )