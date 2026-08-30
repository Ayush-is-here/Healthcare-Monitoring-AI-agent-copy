from app.dto.agent.tool_payload.base_tool_payload import BaseToolPayload
from app.dto.agent.tool_payload.medication.medication_snapshot import MedicationSnapshot
from pydantic import Field






class MedicationPayload(BaseToolPayload):

    medications: list[MedicationSnapshot] = Field(
        default_factory=list
    )
    
    lookup_issues: list[str] = Field(
        default_factory=list
    )

    interaction_summary: str | None = None
    warnings: dict[str, list[str]] = Field(
        default_factory=dict
    )
    interaction_disclaimer: str | None = None