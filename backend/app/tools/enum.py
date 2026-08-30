from enum import Enum



class ToolType(str, Enum):
    MEDICATION = "medication"
    CLINICAL_RESEARCH = "clinical_research"