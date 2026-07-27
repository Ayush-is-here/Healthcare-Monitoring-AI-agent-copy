from app.models.medication import Medication
from app.schemas.ai.medication_context import MedicationContext


class MedicationContextBuilder:

    @staticmethod
    def build(
        medication: Medication
    ) -> MedicationContext:

        return MedicationContext(
            medicine_name=medication.medicine_name,
            dosage=medication.dosage,
            dosage_unit=medication.dosage_unit,
            frequency=medication.frequency,
            is_active=medication.is_active,
            start_date=medication.start_date,
            end_date=medication.end_date,
            instructions=medication.instructions
        )