from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.ai.chat import ChatResponse, ChatRequest
from sqlalchemy.orm import Session
from app.dependencies.chat import get_chat_service
from app.models.user import User
from app.core.security import get_current_user, get_db
from app.services.ai.chat_service import ChatService
from app.repositories.profile_repository import ProfileRepository
from app.services.ai.health_context_service import HealthContextService



router = APIRouter(
    prefix="/ai",
    tags=["Chats"]
)



@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service)
    ) -> ChatResponse:

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

    return chat_service.chat(
        db=db,
        user_id=current_user.id,
        health_context=health_context,
        message=request.message
    )